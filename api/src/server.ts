import { app } from './app.js';
import { pool } from './db.js';
import { env } from './env.js';

const server = app.listen(env.port, () => {
  console.log(`Hub Pet API em http://localhost:${env.port}/api`);
});

function shutdown() {
  server.close(() => {
    pool.end().finally(() => process.exit(0));
  });
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
