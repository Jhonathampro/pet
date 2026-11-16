import { Router } from 'express';
import { z } from 'zod';
import { optionalAuth } from '../auth.js';
import { Where, query, queryOne, withTransaction } from '../db.js';
import { HttpError, isoDate, notFound, optionalText, pageSql, pagination, parse, queryBool, text, uf } from '../http.js';
import { REPORT_SELECT, REPORT_STATUS, loadUser } from '../selects.js';

export const reportsRouter = Router();

const statusEnum = z.enum(['Ativo', 'Confirmado por múltiplos registros', 'Expirado']);

const reportSchema = z.object({
  photoUrl: z
    .string().trim().max(2000).regex(/^https?:\/\//, 'Informe uma URL http(s).')
    .optional().or(z.literal('')),
  address: text(200),
  neighborhood: z.string().trim().max(120).default(''),
  city: text(120),
  state: uf,
  date: isoDate,
  description: z.string().trim().max(3000).default(''),
  species: z.enum(['Cachorro', 'Gato', 'Outro']),
  healthCondition: z.enum(['Sadio', 'Debilitado / Desnutrido', 'Ferido']),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});

const listSchema = z.object({
  status: statusEnum.optional(),
  includeExpired: queryBool, // padrão: true (o front decide se mostra o histórico)
  species: z.enum(['Cachorro', 'Gato', 'Outro']).optional(),
  city: optionalText(120),
  state: optionalText(2),
  ...pagination,
});

const getReport = (id: string) => queryOne(`${REPORT_SELECT} WHERE r.id = $1`, [id]);

reportsRouter.get('/', async (req, res) => {
  const f = parse(listSchema, req.query);
  const where = new Where()
    .add(`${REPORT_STATUS} = ?`, f.status)
    .add('r.species = ?', f.species)
    .add('r.city ILIKE ?', f.city)
    .add('r.state ILIKE ?', f.state);
  if (f.includeExpired === false) where.raw(`${REPORT_STATUS} <> 'Expirado'`);
  res.json(
    await query(
      `${REPORT_SELECT} ${where.sql} ORDER BY r.created_at DESC, r.id${pageSql(f)}`,
      where.values,
    ),
  );
});

reportsRouter.get('/:id', async (req, res) => {
  const report = await getReport(req.params.id);
  if (!report) throw notFound('Registro de abandono');
  res.json(report);
});

// Visitante também pode denunciar (fica como "Cidadão Anônimo").
reportsRouter.post('/', optionalAuth, async (req, res) => {
  const b = parse(reportSchema, req.body);
  if (b.date > new Date(Date.now() + 86_400_000).toISOString().slice(0, 10)) {
    throw new HttpError(400, 'A data do ocorrido não pode estar no futuro.');
  }
  const user = await loadUser(req);
  const created = await queryOne<{ id: string }>(
    `INSERT INTO abandonment_reports (user_id, reported_by, reported_by_role, photo_url, address,
                                      neighborhood, city, state, date, description, species,
                                      health_condition, lat, lng)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING id`,
    [
      user?.id ?? null, user?.name ?? 'Cidadão Anônimo', user?.role ?? 'guest', b.photoUrl ?? '',
      b.address, b.neighborhood, b.city, b.state, b.date, b.description, b.species,
      b.healthCondition, b.lat ?? null, b.lng ?? null,
    ],
  );
  res.status(201).json(await getReport(created!.id));
});

// "Também vi este caso": soma um registro e o ponto passa a ser confirmado.
reportsRouter.post('/:id/corroborate', optionalAuth, async (req, res) => {
  const reportId = req.params.id as string;
  await withTransaction(async (client) => {
    const updated = await queryOne(
      `UPDATE abandonment_reports
          SET report_count = report_count + 1, last_corroborated_at = now()
        WHERE id = $1 RETURNING id`,
      [reportId],
      client,
    );
    if (!updated) throw notFound('Registro de abandono');
    await query(
      'INSERT INTO report_corroborations (report_id, user_id) VALUES ($1, $2)',
      [reportId, req.auth?.id ?? null],
      client,
    );
  }).catch((err) => {
    if (err.code === '23505') throw new HttpError(409, 'Você já reforçou este registro.');
    throw err;
  });
  res.json(await getReport(reportId));
});
