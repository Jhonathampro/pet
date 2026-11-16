import pg from 'pg';
import { env } from './env.js';

// DATE volta como 'YYYY-MM-DD' (sem virar Date e sofrer com fuso) e NUMERIC como number.
pg.types.setTypeParser(pg.types.builtins.DATE, (v) => v);
pg.types.setTypeParser(pg.types.builtins.NUMERIC, (v) => Number(v));

export const pool = new pg.Pool({ connectionString: env.databaseUrl });

type Queryable = Pick<pg.PoolClient, 'query'>;

export async function query<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
  client: Queryable = pool,
): Promise<T[]> {
  const result = await client.query<T>(text, params);
  return result.rows;
}

export async function queryOne<T extends pg.QueryResultRow = pg.QueryResultRow>(
  text: string,
  params: unknown[] = [],
  client: Queryable = pool,
): Promise<T | undefined> {
  return (await query<T>(text, params, client))[0];
}

export async function withTransaction<T>(fn: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

/**
 * Monta "col1 = $1, col2 = $2" a partir dos campos presentes em um PATCH.
 * `columns` mapeia campo do corpo (camelCase) -> coluna; só chaves desse mapa entram no SQL.
 */
export function buildUpdate(
  body: Record<string, unknown>,
  columns: Record<string, string>,
): { set: string; values: unknown[] } {
  const parts: string[] = [];
  const values: unknown[] = [];
  for (const [field, column] of Object.entries(columns)) {
    if (body[field] === undefined) continue;
    values.push(body[field]);
    parts.push(`${column} = $${values.length}`);
  }
  return { set: parts.join(', '), values };
}

/** Acumula filtros opcionais de uma listagem. */
export class Where {
  private clauses: string[] = [];
  readonly values: unknown[] = [];

  /** `clause` usa `?` no lugar do parâmetro, ex.: add('p.city ILIKE ?', city) */
  add(clause: string, value: unknown): this {
    if (value === undefined) return this;
    this.values.push(value);
    this.clauses.push(clause.replaceAll('?', `$${this.values.length}`));
    return this;
  }

  raw(clause: string): this {
    this.clauses.push(clause);
    return this;
  }

  get sql(): string {
    return this.clauses.length ? `WHERE ${this.clauses.join(' AND ')}` : '';
  }
}
