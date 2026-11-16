import type { Request, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { env } from './env.js';
import { HttpError } from './http.js';

export interface AuthUser {
  id: string;
  role: 'user' | 'ong';
  ongId: string | null;
}

declare module 'express-serve-static-core' {
  interface Request {
    auth?: AuthUser;
  }
}

export function signToken(user: AuthUser): string {
  return jwt.sign({ role: user.role, ongId: user.ongId }, env.jwtSecret, {
    subject: user.id,
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function readToken(req: Request): AuthUser | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return undefined;
  try {
    const payload = jwt.verify(header.slice(7), env.jwtSecret) as jwt.JwtPayload;
    return { id: payload.sub!, role: payload.role, ongId: payload.ongId ?? null };
  } catch {
    throw new HttpError(401, 'Sessão inválida ou expirada. Faça login novamente.');
  }
}

/** Visitante passa; se mandar token, req.auth fica preenchido. */
export const optionalAuth: RequestHandler = (req, _res, next) => {
  req.auth = readToken(req);
  next();
};

export const requireAuth: RequestHandler = (req, _res, next) => {
  req.auth = readToken(req);
  if (!req.auth) throw new HttpError(401, 'É necessário estar logado.');
  next();
};

export const requireUser: RequestHandler = (req, res, next) =>
  requireAuth(req, res, () => {
    if (req.auth!.role !== 'user') {
      throw new HttpError(403, 'Ação disponível apenas para contas de usuário.');
    }
    next();
  });

export const requireOng: RequestHandler = (req, res, next) =>
  requireAuth(req, res, () => {
    if (req.auth!.role !== 'ong' || !req.auth!.ongId) {
      throw new HttpError(403, 'Ação disponível apenas para contas de ONG.');
    }
    next();
  });
