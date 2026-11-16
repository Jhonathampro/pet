import type { Request } from 'express';
import { Router } from 'express';
import { z } from 'zod';
import { optionalAuth, requireAuth } from '../auth.js';
import { Where, query, queryOne } from '../db.js';
import { HttpError, notFound, optionalText, pageSql, pagination, parse, text, uf } from '../http.js';
import { FOOD_SELECT, loadUser } from '../selects.js';

export const foodRouter = Router();

const quantityKg = z.coerce.number().positive().max(100_000);

const itemSchema = z.object({
  type: z.enum(['need', 'available']),
  foodType: text(120),
  quantityKg,
  name: optionalText(120), // quem doa/solicita (visitante); logado usa o nome da conta por padrão
  contact: optionalText(60),
  title: optionalText(160),
  description: optionalText(2000),
  locationDetails: optionalText(200),
  urgency: z.enum(['Alta', 'Média', 'Normal']).optional(),
  city: optionalText(120),
  state: uf.optional(),
});

const responseSchema = z.object({
  name: text(120),
  phone: text(30),
  quantityKg,
  foodType: optionalText(120),
  notes: optionalText(2000),
});

const listSchema = z.object({
  type: z.enum(['need', 'available']).optional(),
  status: z.enum(['Aberto', 'Concluído']).optional(),
  role: z.enum(['ong', 'user']).optional(),
  city: optionalText(120),
  state: optionalText(2),
  ...pagination,
});

const getItem = (id: string) => queryOne(`${FOOD_SELECT} WHERE f.id = $1`, [id]);

/** Dono do item: o usuário que publicou ou a ONG a que ele pertence. */
async function assertOwner(req: Request): Promise<void> {
  const item = await queryOne<{ user_id: string | null; ong_id: string | null }>(
    'SELECT user_id, ong_id FROM food_bank_items WHERE id = $1',
    [req.params.id],
  );
  if (!item) throw notFound('Item do banco de ração');
  const auth = req.auth!;
  const owns = item.user_id === auth.id || (!!auth.ongId && item.ong_id === auth.ongId);
  if (!owns) throw new HttpError(403, 'Este item foi publicado por outra conta.');
}

foodRouter.get('/', async (req, res) => {
  const f = parse(listSchema, req.query);
  const where = new Where()
    .add('f.type = ?', f.type)
    .add('f.status = ?', f.status)
    .add('f.role = ?', f.role)
    .add('f.city ILIKE ?', f.city)
    .add('f.state ILIKE ?', f.state);
  res.json(
    await query(`${FOOD_SELECT} ${where.sql} ORDER BY f.created_at DESC, f.id${pageSql(f)}`, where.values),
  );
});

// Publica uma oferta ('available') ou um pedido ('need'). Visitante também pode.
foodRouter.post('/', optionalAuth, async (req, res) => {
  const b = parse(itemSchema, req.body);
  const user = await loadUser(req);
  const isOng = user?.role === 'ong';

  const city = b.city ?? user?.city;
  const state = b.state ?? user?.state;
  if (!city || !state) throw new HttpError(400, 'Informe cidade e estado.');
  const contact = b.contact ?? user?.phone;
  if (!contact) throw new HttpError(400, 'Informe um telefone de contato.');

  const available = b.type === 'available';
  const created = await queryOne<{ id: string }>(
    `INSERT INTO food_bank_items (type, title, org_or_user_name, role, user_id, ong_id, food_type,
                                  quantity_kg, city, state, location_details, description, contact,
                                  urgency)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
    [
      b.type,
      b.title ?? (available
        ? `Disponibilização de ${b.quantityKg} kg de ${b.foodType}`
        : `Pedido de auxílio: ${b.quantityKg} kg de ${b.foodType}`),
      // ONG publica sempre em nome da ONG
      (isOng ? user.name : b.name ?? user?.name) ?? (available ? 'Doador Solidário' : 'Protetor em necessidade'),
      isOng ? 'ong' : 'user',
      user?.id ?? null,
      user?.ongId ?? null,
      b.foodType,
      b.quantityKg,
      city,
      state,
      b.locationDetails ?? (available ? 'Retirada a combinar' : ''),
      b.description ?? (available
        ? 'Ração disponível para doação solidária a abrigos ou protetores.'
        : 'Auxílio solicitado para alimentação de animais acolhidos.'),
      contact,
      b.urgency ?? (available ? null : 'Média'),
    ],
  );
  res.status(201).json(await getItem(created!.id));
});

// Dono marca como concluído (ou reabre).
foodRouter.patch('/:id', requireAuth, async (req, res) => {
  const { status } = parse(z.object({ status: z.enum(['Aberto', 'Concluído']) }), req.body);
  await assertOwner(req);
  await query('UPDATE food_bank_items SET status = $1 WHERE id = $2', [status, req.params.id]);
  res.json(await getItem(req.params.id as string));
});

// Resposta a um item: "quero doar para este pedido" / "quero este lote disponível".
foodRouter.post('/:id/responses', optionalAuth, async (req, res) => {
  const b = parse(responseSchema, req.body);
  const item = await queryOne<{ status: string }>(
    'SELECT status FROM food_bank_items WHERE id = $1',
    [req.params.id],
  );
  if (!item) throw notFound('Item do banco de ração');
  if (item.status !== 'Aberto') throw new HttpError(409, 'Este item já foi concluído.');
  const created = await queryOne(
    `INSERT INTO food_bank_responses (item_id, user_id, name, phone, quantity_kg, food_type, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, item_id AS "itemId", name, phone, quantity_kg AS "quantityKg",
               food_type AS "foodType", notes, created_at AS "createdAt"`,
    [req.params.id, req.auth?.id ?? null, b.name, b.phone, b.quantityKg, b.foodType ?? null, b.notes ?? ''],
  );
  res.status(201).json(created);
});

// Contatos recebidos em um item — só o dono vê (têm nome e telefone de terceiros).
foodRouter.get('/:id/responses', requireAuth, async (req, res) => {
  await assertOwner(req);
  res.json(
    await query(
      `SELECT id, item_id AS "itemId", name, phone, quantity_kg AS "quantityKg",
              food_type AS "foodType", notes, created_at AS "createdAt"
         FROM food_bank_responses WHERE item_id = $1 ORDER BY created_at DESC`,
      [req.params.id],
    ),
  );
});
