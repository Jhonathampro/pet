import { Router } from 'express';
import { z } from 'zod';
import { requireOng } from '../auth.js';
import { Where, buildUpdate, query, queryOne } from '../db.js';
import { notFound, optionalText, pageSql, pagination, parse, text, uf } from '../http.js';
import { PET_SELECT } from '../selects.js';

export const petsRouter = Router();

const species = z.enum(['Cachorro', 'Gato']);
const sex = z.enum(['Macho', 'Fêmea']);
const size = z.enum(['Pequeno', 'Médio', 'Grande']);
const ageCategory = z.enum(['Filhote', 'Jovem', 'Adulto', 'Sênior']);
const status = z.enum(['Disponível', 'Em processo de adoção', 'Adotado']);
// raça em branco vira SRD (sem raça definida)
const breed = z.string().trim().max(80).transform((v) => v || 'SRD');
const imageUrl = z.string().trim().max(2000).regex(/^https?:\/\//, 'Informe uma URL http(s).');

const petSchema = z.object({
  name: text(80),
  species,
  breed: breed.default('SRD'),
  age: text(40),
  ageCategory: ageCategory.optional(),
  sex,
  size,
  city: text(120),
  state: uf,
  description: z.string().trim().max(3000).default(''),
  personality: z.array(text(40)).max(12).default([]),
  image: imageUrl,
  gallery: z.array(imageUrl).max(12).optional(),
  status: status.default('Disponível'),
  vaccinated: z.boolean().default(false),
  neutered: z.boolean().default(false),
  dewormed: z.boolean().default(false),
  specialNeeds: optionalText(500),
});

// No PATCH nada é obrigatório e nenhum default é aplicado.
const petPatchSchema = z.object({
  name: text(80),
  species,
  breed,
  age: text(40),
  ageCategory,
  sex,
  size,
  city: text(120),
  state: uf,
  description: z.string().trim().max(3000),
  personality: z.array(text(40)).max(12),
  image: imageUrl,
  gallery: z.array(imageUrl).max(12),
  status,
  vaccinated: z.boolean(),
  neutered: z.boolean(),
  dewormed: z.boolean(),
  specialNeeds: z.string().trim().max(500).nullable(),
}).partial();

const listSchema = z.object({
  species: species.optional(),
  sex: sex.optional(),
  size: size.optional(),
  ageCategory: ageCategory.optional(),
  status: status.optional(),
  city: optionalText(120),
  state: optionalText(2),
  ongId: optionalText(80),
  q: optionalText(120),
  ...pagination,
});

/** "8 meses" -> Filhote, "1 ano" -> Jovem, "3 anos" -> Adulto, "9 anos" -> Sênior */
export function deriveAgeCategory(age: string): z.infer<typeof ageCategory> {
  const lower = age.toLowerCase();
  if (/m[eê]s|semana|dia/.test(lower)) return 'Filhote';
  const years = Number(lower.match(/\d+/)?.[0] ?? NaN);
  if (Number.isNaN(years)) return 'Adulto';
  if (years < 1) return 'Filhote';
  if (years < 2) return 'Jovem';
  if (years < 8) return 'Adulto';
  return 'Sênior';
}

const getPet = (id: string) => queryOne(`${PET_SELECT} WHERE p.id = $1`, [id]);

petsRouter.get('/', async (req, res) => {
  const f = parse(listSchema, req.query);
  const where = new Where()
    .add('p.species = ?', f.species)
    .add('p.sex = ?', f.sex)
    .add('p.size = ?', f.size)
    .add('p.age_category = ?', f.ageCategory)
    .add('p.status = ?', f.status)
    .add('p.city ILIKE ?', f.city)
    .add('p.state ILIKE ?', f.state)
    .add('p.ong_id = ?', f.ongId)
    .add(
      "(p.name ILIKE '%' || ? || '%' OR p.breed ILIKE '%' || ? || '%' OR p.description ILIKE '%' || ? || '%')",
      f.q,
    );
  res.json(
    await query(
      `${PET_SELECT} ${where.sql} ORDER BY p.created_at DESC, p.id${pageSql(f)}`,
      where.values,
    ),
  );
});

petsRouter.get('/:id', async (req, res) => {
  const pet = await getPet(req.params.id);
  if (!pet) throw notFound('Pet');
  res.json(pet);
});

petsRouter.post('/', requireOng, async (req, res) => {
  const b = parse(petSchema, req.body);
  const created = await queryOne<{ id: string }>(
    `INSERT INTO pets (ong_id, name, species, breed, age, age_category, sex, size, city, state,
                       description, personality, image, gallery, status, vaccinated, neutered,
                       dewormed, special_needs)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
     RETURNING id`,
    [
      req.auth!.ongId, b.name, b.species, b.breed, b.age, b.ageCategory ?? deriveAgeCategory(b.age),
      b.sex, b.size, b.city, b.state, b.description, b.personality, b.image,
      b.gallery?.length ? b.gallery : [b.image], b.status, b.vaccinated, b.neutered, b.dewormed,
      b.specialNeeds ?? null,
    ],
  );
  res.status(201).json(await getPet(created!.id));
});

petsRouter.patch('/:id', requireOng, async (req, res) => {
  const b = parse(petPatchSchema, req.body);
  const { set, values } = buildUpdate(b, {
    name: 'name', species: 'species', breed: 'breed', age: 'age', ageCategory: 'age_category',
    sex: 'sex', size: 'size', city: 'city', state: 'state', description: 'description',
    personality: 'personality', image: 'image', gallery: 'gallery', status: 'status',
    vaccinated: 'vaccinated', neutered: 'neutered', dewormed: 'dewormed',
    specialNeeds: 'special_needs',
  });
  // o filtro por ong_id garante que uma ONG só altera os próprios pets
  const updated = await queryOne(
    `UPDATE pets SET ${set ? `${set}, ` : ''}updated_at = now()
     WHERE id = $${values.length + 1} AND ong_id = $${values.length + 2} RETURNING id`,
    [...values, req.params.id, req.auth!.ongId],
  );
  if (!updated) throw notFound('Pet');
  res.json(await getPet(req.params.id as string));
});

petsRouter.delete('/:id', requireOng, async (req, res) => {
  const deleted = await queryOne('DELETE FROM pets WHERE id = $1 AND ong_id = $2 RETURNING id', [
    req.params.id,
    req.auth!.ongId,
  ]);
  if (!deleted) throw notFound('Pet');
  res.status(204).end();
});
