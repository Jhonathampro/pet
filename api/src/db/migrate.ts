// Aplica, em ordem, os arquivos de api/migrations que ainda não rodaram neste banco.
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { pool, withTransaction } from '../db.js';

const dir = fileURLToPath(new URL('../../migrations/', import.meta.url));

await pool.query(`
  CREATE TABLE IF NOT EXISTS schema_migrations (
    name text PRIMARY KEY,
    applied_at timestamptz NOT NULL DEFAULT now()
  )`);

const applied = new Set(
  (await pool.query<{ name: string }>('SELECT name FROM schema_migrations')).rows.map((r) => r.name),
);

for (const file of readdirSync(dir).filter((f) => f.endsWith('.sql')).sort()) {
  if (applied.has(file)) continue;
  await withTransaction(async (client) => {
    await client.query(readFileSync(dir + file, 'utf8'));
    await client.query('INSERT INTO schema_migrations (name) VALUES ($1)', [file]);
  });
  console.log(`aplicada: ${file}`);
}

console.log('Banco atualizado.');
await pool.end();
