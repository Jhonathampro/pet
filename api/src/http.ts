import type { ErrorRequestHandler, RequestHandler } from 'express';
import { z } from 'zod';

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: unknown,
  ) {
    super(message);
  }
}

export const notFound = (what: string) => new HttpError(404, `${what} não encontrado(a).`);

/** Valida com zod e devolve o valor tipado; falha vira 400 com a lista de campos. */
export function parse<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data ?? {});
  if (!result.success) {
    throw new HttpError(
      400,
      'Dados inválidos.',
      result.error.issues.map((i) => ({ field: i.path.join('.'), message: i.message })),
    );
  }
  return result.data;
}

/** Texto obrigatório (sem espaços nas pontas). */
export const text = (max = 500) => z.string().trim().min(1).max(max);
/** Texto opcional: string vazia é tratada como ausente. */
export const optionalText = (max = 500) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => v || undefined)
    .optional();
export const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD.');
export const uf = z.string().trim().length(2).toUpperCase();
/** Booleano vindo de query string (?x=true). */
export const queryBool = z.enum(['true', 'false']).transform((v) => v === 'true').optional();

export const pagination = {
  limit: z.coerce.number().int().min(1).max(200).optional(),
  offset: z.coerce.number().int().min(0).optional(),
};

export function pageSql(page: { limit?: number; offset?: number }): string {
  // valores já validados como inteiros pelo zod
  return `${page.limit ? ` LIMIT ${page.limit}` : ''}${page.offset ? ` OFFSET ${page.offset}` : ''}`;
}

export const routeNotFound: RequestHandler = (req) => {
  throw new HttpError(404, `Rota ${req.method} ${req.path} não existe.`);
};

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: { message: err.message, details: err.details } });
    return;
  }
  // JSON malformado no corpo (erro do express.json)
  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ error: { message: 'JSON inválido no corpo da requisição.' } });
    return;
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ error: { message: 'Corpo da requisição grande demais.' } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { message: 'Erro interno do servidor.' } });
};
