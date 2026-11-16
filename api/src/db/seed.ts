// Popula o banco com os mesmos dados de demonstração do front (src/data/mockData.ts).
// Pode rodar mais de uma vez: registros que já existem são mantidos.
import { readFileSync } from 'node:fs';
import bcrypt from 'bcryptjs';
import { pool, withTransaction } from '../db.js';

const data = JSON.parse(readFileSync(new URL('./seed-data.json', import.meta.url), 'utf8'));

// Senha das duas contas de demonstração (lucas@gmail.com e SalvaPet@gmail.com), a mesma do front.
const DEMO_PASSWORD = 'chave123';

await withTransaction(async (client) => {
  const insert = (table: string, row: Record<string, unknown>) => {
    const cols = Object.keys(row);
    return client.query(
      `INSERT INTO ${table} (${cols.join(', ')})
       VALUES (${cols.map((_, i) => `$${i + 1}`).join(', ')}) ON CONFLICT (id) DO NOTHING`,
      Object.values(row),
    );
  };
  const userIdByEmail = new Map<string, string>(
    data.users.map((u: any) => [u.email.toLowerCase(), u.id]),
  );
  const userIdByName = new Map<string, string>(data.users.map((u: any) => [u.name, u.id]));
  const byEmail = (email: string) => userIdByEmail.get(email.toLowerCase()) ?? null;

  for (const o of data.ongs) {
    await insert('ongs', {
      id: o.id, name: o.name, city: o.city, state: o.state, address: o.address,
      neighborhood: o.neighborhood, description: o.description, logo: o.logo,
      cover_image: o.coverImage, phone: o.phone, whatsapp: o.whatsapp, email: o.email,
      instagram: o.instagram, website: o.website ?? null, accepts_food: o.acceptsFood,
      provides_food: o.providesFood, accepts_donations: o.acceptsDonations,
      offers_vaccination: o.offersVaccination, pix_key: o.pixKey, bank_name: o.bank.bankName,
      bank_code: o.bank.code, bank_agency: o.bank.agency, bank_account: o.bank.account,
      bank_account_type: o.bank.accountType, rescued_total: o.rescuedTotal, verified: o.verified,
    });
  }

  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);
  for (const u of data.users) {
    await insert('users', {
      id: u.id, name: u.name, email: u.email, password_hash: passwordHash, role: u.role,
      phone: u.phone ?? null, city: u.city ?? null, state: u.state ?? null,
      avatar: u.avatar ?? null, ong_id: u.ongId ?? null,
    });
  }

  for (const p of data.pets) {
    await insert('pets', {
      id: p.id, ong_id: p.ongId, name: p.name, species: p.species, breed: p.breed, age: p.age,
      age_category: p.ageCategory, sex: p.sex, size: p.size, city: p.city, state: p.state,
      description: p.description, personality: p.personality, image: p.image, gallery: p.gallery,
      status: p.status, vaccinated: p.vaccinated, neutered: p.neutered, dewormed: p.dewormed,
      special_needs: p.specialNeeds ?? null, created_at: p.createdAt,
    });
  }

  for (const r of data.reports) {
    await insert('abandonment_reports', {
      id: r.id, user_id: userIdByName.get(r.reportedBy) ?? null, reported_by: r.reportedBy,
      reported_by_role: r.reportedByRole, photo_url: r.photoUrl, address: r.address,
      neighborhood: r.neighborhood, city: r.city, state: r.state, date: r.date,
      description: r.description, species: r.species, health_condition: r.healthCondition,
      report_count: r.reportCount, lat: r.lat, lng: r.lng, created_at: r.createdAt,
      last_corroborated_at: r.lastCorroboratedAt ?? null,
    });
  }

  // no mock os itens de ração são todos da SalvaPet
  const salvapet = data.users.find((u: any) => u.role === 'ong');
  for (const f of data.foodItems) {
    const fromOng = f.role === 'ong';
    await insert('food_bank_items', {
      id: f.id, type: f.type, title: f.title, org_or_user_name: f.orgOrUserName, role: f.role,
      user_id: fromOng ? salvapet.id : null, ong_id: fromOng ? salvapet.ongId : null,
      food_type: f.foodType, quantity_kg: f.quantityKg, city: f.city, state: f.state,
      location_details: f.locationDetails, description: f.description, contact: f.contact,
      date: f.date, urgency: f.urgency ?? null, status: f.status, created_at: f.date,
    });
  }

  for (const i of data.interests) {
    await insert('adoption_interests', {
      id: i.id, pet_id: i.petId, pet_name: i.petName, pet_image: i.petImage, ong_id: i.ongId,
      user_id: byEmail(i.userEmail), user_name: i.userName, user_email: i.userEmail,
      user_phone: i.userPhone, housing_type: i.housingType, message: i.message,
      status: i.status, created_at: i.date,
    });
  }

  for (const d of data.donations) {
    await insert('donations', {
      id: d.id, ong_id: d.ongId, user_id: byEmail(d.donorEmail), donor_name: d.donorName,
      donor_email: d.donorEmail, amount: d.amount, date: d.date, method: d.method,
      status: d.status, created_at: d.date,
    });
  }

  for (const v of data.vaccinations) {
    await insert('vaccination_requests', {
      id: v.id, ong_id: v.ongId, user_id: byEmail(v.tutorEmail), dog_name: v.dogName,
      breed: v.breed, size: v.size, tutor_name: v.tutorName, tutor_phone: v.tutorPhone,
      tutor_email: v.tutorEmail, preferred_date: v.preferredDate,
      preferred_shift: v.preferredShift, vaccine_type: v.vaccineType, notes: v.notes ?? null,
      status: v.status, protocol: v.protocol, created_at: v.createdAt,
    });
  }
});

console.log('Dados de demonstração inseridos.');
console.log(`Login usuário: lucas@gmail.com / ${DEMO_PASSWORD}`);
console.log(`Login ONG:     SalvaPet@gmail.com / ${DEMO_PASSWORD}`);
await pool.end();
