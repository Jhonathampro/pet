import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { query } from './db.js';
import { env } from './env.js';
import { errorHandler, routeNotFound } from './http.js';
import { authRouter } from './routes/auth.js';
import { foodRouter } from './routes/food.js';
import { meRouter } from './routes/me.js';
import { ongsRouter } from './routes/ongs.js';
import { petsRouter } from './routes/pets.js';
import { reportsRouter } from './routes/reports.js';
import { donationsRouter, interestsRouter, vaccinationsRouter } from './routes/requests.js';

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.corsOrigins }));
app.use(express.json({ limit: '100kb' }));

const api = express.Router();

api.get('/health', async (_req, res) => {
  await query('SELECT 1');
  res.json({ status: 'ok' });
});

api.use('/auth', authRouter);
api.use('/pets', petsRouter);
api.use('/ongs', ongsRouter);
api.use('/reports', reportsRouter);
api.use('/food-items', foodRouter);
api.use('/adoption-interests', interestsRouter);
api.use('/donations', donationsRouter);
api.use('/vaccinations', vaccinationsRouter);
api.use('/me', meRouter);

app.use('/api', api);
app.use(routeNotFound);
app.use(errorHandler);
