import bcrypt from 'bcryptjs';
import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import { requireAuth, signToken } from '../auth.js';
import { buildUpdate, queryOne, withTransaction } from '../db.js';
import { HttpError, optionalText, parse, text, uf } from '../http.js';
import { USER_SELECT, loadUser, type UserRow } from '../selects.js';

export const authRouter = Router();

// freia tentativa de adivinhar senha / criação de contas em massa
const credentialsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { message: 'Muitas tentativas. Aguarde alguns minutos e tente de novo.' } },
});

const email = z.string().trim().max(254).pipe(z.email('E-mail inválido.'));
const password = z.string().min(8, 'A senha precisa ter ao menos 8 caracteres.').max(72);

const registerSchema = z.object({
  name: text(120),
  email,
  password,
  phone: optionalText(30),
  city: optionalText(120),
  state: uf.optional(),
});

const registerOngSchema = z.object({
  name: text(120),
  email,
  password,
  phone: optionalText(30),
  whatsapp: optionalText(30),
  city: text(120),
  state: uf,
  address: optionalText(200),
  neighborhood: optionalText(120),
  description: optionalText(2000),
});

const loginSchema = z.object({ email: z.string().trim(), password: z.string() });

const profileSchema = z.object({
  name: text(120).optional(),
  phone: optionalText(30),
  city: optionalText(120),
  state: uf.optional(),
  avatar: z.string().trim().max(2000).regex(/^https?:\/\//, 'Informe uma URL http(s).').optional(),
});

const DUMMY_HASH = bcrypt.hashSync('sem-usuario', 10);

function session(user: UserRow) {
  return { token: signToken({ id: user.id, role: user.role, ongId: user.ongId }), user };
}

function emailTaken(err: unknown): never {
  if ((err as { code?: string }).code === '23505') {
    throw new HttpError(409, 'Já existe uma conta com este e-mail.');
  }
  throw err;
}

authRouter.post('/register', credentialsLimiter, async (req, res) => {
  const body = parse(registerSchema, req.body);
  const hash = await bcrypt.hash(body.password, 10);
  const created = await queryOne<{ id: string }>(
    `INSERT INTO users (name, email, password_hash, role, phone, city, state)
     VALUES ($1, $2, $3, 'user', $4, $5, $6) RETURNING id`,
    [body.name, body.email, hash, body.phone, body.city, body.state],
  ).catch(emailTaken);
  const user = await queryOne<UserRow>(`${USER_SELECT} WHERE u.id = $1`, [created!.id]);
  res.status(201).json(session(user!));
});

// Cria a ONG (ainda não verificada) e a conta que a administra.
authRouter.post('/register-ong', credentialsLimiter, async (req, res) => {
  const body = parse(registerOngSchema, req.body);
  const hash = await bcrypt.hash(body.password, 10);
  const userId = await withTransaction(async (client) => {
    const ong = await queryOne<{ id: string }>(
      `INSERT INTO ongs (name, city, state, address, neighborhood, description, phone, whatsapp, email)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [
        body.name, body.city, body.state, body.address ?? '', body.neighborhood ?? '',
        body.description ?? '', body.phone ?? '', body.whatsapp ?? '', body.email,
      ],
      client,
    );
    const user = await queryOne<{ id: string }>(
      `INSERT INTO users (name, email, password_hash, role, phone, city, state, ong_id)
       VALUES ($1, $2, $3, 'ong', $4, $5, $6, $7) RETURNING id`,
      [body.name, body.email, hash, body.phone, body.city, body.state, ong!.id],
      client,
    );
    return user!.id;
  }).catch(emailTaken);
  const user = await queryOne<UserRow>(`${USER_SELECT} WHERE u.id = $1`, [userId]);
  res.status(201).json(session(user!));
});

authRouter.post('/login', credentialsLimiter, async (req, res) => {
  const body = parse(loginSchema, req.body);
  const row = await queryOne<{ id: string; password_hash: string }>(
    'SELECT id, password_hash FROM users WHERE lower(email) = lower($1)',
    [body.email],
  );
  // compara mesmo sem usuário para o tempo de resposta não revelar se o e-mail existe
  const ok = await bcrypt.compare(body.password, row?.password_hash ?? DUMMY_HASH);
  if (!row || !ok) {
    throw new HttpError(
      401,
      'E-mail ou senha incorretos. Verifique os dados digitados e tente novamente.',
    );
  }
  const user = await queryOne<UserRow>(`${USER_SELECT} WHERE u.id = $1`, [row.id]);
  res.json(session(user!));
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json(await loadUser(req));
});

authRouter.patch('/me', requireAuth, async (req, res) => {
  const body = parse(profileSchema, req.body);
  const { set, values } = buildUpdate(body, {
    name: 'name', phone: 'phone', city: 'city', state: 'state', avatar: 'avatar',
  });
  if (set) {
    await queryOne(`UPDATE users SET ${set} WHERE id = $${values.length + 1}`, [
      ...values,
      req.auth!.id,
    ]);
  }
  res.json(await loadUser(req));
});
