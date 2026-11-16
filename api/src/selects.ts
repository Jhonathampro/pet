// SELECTs que já devolvem as linhas no formato dos tipos do front (src/types/index.ts).
import type { Request } from 'express';
import { queryOne } from './db.js';
import { HttpError } from './http.js';

export const USER_SELECT = `
  SELECT u.id, u.name, u.email, u.role, u.phone, u.city, u.state, u.avatar, u.ong_id AS "ongId"
  FROM users u`;

export const ONG_SELECT = `
  SELECT o.id, o.name, o.city, o.state, o.address, o.neighborhood, o.description, o.logo,
         o.cover_image AS "coverImage", o.phone, o.whatsapp, o.email, o.instagram, o.website,
         o.accepts_food AS "acceptsFood", o.provides_food AS "providesFood",
         o.accepts_donations AS "acceptsDonations", o.offers_vaccination AS "offersVaccination",
         o.pix_key AS "pixKey",
         json_build_object('bankName', o.bank_name, 'code', o.bank_code, 'agency', o.bank_agency,
                           'account', o.bank_account, 'accountType', o.bank_account_type) AS bank,
         (SELECT count(*)::int FROM pets p
           WHERE p.ong_id = o.id AND p.status = 'Disponível') AS "availablePetsCount",
         o.rescued_total AS "rescuedTotal", o.verified
  FROM ongs o`;

export const PET_SELECT = `
  SELECT p.id, p.name, p.species, p.breed, p.age, p.age_category AS "ageCategory", p.sex, p.size,
         p.city, p.state, p.ong_id AS "ongId", o.name AS "ongName", p.description, p.personality,
         p.image, p.gallery, p.status, p.vaccinated, p.neutered, p.dewormed,
         p.special_needs AS "specialNeeds",
         (SELECT count(*)::int FROM adoption_interests ai WHERE ai.pet_id = p.id) AS "interestedCount",
         to_char(p.created_at, 'YYYY-MM-DD') AS "createdAt"
  FROM pets p JOIN ongs o ON o.id = p.ong_id`;

/** Regra dos 3 meses: relato único expira 3 meses após o ocorrido; com reforço fica confirmado. */
export const REPORT_STATUS = `
  CASE WHEN r.report_count > 1 THEN 'Confirmado por múltiplos registros'
       WHEN r.date < CURRENT_DATE - INTERVAL '3 months' THEN 'Expirado'
       ELSE 'Ativo' END`;

export const REPORT_SELECT = `
  SELECT r.id, r.photo_url AS "photoUrl", r.address, r.neighborhood, r.city, r.state, r.date,
         r.description, r.species, r.health_condition AS "healthCondition",
         ${REPORT_STATUS} AS status,
         r.report_count AS "reportCount", r.lat, r.lng, r.reported_by AS "reportedBy",
         r.reported_by_role AS "reportedByRole", r.created_at AS "createdAt",
         r.last_corroborated_at AS "lastCorroboratedAt"
  FROM abandonment_reports r`;

export const FOOD_SELECT = `
  SELECT f.id, f.type, f.title, f.org_or_user_name AS "orgOrUserName", f.role,
         f.food_type AS "foodType", f.quantity_kg AS "quantityKg", f.city, f.state,
         f.location_details AS "locationDetails", f.description, f.contact, f.date,
         f.urgency, f.status
  FROM food_bank_items f`;

export const INTEREST_SELECT = `
  SELECT ai.id, ai.pet_id AS "petId", ai.pet_name AS "petName", ai.pet_image AS "petImage",
         ai.ong_id AS "ongId", o.name AS "ongName", ai.user_name AS "userName",
         ai.user_email AS "userEmail", ai.user_phone AS "userPhone",
         ai.housing_type AS "housingType", ai.message,
         to_char(ai.created_at, 'YYYY-MM-DD') AS date, ai.status
  FROM adoption_interests ai JOIN ongs o ON o.id = ai.ong_id`;

export const DONATION_SELECT = `
  SELECT d.id, d.ong_id AS "ongId", o.name AS "ongName", d.donor_name AS "donorName",
         d.donor_email AS "donorEmail", d.amount, d.date, d.method, d.status
  FROM donations d JOIN ongs o ON o.id = d.ong_id`;

export const VACCINATION_SELECT = `
  SELECT v.id, v.dog_name AS "dogName", v.breed, v.size, v.tutor_name AS "tutorName",
         v.tutor_phone AS "tutorPhone", v.tutor_email AS "tutorEmail",
         v.preferred_date AS "preferredDate", v.preferred_shift AS "preferredShift",
         v.vaccine_type AS "vaccineType", v.notes, v.ong_id AS "ongId", o.name AS "ongName",
         v.status, v.protocol, v.created_at AS "createdAt"
  FROM vaccination_requests v JOIN ongs o ON o.id = v.ong_id`;

export interface UserRow {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'ong';
  phone: string | null;
  city: string | null;
  state: string | null;
  avatar: string | null;
  ongId: string | null;
}

/** Usuário logado (ou undefined para visitante). Token de conta apagada vira 401. */
export async function loadUser(req: Request): Promise<UserRow | undefined> {
  if (!req.auth) return undefined;
  const user = await queryOne<UserRow>(`${USER_SELECT} WHERE u.id = $1`, [req.auth.id]);
  if (!user) throw new HttpError(401, 'Conta não encontrada. Faça login novamente.');
  return user;
}
