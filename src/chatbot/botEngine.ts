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
  'Como adotar um cachorro?',
  'Como funciona a vacinação?',
  'Encontrar uma ONG',
  'Como denunciar abandono?',
  'Como doar ração?',
  'Falar com uma ONG',
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
  const availableDogs = ctx.pets.filter(p => p.status === 'Disponível' && p.species === 'Cachorro').length;
  const ongsWithVac = ctx.ongs.filter(o => o.offersVaccination).length;

  return {
    text:
      `Au au! Olá${name ? `, ${name}` : ''}! 🐶🐾\n` +
      `Eu sou o **Scooby**, o cãozinho mascote oficial do PetHub!\n\n` +
      `Estou aqui para te ajudar com tudo sobre nossos aumigos: temos **${availableDogs} cãezinhos** para adoção, ` +
      `**${ctx.ongs.length} ONGs cadastradas** e **${ongsWithVac} ONGs oferecendo vacinação canina**!\n\n` +
      `O que você gostaria de saber hoje?`,
    suggestions: DEFAULT_SUGGESTIONS,
  };
}

export function getBotReply(input: string, ctx: BotContext): BotReply {
  const text = normalize(input);
  const { pets, ongs, reports, foodItems } = ctx;

  if (!text) return { text: 'Au au! Pode escrever sua dúvida que eu te ajudo na hora! 🐶', suggestions: DEFAULT_SUGGESTIONS };

  /* --- Emergência / maus-tratos (prioridade máxima) --- */
  if (has(text, ['maus tratos', 'maltrat', 'agredi', 'espancad', 'envenen', 'emergenc', 'urgente', 'atropelad', 'ferid'])) {
    return {
      text:
        '🚨 Au au! Em caso de emergência ou risco à vida do animal, acione imediatamente as autoridades:\n\n' +
        '• Polícia Militar Ambiental: **190**\n• Disque Denúncia: **181**\n' +
        '• IBAMA (Linha Verde): **0800 061 8080**\n\n' +
        'Maus-tratos a cães e gatos é crime punido por lei (Lei 9.605/98). Você também pode registrar a ocorrência no nosso mapa para alertar a comunidade.',
      actions: [
        { type: 'authorities', label: 'Ver contatos das autoridades' },
        { type: 'navigate', label: 'Registrar denúncia no mapa', tab: 'denunciar' },
      ],
    };
  }

  /* --- Saudação --- */
  if (/^(oi+|ola|opa|eai|e ai|hey|hello|bom dia|boa tarde|boa noite|salve|scooby)\b/.test(text) && text.split(' ').length <= 4) {
    return getWelcome(ctx);
  }

  /* --- Agradecimento / despedida --- */
  if (has(text, ['obrigad', 'valeu', 'agradec', 'brigad'])) {
    return { text: pick(['Au au! Fico muito feliz em ajudar! 🐾 Qualquer coisa é só me chamar!', 'De nada, amigo(a)! Uma lambida carinhosa do Scooby! 🐶❤️']) };
  }
  if (has(text, ['tchau', 'ate mais', 'ate logo', 'flw', 'falou'])) {
    return { text: 'Au au! Até logo! 🐾 Volte sempre para visitar os nossos cãezinhos!' };
  }

  /* --- Vacinação de Cães (Requisito Explícito) --- */
  if (has(text, ['vacin', 'vacina', 'vacinacao', 'vacinar', 'antirrabica', 'v10', 'v8', 'gripe canina', 'dose', 'injetav'])) {
    const ongsWithVac = ongs.filter(o => o.offersVaccination);
    return {
      text:
        `Au au! A vacinação em dia protege a vida dos cães! 💉🐶\n\n` +
        `Aqui no PetHub, a vacinação funciona de maneira simples e transparente:\n` +
        `• **Vinculada às ONGs:** Cada ONG define se oferece ou não vacinação.\n` +
        `• **Identificação Clara:** Você pode ver quais ONGs oferecem o serviço pelo selo **"✓ Oferece vacinação"** na página de ONGs.\n` +
        `• **Agendamento Simples:** Ao acessar o perfil de uma ONG com vacinação disponível, clique em **"Agendar Vacinação para Cão"** e informe os dados do seu cão e a data desejada!\n\n` +
        `Atualmente, **${ongsWithVac.length} ONGs parceiras** oferecem vacinação: ${ongsWithVac.map(o => o.name).join(', ')}.`,
      actions: [
        { type: 'navigate', label: 'Ver ONGs que oferecem vacinação', tab: 'ongs' },
      ],
      suggestions: ['Como adotar um cachorro?', 'Encontrar uma ONG', 'Como doar ração?'],
    };
  }

  /* --- Como falar / entrar em contato com uma ONG (Requisito Explícito) --- */
  if (has(text, ['falar com ong', 'contato da ong', 'contatar ong', 'falar com a ong', 'telefone da ong', 'whatsapp da ong', 'como falar'])) {
    return {
      text:
        `Au au! Todas as ONGs cadastradas no PetHub têm seus canais de contato abertos! 📞🏠\n\n` +
        `Para falar com qualquer ONG:\n` +
        `1. Acesse a aba **"ONGs"** no menu superior.\n` +
        `2. Clique em **"Ver ONG"** para abrir o perfil institucional da organização.\n` +
        `3. Você encontrará o **WhatsApp direto**, telefone, e-mail, Instagram e endereço para visita!\n\n` +
        `Dica do Scooby: use o WhatsApp da ONG para tirar dúvidas rápidas sobre horários e adoções.`,
      actions: [
        { type: 'navigate', label: 'Ver lista de ONGs', tab: 'ongs' },
      ],
      suggestions: ['Como funciona a vacinação?', 'Como adotar um cachorro?', 'Como doar ração?'],
    };
  }

  /* --- Como adotar um cachorro / animal (Requisito Explícito) --- */
  if (has(text, ['como adot', 'como funciona a adoc', 'processo de adoc', 'requisito', 'adotar um cao', 'adotar um cachorro', 'adotar'])) {
    return {
      text:
        `Au au! Encontrar um novo lar é o maior sonho de todos os nossos cãezinhos! ❤️🐶\n\n` +
        `Veja como funciona a adoção responsável no PetHub:\n` +
        `1. **Escolha seu aumigo:** Acesse "Adotar" e navegue pelos cães disponíveis.\n` +
        `2. **Clique em "Tenho interesse em adotar":** Para adotar, é obrigatório estar logado como usuário.\n` +
        `3. **Envie seus dados:** Preencha tipo de moradia e mensagem para a ONG.\n` +
        `4. **A ONG responde:** A entidade analisa seu perfil e entra em contato via WhatsApp/telefone para entrevista e entrega do pet! 🎉\n\n` +
        `A adoção é gratuita e você pode acompanhar o status direto no seu painel!`,
      actions: [
        { type: 'navigate', label: 'Ver cães para adoção', tab: 'adotar' },
        ...(!ctx.isLoggedIn ? [{ type: 'navigate', label: 'Fazer Login de Usuário', tab: 'login' } as BotAction] : []),
      ],
      suggestions: ['Filhotes de cachorro', 'Como funciona a vacinação?', 'Encontrar uma ONG'],
    };
  }

  /* --- Encontrar uma ONG (Requisito Explícito) --- */
  if (has(text, ['encontrar ong', 'ver ongs', 'buscar ong', 'lista de ong', 'quais ongs', 'instituic', 'abrigo'])) {
    const list = ongs.map(o => `• **${o.name}** (${o.city}/${o.state}) — ${o.offersVaccination ? '💉 Oferece vacinação' : 'Não vacina'}`).join('\n');
    return {
      text:
        `Au au! Temos **${ongs.length} ONGs parceiras** no PetHub cuidando dos nossos amigos peludos:\n\n${list}\n\n` +
        `Você pode filtrar por cidade e por serviços (vacinação, ração e doações) na aba ONGs!`,
      actions: [{ type: 'navigate', label: 'Ver todas as ONGs', tab: 'ongs' }],
      suggestions: ['Como funciona a vacinação?', 'Falar com uma ONG', 'Como doar ração?'],
    };
  }

  /* --- Doar ou pedir ração (Requisito Explícito) --- */
  if (has(text, ['racao', 'comida', 'doar racao', 'pedir racao', 'alimento', 'banco de racao', 'fome'])) {
    const open = foodItems.filter(i => i.status === 'Aberto');
    const needs = open.filter(i => i.type === 'need');
    const available = open.filter(i => i.type === 'available');
    return {
      text:
        `Au au! Uma boa ração deixa o pelo brilhante e o rabinho abanando! 🦴✨\n\n` +
        `O **Banco de Ração Solidário** do PetHub funciona assim:\n` +
        `• **Quer Doar Ração?** Veja a lista de ONGs e famílias que precisam e clique em "Doar Ração".\n` +
        `• **Precisa de Ajuda?** Você pode solicitar um lote de ração disponível para retirada.\n\n` +
        `Atualmente há **${needs.length} pedidos de ração abertos** e **${available.length} lotes disponíveis** para doação.`,
      actions: [{ type: 'navigate', label: 'Abrir Banco de Ração', tab: 'banco-racao' }],
      suggestions: ['Como doar dinheiro?', 'Encontrar uma ONG', 'Como adotar um cachorro?'],
    };
  }

  /* --- Denunciar abandono (Requisito Explícito) --- */
  if (has(text, ['denunc', 'abandon', 'denunciar', 'achei animal', 'vi um cachorro', 'animal na rua', 'mapa de abandono'])) {
    const active = reports.filter(r => r.status !== 'Expirado').length;
    return {
      text:
        `Au au! Nenhum animal merece ser abandonado na rua! 📍🚨\n\n` +
        `No PetHub você pode proteger os animais através da denúncia colaborativa:\n` +
        `1. Clique em **"Denunciar abandono"** e informe onde o animal foi visto, com foto e estado de saúde.\n` +
        `2. O ponto aparece no **Mapa de Abandonos** para que protetores e ONGs possam agir.\n` +
        `3. Vizinhos podem **corroborar** o ponto se também virem o animal.\n\n` +
        `Temos **${active} ocorrências ativas** registradas hoje no mapa.`,
      actions: [
        { type: 'navigate', label: 'Registrar denúncia de abandono', tab: 'denunciar' },
        { type: 'navigate', label: 'Ver Mapa de Abandonos', tab: 'mapa' },
      ],
      suggestions: ['Como funciona a vacinação?', 'Encontrar uma ONG', 'Como adotar um cachorro?'],
    };
  }

  /* --- Doações financeiras --- */
  if (has(text, ['doa', 'doar', 'pix', 'dinheiro', 'contribu', 'ajudar financeir', 'transferenc', 'apoiar'])) {
    const accepting = ongs.filter(o => o.acceptsDonations);
    return {
      text:
        `Au au! A ajuda financeira mantém o trabalho das ONGs vivo! 💰🐕\n\n` +
        `Temos **${accepting.length} ONGs** preparadas para receber doações seguras via **PIX direto** ou transferência bancária. ` +
        `O valor vai direto para a conta institucional da entidade para custear vacinas, ração e remédios.`,
      actions: [{ type: 'navigate', label: 'Ver Meios de Doação', tab: 'doacoes' }],
      suggestions: ['Banco de ração', 'Ver ONGs', 'Como funciona a vacinação?'],
    };
  }

  /* --- Ajuda / Menu geral --- */
  if (has(text, ['ajuda', 'help', 'menu', 'o que voce faz', 'opcoes', 'comandos', 'quem e voce'])) {
    return {
      text:
        'Au au! Eu sou o **Scooby** e posso te guiar em qualquer área do PetHub:\n\n' +
        '• 🐶 **Adoção:** Como adotar e quais cães estão disponíveis\n' +
        '• 💉 **Vacinação:** Como agendar vacina para seu cão nas ONGs\n' +
        '• 🏠 **ONGs:** Localização, contatos e serviços das organizações\n' +
        '• 🚨 **Abandono:** Como registrar um relato ou ver o mapa\n' +
        '• 🦴 **Banco de Ração:** Doar ou pedir alimentos para pets\n' +
        '• 💰 **Doações:** Como apoiar as entidades parceiras via PIX',
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
    return n.split(' ').filter(w => w.length > 4 && !['protetores', 'animais', 'associacao', 'instituto'].includes(w)).some(w => text.includes(w));
  });
  if (ongByName && !has(text, ['adot', 'quero um', 'quero uma'])) return ongInfo(ongByName, pets);

  /* --- Busca filtrada de pets --- */
  const filters = extractPetFilters(text, pets);
  const hasFilters = Object.keys(filters).length > 0;
  if (hasFilters || has(text, ['pet', 'animal', 'animais', 'bicho', 'disponive', 'outros pets', 'mascote', 'cao', 'dog'])) {
    const found = applyPetFilters(pets, filters);
    if (found.length === 0) {
      return {
        text: `Au au! Não encontrei ${describeFilters(filters)} disponíveis no momento 😢. Que tal dar uma olhada em todos os nossos amiguinhos?`,
        actions: [{ type: 'navigate', label: 'Ver todos os cães e gatos', tab: 'adotar' }],
        suggestions: ['Quero adotar um cachorro', 'Como funciona a vacinação?'],
      };
    }
    return {
      text: `Au au! Encontrei **${found.length}** ${describeFilters(filters)} esperando por você${found.length > 3 ? '. Dá uma olhadinha nesses' : ''}:`,
      pets: found.slice(0, 3),
      actions: [{ type: 'navigate', label: 'Ver todos na página de adoção', tab: 'adotar' }],
      suggestions: ['Como funciona a adoção?', 'Como funciona a vacinação?', 'Encontrar uma ONG'],
    };
  }

  /* --- Conta / login --- */
  if (has(text, ['login', 'entrar', 'conta', 'cadastr', 'senha', 'logar', 'perfil', 'painel', 'dashboard'])) {
    if (ctx.isLoggedIn) {
      return {
        text: `Au au! Você já está conectado como **${ctx.user?.name}**! No seu painel você acompanha seus pedidos de adoção, vacinas e denúncias.`,
        actions: [{ type: 'navigate', label: 'Abrir meu painel', tab: ctx.isONG ? 'dashboard-ong' : 'dashboard-usuario' }],
      };
    }
    return {
      text: 'Au au! Para adotar um pet ou acompanhar pedidos, acesse a tela de login. Você pode entrar como usuário comum ou como ONG parceira!',
      actions: [{ type: 'navigate', label: 'Ir para o Login', tab: 'login' }],
    };
  }

  /* --- Cadastrar pet (ONG) --- */
  if (has(text, ['cadastrar pet', 'divulgar', 'anunciar', 'colocar para adocao', 'doar meu', 'doar um pet'])) {
    return {
      text: ctx.isONG
        ? 'Au au! Pelo painel da ONG você pode cadastrar, editar e acompanhar os pets e interessados.'
        : 'Au au! Apenas ONGs parceiras cadastradas podem anunciar animais para adoção. Se precisa doar um animal, entre em contato com uma ONG parceira!',
      actions: ctx.isONG
        ? [{ type: 'navigate', label: 'Painel da ONG', tab: 'dashboard-ong' }]
        : [{ type: 'navigate', label: 'Ver ONGs', tab: 'ongs' }],
    };
  }

  /* --- Fallback --- */
  return {
    text: pick([
      'Au au? Não entendi direito com essas orelhas caídas! 🐶 Você pode reformular ou clicar em um dos botões abaixo:',
      'Au au! Ainda sou um filhote aprendendo, mas posso te ajudar com adoção, vacinação, ONGs e ração! Escolha uma opção:',
    ]),
    suggestions: DEFAULT_SUGGESTIONS,
  };
}
