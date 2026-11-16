-- Hub Pet — esquema inicial (PostgreSQL 13+)
-- Os valores dos CHECKs são os mesmos textos usados pelo front (src/types/index.ts).

CREATE TABLE ongs (
  id                 text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name               text NOT NULL,
  city               text NOT NULL,
  state              text NOT NULL,
  address            text NOT NULL DEFAULT '',
  neighborhood       text NOT NULL DEFAULT '',
  description        text NOT NULL DEFAULT '',
  logo               text NOT NULL DEFAULT '',
  cover_image        text NOT NULL DEFAULT '',
  phone              text NOT NULL DEFAULT '',
  whatsapp           text NOT NULL DEFAULT '',
  email              text NOT NULL DEFAULT '',
  instagram          text NOT NULL DEFAULT '',
  website            text,
  accepts_food       boolean NOT NULL DEFAULT false,
  provides_food      boolean NOT NULL DEFAULT false,
  accepts_donations  boolean NOT NULL DEFAULT false,
  offers_vaccination boolean NOT NULL DEFAULT false,
  pix_key            text NOT NULL DEFAULT '',
  bank_name          text NOT NULL DEFAULT '',
  bank_code          text NOT NULL DEFAULT '',
  bank_agency        text NOT NULL DEFAULT '',
  bank_account       text NOT NULL DEFAULT '',
  bank_account_type  text NOT NULL DEFAULT '',
  rescued_total      integer NOT NULL DEFAULT 0 CHECK (rescued_total >= 0),
  verified           boolean NOT NULL DEFAULT false,
  created_at         timestamptz NOT NULL DEFAULT now(),
  updated_at         timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id            text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          text NOT NULL,
  email         text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('user', 'ong')),
  phone         text,
  city          text,
  state         text,
  avatar        text,
  ong_id        text REFERENCES ongs(id) ON DELETE CASCADE,
  created_at    timestamptz NOT NULL DEFAULT now(),
  -- conta de ONG sempre aponta para uma ONG; conta comum nunca
  CHECK ((role = 'ong') = (ong_id IS NOT NULL))
);
CREATE UNIQUE INDEX users_email_lower_key ON users (lower(email));

CREATE TABLE pets (
  id            text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ong_id        text NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  name          text NOT NULL,
  species       text NOT NULL CHECK (species IN ('Cachorro', 'Gato')),
  breed         text NOT NULL DEFAULT 'SRD',
  age           text NOT NULL,
  age_category  text NOT NULL CHECK (age_category IN ('Filhote', 'Jovem', 'Adulto', 'Sênior')),
  sex           text NOT NULL CHECK (sex IN ('Macho', 'Fêmea')),
  size          text NOT NULL CHECK (size IN ('Pequeno', 'Médio', 'Grande')),
  city          text NOT NULL,
  state         text NOT NULL,
  description   text NOT NULL DEFAULT '',
  personality   text[] NOT NULL DEFAULT '{}',
  image         text NOT NULL DEFAULT '',
  gallery       text[] NOT NULL DEFAULT '{}',
  status        text NOT NULL DEFAULT 'Disponível'
                CHECK (status IN ('Disponível', 'Em processo de adoção', 'Adotado')),
  vaccinated    boolean NOT NULL DEFAULT false,
  neutered      boolean NOT NULL DEFAULT false,
  dewormed      boolean NOT NULL DEFAULT false,
  special_needs text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX pets_ong_id_idx ON pets (ong_id);
CREATE INDEX pets_status_idx ON pets (status);

CREATE TABLE adoption_interests (
  id           text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  -- o pet pode ser removido do catálogo; o histórico do interesse fica (nome/foto copiados)
  pet_id       text REFERENCES pets(id) ON DELETE SET NULL,
  pet_name     text NOT NULL,
  pet_image    text NOT NULL DEFAULT '',
  ong_id       text NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  user_id      text NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_name    text NOT NULL,
  user_email   text NOT NULL,
  user_phone   text NOT NULL,
  housing_type text NOT NULL
               CHECK (housing_type IN ('Casa com quintal', 'Apartamento', 'Chácara / Sítio', 'Outro')),
  message      text NOT NULL DEFAULT '',
  status       text NOT NULL DEFAULT 'Em análise'
               CHECK (status IN ('Em análise', 'Em contato', 'Aprovado', 'Finalizado')),
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX adoption_interests_pet_id_idx ON adoption_interests (pet_id);
CREATE INDEX adoption_interests_ong_id_idx ON adoption_interests (ong_id);
CREATE INDEX adoption_interests_user_id_idx ON adoption_interests (user_id);

-- O status ('Ativo' / 'Confirmado por múltiplos registros' / 'Expirado') não é gravado:
-- é calculado na leitura a partir de report_count e da data do ocorrido (regra dos 3 meses).
CREATE TABLE abandonment_reports (
  id                   text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id              text REFERENCES users(id) ON DELETE SET NULL, -- NULL = denúncia anônima
  reported_by          text NOT NULL,
  reported_by_role     text NOT NULL CHECK (reported_by_role IN ('guest', 'user', 'ong')),
  photo_url            text NOT NULL DEFAULT '',
  address              text NOT NULL,
  neighborhood         text NOT NULL DEFAULT '',
  city                 text NOT NULL,
  state                text NOT NULL,
  date                 date NOT NULL,
  description          text NOT NULL DEFAULT '',
  species              text NOT NULL CHECK (species IN ('Cachorro', 'Gato', 'Outro')),
  health_condition     text NOT NULL
                       CHECK (health_condition IN ('Sadio', 'Debilitado / Desnutrido', 'Ferido')),
  report_count         integer NOT NULL DEFAULT 1 CHECK (report_count >= 1),
  lat                  double precision,
  lng                  double precision,
  created_at           timestamptz NOT NULL DEFAULT now(),
  last_corroborated_at timestamptz
);
CREATE INDEX abandonment_reports_date_idx ON abandonment_reports (date);
CREATE INDEX abandonment_reports_user_id_idx ON abandonment_reports (user_id);

CREATE TABLE report_corroborations (
  id         text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  report_id  text NOT NULL REFERENCES abandonment_reports(id) ON DELETE CASCADE,
  user_id    text REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
-- um usuário logado só reforça a mesma denúncia uma vez
CREATE UNIQUE INDEX report_corroborations_once_per_user
  ON report_corroborations (report_id, user_id) WHERE user_id IS NOT NULL;

CREATE TABLE food_bank_items (
  id               text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  type             text NOT NULL CHECK (type IN ('need', 'available')),
  title            text NOT NULL,
  org_or_user_name text NOT NULL,
  role             text NOT NULL CHECK (role IN ('ong', 'user')),
  user_id          text REFERENCES users(id) ON DELETE SET NULL, -- NULL = visitante
  ong_id           text REFERENCES ongs(id) ON DELETE CASCADE,
  food_type        text NOT NULL,
  quantity_kg      numeric(10, 2) NOT NULL CHECK (quantity_kg > 0),
  city             text NOT NULL,
  state            text NOT NULL,
  location_details text NOT NULL DEFAULT '',
  description      text NOT NULL DEFAULT '',
  contact          text NOT NULL DEFAULT '',
  date             date NOT NULL DEFAULT CURRENT_DATE,
  urgency          text CHECK (urgency IN ('Alta', 'Média', 'Normal')),
  status           text NOT NULL DEFAULT 'Aberto' CHECK (status IN ('Aberto', 'Concluído')),
  created_at       timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX food_bank_items_user_id_idx ON food_bank_items (user_id);
CREATE INDEX food_bank_items_ong_id_idx ON food_bank_items (ong_id);

-- Resposta a um item existente: "Doar ração para X" (item need) ou
-- "Solicitar ração disponibilizada por X" (item available).
CREATE TABLE food_bank_responses (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  item_id     text NOT NULL REFERENCES food_bank_items(id) ON DELETE CASCADE,
  user_id     text REFERENCES users(id) ON DELETE SET NULL,
  name        text NOT NULL,
  phone       text NOT NULL,
  quantity_kg numeric(10, 2) NOT NULL CHECK (quantity_kg > 0),
  food_type   text,
  notes       text NOT NULL DEFAULT '',
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX food_bank_responses_item_id_idx ON food_bank_responses (item_id);

CREATE TABLE donations (
  id          text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ong_id      text NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  user_id     text REFERENCES users(id) ON DELETE SET NULL, -- NULL = visitante
  donor_name  text NOT NULL,
  donor_email text NOT NULL,
  amount      numeric(12, 2) NOT NULL CHECK (amount > 0),
  date        date NOT NULL DEFAULT CURRENT_DATE,
  method      text NOT NULL CHECK (method IN ('PIX', 'Transferência Bancária')),
  status      text NOT NULL DEFAULT 'Confirmado' CHECK (status IN ('Confirmado', 'Pendente')),
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX donations_ong_id_idx ON donations (ong_id);
CREATE INDEX donations_user_id_idx ON donations (user_id);

CREATE TABLE vaccination_requests (
  id              text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  ong_id          text NOT NULL REFERENCES ongs(id) ON DELETE CASCADE,
  user_id         text REFERENCES users(id) ON DELETE SET NULL, -- NULL = visitante
  dog_name        text NOT NULL,
  breed           text NOT NULL DEFAULT 'SRD',
  size            text NOT NULL CHECK (size IN ('Pequeno', 'Médio', 'Grande')),
  tutor_name      text NOT NULL,
  tutor_phone     text NOT NULL,
  tutor_email     text NOT NULL,
  preferred_date  date NOT NULL,
  preferred_shift text NOT NULL CHECK (preferred_shift IN ('Manhã', 'Tarde')),
  vaccine_type    text NOT NULL,
  notes           text,
  status          text NOT NULL DEFAULT 'Solicitado'
                  CHECK (status IN ('Solicitado', 'Agendado', 'Concluído', 'Cancelado')),
  protocol        text NOT NULL UNIQUE,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX vaccination_requests_ong_id_idx ON vaccination_requests (ong_id);
CREATE INDEX vaccination_requests_user_id_idx ON vaccination_requests (user_id);
