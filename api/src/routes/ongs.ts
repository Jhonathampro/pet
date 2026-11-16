import { Router } from 'express';
import { z } from 'zod';
import { requireOng } from '../auth.js';
import { Where, buildUpdate, query, queryOne } from '../db.js';
import { HttpError, notFound, optionalText, pageSql, pagination, parse, queryBool, text, uf } from '../http.js';
import { ONG_SELECT, PET_SELECT } from '../selects.js';

export const ongsRouter = Router();

// vazio é aceito: ONG recém-cadastrada ainda não tem logo/capa
const url = z.string().trim().max(2000).regex(/^(https?:\/\/.*)?$/, 'Informe uma URL http(s).');
const short = z.string().trim().max(120);

const ongPatchSchema = z.object({
  name: text(120),
  city: text(120),
  state: uf,
  address: z.string().trim().max(200),
  neighborhood: short,
  description: z.string().trim().max(3000),
  logo: url,
  coverImage: url,
  phone: z.string().trim().max(30),
  whatsapp: z.string().trim().max(30),
  email: z.string().trim().max(254),
  instagram: short,
  website: z.string().trim().max(200).nullable(),
  acceptsFood: z.boolean(),
  providesFood: z.boolean(),
  acceptsDonations: z.boolean(),
  offersVaccination: z.boolean(),
  pixKey: short,
  rescuedTotal: z.number().int().min(0),
  bank: z.object({
    bankName: short,
    code: z.string().trim().max(10),
    agency: z.string().trim().max(20),
    account: z.string().trim().max(30),
    accountType: short,
  }).partial(),
}).partial();

const listSchema = z.object({
  city: optionalText(120),
  state: optionalText(2),
  acceptsFood: queryBool,
  providesFood: queryBool,
  acceptsDonations: queryBool,
  offersVaccination: queryBool,
  q: optionalText(120),
  ...pagination,
});

const getOng = (id: string) => queryOne(`${ONG_SELECT} WHERE o.id = $1`, [id]);

ongsRouter.get('/', async (req, res) => {
  const f = parse(listSchema, req.query);
  const where = new Where()
    .add('o.city ILIKE ?', f.city)
    .add('o.state ILIKE ?', f.state)
    .add('o.accepts_food = ?', f.acceptsFood)
    .add('o.provides_food = ?', f.providesFood)
    .add('o.accepts_donations = ?', f.acceptsDonations)
    .add('o.offers_vaccination = ?', f.offersVaccination)
    .add("(o.name ILIKE '%' || ? || '%' OR o.neighborhood ILIKE '%' || ? || '%')", f.q);
  res.json(
    await query(`${ONG_SELECT} ${where.sql} ORDER BY o.created_at, o.id${pageSql(f)}`, where.values),
  );
});

ongsRouter.get('/:id', async (req, res) => {
  const ong = await getOng(req.params.id);
  if (!ong) throw notFound('ONG');
  res.json(ong);
});

ongsRouter.get('/:id/pets', async (req, res) => {
  res.json(
    await query(`${PET_SELECT} WHERE p.ong_id = $1 ORDER BY p.created_at DESC, p.id`, [
      req.params.id,
    ]),
  );
});

// Configurações da ONG (aba "Configurações" do painel). Só a própria ONG altera.
ongsRouter.patch('/:id', requireOng, async (req, res) => {
  if (req.params.id !== req.auth!.ongId) {
    throw new HttpError(403, 'Você só pode alterar os dados da sua própria ONG.');
  }
  const { bank, ...b } = parse(ongPatchSchema, req.body);
  const { set, values } = buildUpdate(
    { ...b, ...bank },
    {
      name: 'name', city: 'city', state: 'state', address: 'address',
      neighborhood: 'neighborhood', description: 'description', logo: 'logo',
      coverImage: 'cover_image', phone: 'phone', whatsapp: 'whatsapp', email: 'email',
      instagram: 'instagram', website: 'website', acceptsFood: 'accepts_food',
      providesFood: 'provides_food', acceptsDonations: 'accepts_donations',
      offersVaccination: 'offers_vaccination', pixKey: 'pix_key', rescuedTotal: 'rescued_total',
      bankName: 'bank_name', code: 'bank_code', agency: 'bank_agency', account: 'bank_account',
      accountType: 'bank_account_type',
    },
  );
  await query(
    `UPDATE ongs SET ${set ? `${set}, ` : ''}updated_at = now() WHERE id = $${values.length + 1}`,
    [...values, req.params.id],
  );
  res.json(await getOng(req.params.id as string));
});
