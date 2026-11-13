import type { Pet, ONG, AbandonmentReport, FoodBankItem, User } from '../types';

/* ============================================================
 * Motor do chatbot: interpreta a mensagem do usuário (por
 * palavras-chave) e responde com base nos dados reais do app.
 * ============================================================ */

export type BotAction =
  | { type: 'navigate'; label: string; tab: string }
  | { type: 'pet'; label: string; petId: string }
  | { type: 'ong'; label: string; ongId: string }
  | { type: 'authorities'; label: string };

export interface BotReply {
  text: string;
  pets?: Pet[];
  actions?: BotAction[];
  suggestions?: string[];
}

export interface BotContext {
  pets: Pet[];
  ongs: ONG[];
  reports: AbandonmentReport[];
  foodItems: FoodBankItem[];
  user: User | null;
  isLoggedIn: boolean;
  isONG: boolean;
}

export const DEFAULT_SUGGESTIONS = [
  'Quero adotar um cachorro',
  'Gatos filhotes',
  'Como funciona a adoção?',
  'Ver ONGs',
  'Denunciar abandono',
  'Banco de ração',
  'Como doar?',
];

/** minúsculas, sem acentos e sem pontuação */
export const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const has = (text: string, words: string[]) =>
  words.some(w => new RegExp(`\\b${w}`).test(text));

const pick = <T,>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

/* ---------------- Filtros de pets ---------------- */

interface PetFilters {
  species?: Pet['species'];
  size?: Pet['size'];
  ageCategory?: Pet['ageCategory'];
  sex?: Pet['sex'];
  city?: string;
}

function extractPetFilters(text: string, pets: Pet[]): PetFilters {
  const f: PetFilters = {};
  if (has(text, ['cachorr', 'cao', 'caes', 'cadel', 'dog', 'canin'])) f.species = 'Cachorro';
  else if (has(text, ['gat', 'felin', 'cat\\b'])) f.species = 'Gato';

  if (has(text, ['pequen', 'mini'])) f.size = 'Pequeno';
  else if (has(text, ['medio', 'media'])) f.size = 'Médio';
  else if (has(text, ['grande', 'porte grande'])) f.size = 'Grande';

  if (has(text, ['filhot', 'bebe', 'novinh'])) f.ageCategory = 'Filhote';
  else if (has(text, ['jovem', 'jovens'])) f.ageCategory = 'Jovem';
  else if (has(text, ['adulto', 'adulta'])) f.ageCategory = 'Adulto';
  else if (has(text, ['senior', 'idos', 'velhinh'])) f.ageCategory = 'Sênior';

  if (has(text, ['macho', 'menino'])) f.sex = 'Macho';
  else if (has(text, ['femea', 'menina'])) f.sex = 'Fêmea';

  const cities = Array.from(new Set(pets.map(p => p.city)));
  const city = cities.find(c => text.includes(normalize(c)));
  if (city) f.city = city;

  return f;
}

function applyPetFilters(pets: Pet[], f: PetFilters) {
  return pets.filter(
    p =>
      p.status !== 'Adotado' &&
      (!f.species || p.species === f.species) &&
      (!f.size || p.size === f.size) &&
      (!f.ageCategory || p.ageCategory === f.ageCategory) &&
      (!f.sex || p.sex === f.sex) &&
      (!f.city || p.city === f.city)
  );
}

function describeFilters(f: PetFilters) {
  const parts: string[] = [];
  if (f.species) parts.push(f.species === 'Cachorro' ? 'cachorros' : 'gatos');
  else parts.push('pets');
  if (f.sex) parts.push(f.sex === 'Macho' ? 'machos' : 'fêmeas');
  if (f.ageCategory) parts.push(f.ageCategory.toLowerCase() + 's');
  if (f.size) parts.push(`de porte ${f.size.toLowerCase()}`);
  if (f.city) parts.push(`em ${f.city}`);
  return parts.join(' ');
}

/* ---------------- Respostas ---------------- */

function petInfo(pet: Pet): BotReply {
  const health = [
    pet.vaccinated && 'vacinado(a)',
    pet.neutered && 'castrado(a)',
    pet.dewormed && 'vermifugado(a)',
  ].filter(Boolean);
  return {
    text:
      `🐾 **${pet.name}** é ${pet.species === 'Cachorro' ? 'um cachorro' : 'um gato'} ${pet.breed}, ` +
      `${pet.sex.toLowerCase()}, ${pet.age}, porte ${pet.size.toLowerCase()}, em ${pet.city}/${pet.state}.\n` +
      `Status: **${pet.status}**.\n` +
      (health.length ? `Saúde: ${health.join(', ')}.\n` : '') +
      (pet.personality.length ? `Personalidade: ${pet.personality.join(', ')}.\n` : '') +
      (pet.specialNeeds ? `Necessidades especiais: ${pet.specialNeeds}.\n` : '') +
      `Está sob os cuidados da ONG ${pet.ongName}.`,
    actions: [
      { type: 'pet', label: `Ver perfil de ${pet.name}`, petId: pet.id },
      { type: 'ong', label: `Ver ${pet.ongName}`, ongId: pet.ongId },
    ],
    suggestions: ['Como funciona a adoção?', 'Ver outros pets'],
  };
}

function ongInfo(ong: ONG, pets: Pet[]): BotReply {
  const available = pets.filter(p => p.ongId === ong.id && p.status === 'Disponível').length;
  const services = [
    ong.acceptsDonations && 'aceita doações financeiras',
    ong.acceptsFood && 'recebe ração',
    ong.providesFood && 'distribui ração',
  ].filter(Boolean);
  return {
    text:
      `🏠 **${ong.name}**${ong.verified ? ' (verificada ✔)' : ''} — ${ong.neighborhood}, ${ong.city}/${ong.state}.\n` +
      `${ong.description}\n` +
      `Pets disponíveis: ${available} · Resgates totais: ${ong.rescuedTotal}.\n` +
      (services.length ? `Essa ONG ${services.join(', ')}.\n` : '') +
      `📞 ${ong.phone} · 📧 ${ong.email} · 📸 ${ong.instagram}`,
    actions: [{ type: 'ong', label: `Abrir perfil da ${ong.name}`, ongId: ong.id }],
    suggestions: ['Como doar?', 'Ver pets dessa ONG'],
  };
}

export function getWelcome(ctx: BotContext): BotReply {
  const name = ctx.user?.name?.split(' ')[0];
  const available = ctx.pets.filter(p => p.status === 'Disponível').length;
  return {
    text:
      `Oi${name ? `, ${name}` : ''}! 👋 Eu sou a **Scooby**, assistente virtual do Hub Pet.\n` +
      `Temos **${available} pets** esperando por um lar e **${ctx.ongs.length} ONGs** parceiras. ` +
      `Posso te ajudar a encontrar um pet, falar sobre ONGs, doações, banco de ração ou denúncias de abandono.`,
    suggestions: DEFAULT_SUGGESTIONS.slice(0, 5),
  };
}

export function getBotReply(input: string, ctx: BotContext): BotReply {
  const text = normalize(input);
  const { pets, ongs, reports, foodItems } = ctx;

  if (!text) return { text: 'Pode escrever sua dúvida que eu te ajudo! 😊', suggestions: DEFAULT_SUGGESTIONS };

  /* --- Emergência / maus-tratos (prioridade máxima) --- */
  if (has(text, ['maus tratos', 'maltrat', 'agredi', 'espancad', 'envenen', 'emergenc', 'urgente', 'atropelad', 'ferid'])) {
    return {
      text:
        '🚨 Em caso de maus-tratos ou animal em risco, acione as autoridades:\n' +
        '• Polícia Militar: **190**\n• Disque Denúncia: **181**\n' +
        '• IBAMA (Linha Verde): **0800 061 8080**\n' +
        'Maus-tratos a animais são crime (Lei 9.605/98, art. 32). Você também pode registrar a ocorrência aqui na plataforma para alertar ONGs e a comunidade.',
      actions: [
        { type: 'authorities', label: 'Ver contatos das autoridades' },
        { type: 'navigate', label: 'Registrar denúncia', tab: 'denunciar' },
      ],
    };
  }

  /* --- Saudação --- */
  if (/^(oi+|ola|opa|eai|e ai|hey|hello|bom dia|boa tarde|boa noite|salve)\b/.test(text) && text.split(' ').length <= 4) {
    return getWelcome(ctx);
  }

  /* --- Agradecimento / despedida --- */
  if (has(text, ['obrigad', 'valeu', 'agradec', 'brigad'])) {
    return { text: pick(['Por nada! 💛 Qualquer coisa, é só chamar.', 'Imagina! Os pets agradecem também 🐶🐱']) };
  }
  if (has(text, ['tchau', 'ate mais', 'ate logo', 'flw', 'falou'])) {
    return { text: 'Até mais! 🐾 Volte sempre que quiser.' };
  }

  /* --- Ajuda --- */
  if (has(text, ['ajuda', 'help', 'menu', 'o que voce faz', 'opcoes', 'comandos'])) {
    return {
      text:
        'Posso te ajudar com:\n' +
        '• 🐶 Encontrar pets (ex.: "gato filhote em São Paulo")\n' +
        '• ❤️ Explicar o processo de adoção\n' +
        '• 🏠 Informações sobre ONGs (ex.: digite o nome da ONG)\n' +
        '• 💰 Doações financeiras (PIX / transferência)\n' +
        '• 🦴 Banco de ração (doar ou pedir)\n' +
        '• 🚨 Denúncias de abandono e maus-tratos\n' +
        '• 🔐 Login e sua conta',
      suggestions: DEFAULT_SUGGESTIONS,
    };
  }

  /* --- Pet específico pelo nome --- */
  const petByName = pets.find(p => new RegExp(`\\b${normalize(p.name)}\\b`).test(text));
  if (petByName) return petInfo(petByName);

  /* --- ONG específica pelo nome --- */
  const ongByName = ongs.find(o => {
    const n = normalize(o.name);
    if (text.includes(n)) return true;
    // aceita parte significativa do nome (ex.: "patas" para "Patas Unidas")
    return n.split(' ').filter(w => w.length > 4 && !['protetores', 'animais', 'associacao'].includes(w)).some(w => text.includes(w));
  });
  if (ongByName && !has(text, ['adot', 'quero um', 'quero uma'])) return ongInfo(ongByName, pets);

  /* --- Processo de adoção --- */
  if (has(text, ['como funciona', 'como adot', 'processo', 'requisito', 'precis', 'document', 'custa', 'pago', 'gratis'])
      && has(text, ['adoc', 'adot', 'adotar', 'processo', 'requisito'])) {
    return {
      text:
        '❤️ Como adotar no Hub Pet:\n' +
        '1. Explore os pets disponíveis e abra o perfil do que te encantou.\n' +
        '2. Clique em **"Tenho interesse em adotar"** (é preciso estar logado).\n' +
        '3. Preencha o formulário com seus dados e tipo de moradia.\n' +
        '4. A ONG responsável analisa e entra em contato com você.\n' +
        '5. Após entrevista e, às vezes, visita, a adoção é finalizada! 🎉\n' +
        'A adoção é gratuita — algumas ONGs podem pedir uma contribuição voluntária. Você acompanha tudo no seu painel.',
      actions: [
        { type: 'navigate', label: 'Ver pets disponíveis', tab: 'adotar' },
        ...(!ctx.isLoggedIn ? [{ type: 'navigate', label: 'Fazer login', tab: 'login' } as BotAction] : []),
      ],
    };
  }

  /* --- Busca de pets --- */
  const filters = extractPetFilters(text, pets);
  const hasFilters = Object.keys(filters).length > 0;
  if (hasFilters || has(text, ['adot', 'pet', 'animal', 'animais', 'bicho', 'disponive', 'outros pets', 'mascote'])) {
    const found = applyPetFilters(pets, filters);
    if (found.length === 0) {
      return {
        text: `Poxa, não encontrei ${describeFilters(filters)} disponíveis no momento 😢. Que tal ampliar a busca?`,
        actions: [{ type: 'navigate', label: 'Ver todos os pets', tab: 'adotar' }],
        suggestions: ['Quero adotar um cachorro', 'Quero adotar um gato'],
      };
    }
    return {
      text: `Encontrei **${found.length}** ${describeFilters(filters)} esperando um lar${found.length > 3 ? '. Aqui vão alguns' : ''}:`,
      pets: found.slice(0, 3),
      actions: [{ type: 'navigate', label: 'Ver todos na página de adoção', tab: 'adotar' }],
      suggestions: ['Como funciona a adoção?', 'Filhotes', 'Porte pequeno'],
    };
  }

  /* --- Lista de ONGs --- */
  if (has(text, ['ong', 'instituic', 'abrigo', 'protetor', 'associac'])) {
    const list = ongs.slice(0, 5).map(o => `• **${o.name}** — ${o.city}/${o.state}${o.verified ? ' ✔' : ''}`).join('\n');
    return {
      text: `Temos ${ongs.length} ONGs parceiras:\n${list}\nDigite o nome de uma delas para saber mais.`,
      actions: [{ type: 'navigate', label: 'Ver todas as ONGs', tab: 'ongs' }],
    };
  }

  /* --- Banco de ração --- */
  if (has(text, ['racao', 'comida', 'aliment', 'banco'])) {
    const open = foodItems.filter(i => i.status === 'Aberto');
    const needs = open.filter(i => i.type === 'need');
    const available = open.filter(i => i.type === 'available');
    const urgent = needs.filter(i => i.urgency === 'Alta');
    return {
      text:
        `🦴 O Banco de Ração conecta quem pode doar com quem precisa.\n` +
        `Agora há **${needs.length}** pedidos abertos${urgent.length ? ` (${urgent.length} urgentes)` : ''} e **${available.length}** ofertas de ração disponíveis.\n` +
        (urgent[0] ? `⚠️ Urgente: ${urgent[0].title} — ${urgent[0].quantityKg}kg em ${urgent[0].city}.\n` : '') +
        `Você pode doar ração para uma ONG ou solicitar ajuda se estiver cuidando de animais.`,
      actions: [{ type: 'navigate', label: 'Abrir Banco de Ração', tab: 'banco-racao' }],
    };
  }

  /* --- Doações financeiras --- */
  if (has(text, ['doa', 'doar', 'pix', 'dinheiro', 'contribu', 'ajudar financeir', 'transferenc', 'apoiar'])) {
    const accepting = ongs.filter(o => o.acceptsDonations);
    return {
      text:
        `💰 Você pode apoiar ${accepting.length} ONGs com doações via **PIX** ou **transferência bancária**. ` +
        `O valor vai direto para a conta da ONG escolhida e ajuda com ração, vacinas, castrações e tratamentos.`,
      actions: [{ type: 'navigate', label: 'Ir para Doações', tab: 'doacoes' }],
      suggestions: ['Banco de ração', 'Ver ONGs'],
    };
  }

  /* --- Denúncia / mapa de abandono --- */
  if (has(text, ['denunc', 'abandon', 'rua', 'perdid', 'achei', 'encontrei', 'mapa', 'resgat'])) {
    const active = reports.filter(r => r.status !== 'Expirado').length;
    return {
      text:
        `📍 Viu um animal abandonado? Registre uma denúncia com foto, endereço e estado de saúde. ` +
        `Ela aparece no Mapa de Abandono para ONGs e voluntários.\n` +
        `Hoje há **${active}** ocorrências ativas no mapa. Registros sem novas confirmações expiram após 3 meses, ` +
        `e você pode **corroborar** uma ocorrência existente se viu o mesmo animal.`,
      actions: [
        { type: 'navigate', label: 'Fazer denúncia', tab: 'denunciar' },
        { type: 'navigate', label: 'Ver mapa', tab: 'mapa' },
      ],
    };
  }

  /* --- Conta / login --- */
  if (has(text, ['login', 'entrar', 'conta', 'cadastr', 'senha', 'logar', 'perfil', 'painel', 'dashboard'])) {
    if (ctx.isLoggedIn) {
      return {
        text: `Você já está logado${ctx.user ? ` como **${ctx.user.name}**` : ''}. No seu painel você acompanha ${ctx.isONG ? 'os pets da ONG e os interessados' : 'seus pedidos de adoção e denúncias'}.`,
        actions: [{ type: 'navigate', label: 'Abrir meu painel', tab: ctx.isONG ? 'dashboard-ong' : 'dashboard-usuario' }],
      };
    }
    return {
      text: 'Para demonstrar interesse em adotar e acompanhar seus pedidos, faça login. Também há contas de demonstração para usuário e ONG.',
      actions: [{ type: 'navigate', label: 'Fazer login', tab: 'login' }],
    };
  }

  /* --- Cadastrar pet (ONG) --- */
  if (has(text, ['cadastrar pet', 'divulgar', 'anunciar', 'colocar para adocao', 'doar meu', 'doar um pet'])) {
    return {
      text: ctx.isONG
        ? 'Pelo painel da ONG você pode cadastrar, editar e acompanhar os pets e os interessados.'
        : 'Apenas ONGs cadastradas podem anunciar pets para adoção. Se você precisa doar um animal, procure uma ONG parceira.',
      actions: ctx.isONG
        ? [{ type: 'navigate', label: 'Painel da ONG', tab: 'dashboard-ong' }]
        : [{ type: 'navigate', label: 'Ver ONGs', tab: 'ongs' }],
    };
  }

  /* --- Fallback --- */
  return {
    text: pick([
      'Hmm, não entendi muito bem 🤔. Você pode reformular ou escolher uma das opções abaixo:',
      'Desculpe, ainda estou aprendendo! 🐶 Tente uma dessas opções:',
    ]),
    suggestions: DEFAULT_SUGGESTIONS,
  };
}
