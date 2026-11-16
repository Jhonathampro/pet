# Hub Pet — API

API REST do Hub Pet (Node.js + Express + TypeScript + PostgreSQL). Cobre tudo que o front faz hoje
via `DataStore`/`localStorage`: login, pets, ONGs, interesse de adoção, denúncias e mapa de
abandono, banco de ração, doações, vacinação e os dois painéis (usuário e ONG).

As respostas saem no mesmo formato dos tipos de `src/types/index.ts` (mesmos nomes de campo e os
mesmos textos em `status`, `species` etc.), para o front poder trocar `DataStore.x()` por `fetch`.

## Como rodar

Requisitos: Node 20.12+ e PostgreSQL 13+.

```bash
cd api
npm install
cp .env.example .env        # ajuste DATABASE_URL e JWT_SECRET
createdb -U postgres hubpet # ou: CREATE DATABASE hubpet;
npm run db:setup            # cria as tabelas e insere os dados de demonstração
npm run dev                 # http://localhost:3333/api
```

| Script               | O que faz                                                        |
| -------------------- | ---------------------------------------------------------------- |
| `npm run dev`        | Sobe a API recarregando a cada alteração                         |
| `npm run build`      | Compila para `dist/` (`npm start` roda o compilado)              |
| `npm run db:migrate` | Aplica os arquivos de `migrations/` que ainda não rodaram        |
| `npm run db:seed`    | Insere os dados de demonstração (pode rodar mais de uma vez)     |

Contas de demonstração (as mesmas do front), senha `chave123`:
`lucas@gmail.com` (usuário) e `SalvaPet@gmail.com` (ONG).

## Autenticação

`POST /api/auth/login` devolve `{ token, user }`. Nas rotas protegidas envie
`Authorization: Bearer <token>`. Perfis: **visitante** (sem token), **user** e **ong**.

Erros sempre vêm como `{ "error": { "message": "...", "details": [...] } }` com o status HTTP
adequado (400 validação, 401 sem login, 403 sem permissão, 404, 409 conflito de regra).

## Rotas

Todas com prefixo `/api`. Acesso: 🌐 qualquer um · 👤 usuário logado · 🏠 ONG logada · 🔒 qualquer conta logada.

### Conta
| Método | Rota                 | Acesso | Descrição                                              |
| ------ | -------------------- | ------ | ------------------------------------------------------ |
| POST   | `/auth/register`     | 🌐     | Cria conta de usuário                                  |
| POST   | `/auth/register-ong` | 🌐     | Cria uma ONG (não verificada) e a conta que a administra |
| POST   | `/auth/login`        | 🌐     | Login                                                  |
| GET    | `/auth/me`           | 🔒     | Dados da conta logada                                  |
| PATCH  | `/auth/me`           | 🔒     | Atualiza nome, telefone, cidade, estado, avatar        |

### Pets
| Método | Rota        | Acesso | Descrição |
| ------ | ----------- | ------ | --------- |
| GET    | `/pets`     | 🌐 | Lista. Filtros: `species`, `sex`, `size`, `ageCategory`, `status`, `city`, `state`, `ongId`, `q`, `limit`, `offset` |
| GET    | `/pets/:id` | 🌐 | Detalhe |
| POST   | `/pets`     | 🏠 | Cadastra pet na ONG logada |
| PATCH  | `/pets/:id` | 🏠 | Edita / muda status (só pets da própria ONG) |
| DELETE | `/pets/:id` | 🏠 | Remove do catálogo |

### ONGs
| Método | Rota             | Acesso | Descrição |
| ------ | ---------------- | ------ | --------- |
| GET    | `/ongs`          | 🌐 | Lista. Filtros: `city`, `state`, `acceptsFood`, `providesFood`, `acceptsDonations`, `offersVaccination`, `q` |
| GET    | `/ongs/:id`      | 🌐 | Perfil |
| GET    | `/ongs/:id/pets` | 🌐 | Pets da ONG |
| PATCH  | `/ongs/:id`      | 🏠 | Configurações (só a própria ONG) |

### Adoção, doações e vacinação
| Método | Rota                             | Acesso | Descrição |
| ------ | -------------------------------- | ------ | --------- |
| POST   | `/adoption-interests`            | 👤 | "Tenho interesse em adotar" (`petId`, `housingType`, ...) |
| PATCH  | `/adoption-interests/:id/status` | 🏠 | Em análise → Em contato → Aprovado → Finalizado |
| POST   | `/donations`                     | 🌐 | Registra doação (`ongId`, `amount`, `method`). ONG não doa |
| POST   | `/vaccinations`                  | 🌐 | Pedido de vacinação; devolve o `protocol` |
| PATCH  | `/vaccinations/:id/status`       | 🏠 | Solicitado / Agendado / Concluído / Cancelado |

### Abandono
| Método | Rota                       | Acesso | Descrição |
| ------ | -------------------------- | ------ | --------- |
| GET    | `/reports`                 | 🌐 | Lista. Filtros: `status`, `includeExpired=false`, `species`, `city`, `state` |
| GET    | `/reports/:id`             | 🌐 | Detalhe |
| POST   | `/reports`                 | 🌐 | Nova denúncia (visitante entra como "Cidadão Anônimo") |
| POST   | `/reports/:id/corroborate` | 🌐 | "Também vi este caso" |

### Banco de ração
| Método | Rota                        | Acesso | Descrição |
| ------ | --------------------------- | ------ | --------- |
| GET    | `/food-items`               | 🌐 | Lista. Filtros: `type`, `status`, `role`, `city`, `state` |
| POST   | `/food-items`               | 🌐 | Publica oferta (`type: "available"`) ou pedido (`type: "need"`) |
| PATCH  | `/food-items/:id`           | 🔒 | Dono marca `Concluído` / `Aberto` |
| POST   | `/food-items/:id/responses` | 🌐 | Responde a um item (doar para um pedido / pedir um lote) |
| GET    | `/food-items/:id/responses` | 🔒 | Contatos recebidos (só o dono do item) |

### Painéis
Mesmas rotas para os dois perfis: usuário recebe o que **enviou**; ONG recebe o que **recebeu**.

| Método | Rota                     | Acesso | Descrição |
| ------ | ------------------------ | ------ | --------- |
| GET    | `/me/adoption-interests` | 🔒 | Interesses de adoção |
| GET    | `/me/donations`          | 🔒 | Doações |
| GET    | `/me/vaccinations`       | 🔒 | Pedidos de vacinação |
| GET    | `/me/food-items`         | 🔒 | Itens do banco de ração |
| GET    | `/me/reports`            | 🔒 | Denúncias enviadas pela conta |
| GET    | `/me/ong`                | 🏠 | Dados da ONG logada |
| GET    | `/me/pets`               | 🏠 | Pets da ONG logada |

## Regras de negócio no servidor

- **Regra dos 3 meses**: o `status` da denúncia não é gravado; é calculado na leitura. Mais de um
  registro → `Confirmado por múltiplos registros`; relato único com mais de 3 meses desde a data do
  ocorrido → `Expirado`; senão `Ativo`.
- Um usuário logado só reforça a mesma denúncia uma vez (409 na segunda).
- `availablePetsCount` (ONG) e `interestedCount` (pet) são contados no banco, não digitados.
- `ageCategory` é deduzida de `age` quando não enviada ("8 meses" → Filhote, "1 ano" → Jovem...).
- Interesse em pet `Adotado`, doação para ONG que não aceita doações e vacinação em ONG que não
  oferece o serviço devolvem 409.
- Remover um pet mantém o histórico de interesses (com `petId: null`).
- Doações são **declaradas** pelo doador depois do PIX/transferência — não há integração com
  gateway de pagamento; entram como `Confirmado`, como no front atual.
- Fotos são URLs `http(s)`; não há upload de arquivo.

## Estrutura

```
migrations/001_init.sql   esquema do banco
src/db/                   migrate.ts, seed.ts, seed-data.json
src/routes/               uma rota por área do site
src/selects.ts            SELECTs que devolvem as linhas no formato do front
src/auth.ts               JWT e controle de acesso por perfil
src/http.ts               erros e validação (zod)
```
