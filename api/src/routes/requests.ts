// Interesses de adoção, doações financeiras e pedidos de vacinação.
import { randomInt } from 'node:crypto';
import { Router } from 'express';
import { z } from 'zod';
import { optionalAuth, requireOng, requireUser } from '../auth.js';
import { queryOne } from '../db.js';
import { HttpError, isoDate, notFound, optionalText, parse, text } from '../http.js';
import { DONATION_SELECT, INTEREST_SELECT, VACCINATION_SELECT, loadUser } from '../selects.js';

const email = z.string().trim().max(254).pipe(z.email('E-mail inválido.'));

// ---------------------------------------------------------------- adoção
export const interestsRouter = Router();

const interestSchema = z.object({
  petId: text(80),
  userName: optionalText(120),
  userEmail: email.optional(),
  userPhone: optionalText(30),
  housingType: z.enum(['Casa com quintal', 'Apartamento', 'Chácara / Sítio', 'Outro']),
  message: optionalText(2000),
});

// "Tenho interesse em adotar": exige login de usuário (ONG não adota).
interestsRouter.post('/', requireUser, async (req, res) => {
  const b = parse(interestSchema, req.body);
  const user = (await loadUser(req))!;
  const pet = await queryOne<{ name: string; image: string; ong_id: string; status: string }>(
    'SELECT name, image, ong_id, status FROM pets WHERE id = $1',
    [b.petId],
  );
  if (!pet) throw notFound('Pet');
  if (pet.status === 'Adotado') throw new HttpError(409, `${pet.name} já foi adotado(a).`);
  const phone = b.userPhone ?? user.phone;
  if (!phone) throw new HttpError(400, 'Informe um telefone de contato.');

  const created = await queryOne<{ id: string }>(
    `INSERT INTO adoption_interests (pet_id, pet_name, pet_image, ong_id, user_id, user_name,
                                     user_email, user_phone, housing_type, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
    [
      b.petId, pet.name, pet.image, pet.ong_id, user.id, b.userName ?? user.name,
      b.userEmail ?? user.email, phone, b.housingType,
      b.message ??
        `Olá! Tenho muito interesse em adotar o(a) ${pet.name}. Gostaria de entender os próximos passos da adoção responsável.`,
    ],
  );
  res.status(201).json(await queryOne(`${INTEREST_SELECT} WHERE ai.id = $1`, [created!.id]));
});

// A ONG dona do pet move o interesse pelo funil.
interestsRouter.patch('/:id/status', requireOng, async (req, res) => {
  const { status } = parse(
    z.object({ status: z.enum(['Em análise', 'Em contato', 'Aprovado', 'Finalizado']) }),
    req.body,
  );
  const updated = await queryOne(
    'UPDATE adoption_interests SET status = $1 WHERE id = $2 AND ong_id = $3 RETURNING id',
    [status, req.params.id, req.auth!.ongId],
  );
  if (!updated) throw notFound('Interesse de adoção');
  res.json(await queryOne(`${INTEREST_SELECT} WHERE ai.id = $1`, [req.params.id]));
});

// ---------------------------------------------------------------- doações
export const donationsRouter = Router();

const donationSchema = z.object({
  ongId: text(80),
  amount: z.coerce.number().positive().max(1_000_000),
  method: z.enum(['PIX', 'Transferência Bancária']).default('PIX'),
  donorName: optionalText(120),
  donorEmail: email.optional(),
});

// Registro declarado pelo doador após fazer o PIX/transferência por fora (não há gateway
// de pagamento). Entra como 'Confirmado', igual ao comportamento atual do front.
donationsRouter.post('/', optionalAuth, async (req, res) => {
  const b = parse(donationSchema, req.body);
  const user = await loadUser(req);
  if (user?.role === 'ong') throw new HttpError(403, 'Contas de ONG não registram doações.');
  const ong = await queryOne<{ accepts_donations: boolean }>(
    'SELECT accepts_donations FROM ongs WHERE id = $1',
    [b.ongId],
  );
  if (!ong) throw notFound('ONG');
  if (!ong.accepts_donations) {
    throw new HttpError(409, 'Esta ONG não está recebendo doações financeiras no momento.');
  }
  const created = await queryOne<{ id: string }>(
    `INSERT INTO donations (ong_id, user_id, donor_name, donor_email, amount, method)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [
      b.ongId, user?.id ?? null, user?.name ?? b.donorName ?? 'Doador Solidário',
      user?.email ?? b.donorEmail ?? '', Math.round(b.amount * 100) / 100, b.method,
    ],
  );
  res.status(201).json(await queryOne(`${DONATION_SELECT} WHERE d.id = $1`, [created!.id]));
});

// ---------------------------------------------------------------- vacinação
export const vaccinationsRouter = Router();

const vaccinationSchema = z.object({
  ongId: text(80),
  dogName: text(80),
  breed: optionalText(80),
  size: z.enum(['Pequeno', 'Médio', 'Grande']),
  tutorName: text(120),
  tutorPhone: text(30),
  tutorEmail: email,
  // vazio = sem preferência (o servidor sugere daqui a 3 dias)
  preferredDate: isoDate.or(z.literal('').transform(() => undefined)).optional(),
  preferredShift: z.enum(['Manhã', 'Tarde']),
  vaccineType: text(120),
  notes: optionalText(2000),
});

// Visitante também pode solicitar; o protocolo devolvido identifica o pedido.
vaccinationsRouter.post('/', optionalAuth, async (req, res) => {
  const b = parse(vaccinationSchema, req.body);
  const ong = await queryOne<{ offers_vaccination: boolean }>(
    'SELECT offers_vaccination FROM ongs WHERE id = $1',
    [b.ongId],
  );
  if (!ong) throw notFound('ONG');
  if (!ong.offers_vaccination) throw new HttpError(409, 'Esta ONG não oferece vacinação.');

  const today = new Date().toISOString().slice(0, 10);
  if (b.preferredDate && b.preferredDate < today) {
    throw new HttpError(400, 'A data preferencial não pode estar no passado.');
  }
  const preferredDate =
    b.preferredDate ?? new Date(Date.now() + 3 * 86_400_000).toISOString().slice(0, 10);

  // protocolo aleatório; em caso (raro) de colisão com o UNIQUE, sorteia de novo
  for (let attempt = 0; ; attempt++) {
    const protocol = `VAC-${today.slice(0, 4)}-${randomInt(100_000, 1_000_000)}`;
    try {
      const created = await queryOne<{ id: string }>(
        `INSERT INTO vaccination_requests (ong_id, user_id, dog_name, breed, size, tutor_name,
                                           tutor_phone, tutor_email, preferred_date,
                                           preferred_shift, vaccine_type, notes, protocol)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id`,
        [
          b.ongId, req.auth?.id ?? null, b.dogName, b.breed ?? 'SRD', b.size, b.tutorName,
          b.tutorPhone, b.tutorEmail, preferredDate, b.preferredShift, b.vaccineType,
          b.notes ?? null, protocol,
        ],
      );
      res.status(201).json(await queryOne(`${VACCINATION_SELECT} WHERE v.id = $1`, [created!.id]));
      return;
    } catch (err) {
      const e = err as { code?: string; constraint?: string };
      const collision = e.code === '23505' && e.constraint === 'vaccination_requests_protocol_key';
      if (!collision || attempt >= 4) throw err;
    }
  }
});

vaccinationsRouter.patch('/:id/status', requireOng, async (req, res) => {
  const { status } = parse(
    z.object({ status: z.enum(['Solicitado', 'Agendado', 'Concluído', 'Cancelado']) }),
    req.body,
  );
  const updated = await queryOne(
    'UPDATE vaccination_requests SET status = $1 WHERE id = $2 AND ong_id = $3 RETURNING id',
    [status, req.params.id, req.auth!.ongId],
  );
  if (!updated) throw notFound('Pedido de vacinação');
  res.json(await queryOne(`${VACCINATION_SELECT} WHERE v.id = $1`, [req.params.id]));
});
