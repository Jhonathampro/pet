// Dados dos painéis. A mesma rota serve os dois perfis:
//  - conta de usuário -> o que ele próprio enviou (Meu Painel)
//  - conta de ONG     -> o que a ONG recebeu (Painel da ONG)
import type { Request } from 'express';
import { Router } from 'express';
import { requireAuth } from '../auth.js';
import { query, queryOne } from '../db.js';
import {
  DONATION_SELECT, FOOD_SELECT, INTEREST_SELECT, ONG_SELECT, PET_SELECT, REPORT_SELECT,
  VACCINATION_SELECT,
} from '../selects.js';

export const meRouter = Router();
meRouter.use(requireAuth);

/** Filtro "é meu": por ong_id para ONG, por user_id para usuário. */
function mine(req: Request, alias: string): { clause: string; value: string } {
  const auth = req.auth!;
  return auth.role === 'ong'
    ? { clause: `${alias}.ong_id = $1`, value: auth.ongId! }
    : { clause: `${alias}.user_id = $1`, value: auth.id };
}

meRouter.get('/adoption-interests', async (req, res) => {
  const m = mine(req, 'ai');
  res.json(await query(`${INTEREST_SELECT} WHERE ${m.clause} ORDER BY ai.created_at DESC`, [m.value]));
});

meRouter.get('/donations', async (req, res) => {
  const m = mine(req, 'd');
  res.json(await query(`${DONATION_SELECT} WHERE ${m.clause} ORDER BY d.created_at DESC`, [m.value]));
});

meRouter.get('/vaccinations', async (req, res) => {
  const m = mine(req, 'v');
  res.json(await query(`${VACCINATION_SELECT} WHERE ${m.clause} ORDER BY v.created_at DESC`, [m.value]));
});

meRouter.get('/food-items', async (req, res) => {
  const m = mine(req, 'f');
  res.json(await query(`${FOOD_SELECT} WHERE ${m.clause} ORDER BY f.created_at DESC`, [m.value]));
});

// denúncias são sempre de quem enviou (ONG também pode denunciar)
meRouter.get('/reports', async (req, res) => {
  res.json(
    await query(`${REPORT_SELECT} WHERE r.user_id = $1 ORDER BY r.created_at DESC`, [req.auth!.id]),
  );
});

// ---- só fazem sentido para ONG; para usuário voltam vazio/null

meRouter.get('/ong', async (req, res) => {
  const ong = req.auth!.ongId
    ? await queryOne(`${ONG_SELECT} WHERE o.id = $1`, [req.auth!.ongId])
    : undefined;
  res.json(ong ?? null);
});

meRouter.get('/pets', async (req, res) => {
  res.json(
    req.auth!.ongId
      ? await query(`${PET_SELECT} WHERE p.ong_id = $1 ORDER BY p.created_at DESC, p.id`, [
          req.auth!.ongId,
        ])
      : [],
  );
});
