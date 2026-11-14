import type { Pet, ONG, AbandonmentReport, FoodBankItem, AdoptionInterest, DonationRecord, User, VaccinationRequest } from '../types';

export const INITIAL_USER: User = {
  id: 'user-lucas',
  name: 'Lucas',
  email: 'lucas@gmail.com',
  role: 'user',
  phone: '(11) 98765-4321',
  city: 'São Paulo',
  state: 'SP',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80',
};

export const INITIAL_ONG_USER: User = {
  id: 'user-ong-salvapet',
  name: 'SalvaPet',
  email: 'SalvaPet@gmail.com',
  role: 'ong',
  phone: '(11) 3214-5678',
  city: 'São Paulo',
  state: 'SP',
  ongId: 'ong-salvapet',
  avatar: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=160&q=80',
};

export const INITIAL_ONGS: ONG[] = [
  {
    id: 'ong-salvapet',
    name: 'SalvaPet',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Vila Mariana',
    address: 'Rua Domingos de Morais, 1420',
    description: 'A SalvaPet é uma organização dedicada ao resgate, acolhimento, vacinação e encaminhamento responsável de cães e gatos em situação de vulnerabilidade em São Paulo.',
    logo: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    phone: '(11) 3214-5678',
    whatsapp: '(11) 99123-4567',
    email: 'SalvaPet@gmail.com',
    instagram: '@salvapet_oficial',
    website: 'www.salvapet.org.br',
    acceptsFood: true,
    providesFood: true,
    acceptsDonations: true,
    offersVaccination: true,
    pixKey: 'exemplo@salvapet.org',
    bank: {
      bankName: 'Banco do Brasil',
      code: '001',
      agency: '1234-5',
      account: '123456-7',
      accountType: 'Conta Corrente Jurídica'
    },
    availablePetsCount: 4,
    rescuedTotal: 18,
    verified: true,
  },
  {
    id: 'ong-vida-animal',
    name: 'Instituto Vida Animal',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Pinheiros',
    address: 'Rua dos Pinheiros, 850',
    description: 'Focado em reabilitação clínica, campanhas comunitárias de vacinação canina e encaminhamento para lares seguros e amorosos na zona oeste da capital.',
    logo: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80',
    phone: '(11) 3089-2211',
    whatsapp: '(11) 98112-3344',
    email: 'contato@vidaanimal.org.br',
    instagram: '@vidaanimal_sp',
    website: 'www.vidaanimal.org.br',
    acceptsFood: true,
    providesFood: false,
    acceptsDonations: true,
    offersVaccination: true,
    pixKey: 'pix@vidaanimal.org.br',
    bank: {
      bankName: 'Itaú Unibanco',
      code: '341',
      agency: '0342',
      account: '98712-4',
      accountType: 'Conta Corrente'
    },
    availablePetsCount: 3,
    rescuedTotal: 34,
    verified: true,
  },
  {
    id: 'ong-patas-amigas',
    name: 'Amigos de Quatro Patas',
    city: 'Campinas',
    state: 'SP',
    neighborhood: 'Taquaral',
    address: 'Av. Barão de Itapura, 2100',
    description: 'Associação voluntária que atua no resgate e triagem de animais em Campinas e região metropolitana, mantendo abrigo temporário e distribuição de ração.',
    logo: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=1200&q=80',
    phone: '(19) 3251-4090',
    whatsapp: '(19) 99345-6712',
    email: 'ajuda@amigosdequatropatas.org',
    instagram: '@quatropatas_campinas',
    website: 'www.amigosdequatropatas.org',
    acceptsFood: true,
    providesFood: true,
    acceptsDonations: true,
    offersVaccination: false,
    pixKey: 'doacoes@amigosdequatropatas.org',
    bank: {
      bankName: 'Bradesco',
      code: '237',
      agency: '1890',
      account: '45612-8',
      accountType: 'Conta Corrente Jurídica'
    },
    availablePetsCount: 3,
    rescuedTotal: 42,
    verified: true,
  },
  {
    id: 'ong-anjos-peludos',
    name: 'Anjos Peludos Resgate',
    city: 'São Paulo',
    state: 'SP',
    neighborhood: 'Tatuapé',
    address: 'Rua Tuiuti, 1630',
    description: 'Grupo com foco em acolhimento e tratamento de animais resgatados, com ambulatório próprio para vacinas essenciais e cuidados de saúde.',
    logo: 'https://images.unsplash.com/photo-1534361960057-19889db9621e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?auto=format&fit=crop&w=1200&q=80',
    phone: '(11) 2091-8844',
    whatsapp: '(11) 97654-1234',
    email: 'anjospeludos@resgate.org',
    instagram: '@anjospeludos_resgate',
    acceptsFood: false,
    providesFood: false,
    acceptsDonations: true,
    offersVaccination: true,
    pixKey: 'chavepix@anjospeludos.org',
    bank: {
      bankName: 'Caixa Econômica',
      code: '104',
      agency: '0289',
      account: '0032918-1',
      accountType: 'Conta Jurídica'
    },
    availablePetsCount: 2,
    rescuedTotal: 27,
    verified: true,
  },
  {
    id: 'ong-refugio-esperanca',
    name: 'Refúgio & Esperança Pet',
    city: 'Curitiba',
    state: 'PR',
    neighborhood: 'Batel',
    address: 'Av. do Batel, 1450',
    description: 'Rede acolhedora em Curitiba dedicada ao resgate de cães e gatos em situação de abandono, focando em reabilitação, socialização e adoção responsável.',
    logo: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80',
    phone: '(41) 3045-8822',
    whatsapp: '(41) 98877-6655',
    email: 'contato@refugioesperanca.org',
    instagram: '@refugioesperanca_pr',
    website: 'www.refugioesperancapet.org',
    acceptsFood: true,
    providesFood: true,
    acceptsDonations: true,
    offersVaccination: false,
    pixKey: 'financeiro@refugioesperanca.org',
    bank: {
      bankName: 'Santander',
      code: '033',
      agency: '3201',
      account: '13009845-2',
      accountType: 'Conta Corrente'
    },
    availablePetsCount: 2,
    rescuedTotal: 31,
    verified: true,
  },
  {
    id: 'ong-patinhas-do-sul',
    name: 'Patinhas do Bem',
    city: 'Santos',
    state: 'SP',
    neighborhood: 'Gonzaga',
    address: 'Av. Ana Costa, 420',
    description: 'Atuação no litoral paulista com resgates, feiras mensais de adoção e campanhas preventivas de vacinação antirrábica e polivalente para cães.',
    logo: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=300&q=80',
    coverImage: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1200&q=80',
    phone: '(13) 3289-5500',
    whatsapp: '(13) 99182-7364',
    email: 'patinhasdobem@litoral.org',
    instagram: '@patinhasdobem_santos',
    acceptsFood: true,
    providesFood: false,
    acceptsDonations: true,
    offersVaccination: true,
    pixKey: 'contato@patinhasdobem.org',
    bank: {
      bankName: 'Banco do Brasil',
      code: '001',
      agency: '0543-1',
      account: '87654-2',
      accountType: 'Conta Corrente'
    },
    availablePetsCount: 2,
    rescuedTotal: 22,
    verified: true,
  }
];

export const INITIAL_PETS: Pet[] = [
  {
    id: 'pet-thor',
    name: 'Thor',
    species: 'Cachorro',
    breed: 'SRD',
    age: '2 anos',
    ageCategory: 'Adulto',
    sex: 'Macho',
    size: 'Médio',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-salvapet',
    ongName: 'ONG SalvaPet',
    description: 'Thor foi resgatado após ser encontrado sozinho e desorientado em via pública. Já passou por consulta veterinária completa, está saudável, dócil, sociável e ansioso por um lar responsável.',
    personality: ['Dócil', 'Brincalhão', 'Carinhoso', 'Sociável'],
    image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 1,
    createdAt: '2026-10-15',
  },
  {
    id: 'pet-luna',
    name: 'Luna',
    species: 'Gato',
    breed: 'SRD',
    age: '1 ano',
    ageCategory: 'Jovem',
    sex: 'Fêmea',
    size: 'Pequeno',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-salvapet',
    ongName: 'ONG SalvaPet',
    description: 'Luna é uma gatinha calma e meiga resgatada ainda jovem. É ronronadora, adora carinho e se adapta com facilidade a apartamentos telados.',
    personality: ['Calma', 'Carinhosa', 'Ronronadora'],
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 0,
    createdAt: '2026-10-20',
  },
  {
    id: 'pet-mel',
    name: 'Mel',
    species: 'Cachorro',
    breed: 'SRD',
    age: '4 anos',
    ageCategory: 'Adulto',
    sex: 'Fêmea',
    size: 'Médio',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    description: 'Mel é extremamente companheira e tranquila. Anda educadamente com guia, convive em perfeita harmonia com outros cães e já aprendeu comandos básicos.',
    personality: ['Companheira', 'Tranquila', 'Amorosa', 'Obediente'],
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 2,
    createdAt: '2026-10-25',
  },
  {
    id: 'pet-bob',
    name: 'Bob',
    species: 'Cachorro',
    breed: 'Vira-lata Caramelo',
    age: '1 ano',
    ageCategory: 'Jovem',
    sex: 'Macho',
    size: 'Médio',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    description: 'O clássico e amado vira-lata caramelo brasileiro! Bob tem energia na medida certa, adora passear no parque, dar a patinha e receber carinho na barriga.',
    personality: ['Brincalhão', 'Esperto', 'Sociável', 'Carinhoso'],
    image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 3,
    createdAt: '2026-11-01',
  },
  {
    id: 'pet-pipoca',
    name: 'Pipoca',
    species: 'Cachorro',
    breed: 'Poodle Mix',
    age: '2 anos',
    ageCategory: 'Adulto',
    sex: 'Fêmea',
    size: 'Pequeno',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-vida-animal',
    ongName: 'Instituto Vida Animal',
    description: 'Pipoca é uma cachorrinha dócil de pequeno porte, perfeita para apartamentos. É carinhosa, não late à toa e adora um colo bem quentinho.',
    personality: ['Dócil', 'Silenciosa', 'Afetuosa', 'Calma'],
    image: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 1,
    createdAt: '2026-11-02',
  },
  {
    id: 'pet-zeus',
    name: 'Zeus',
    species: 'Cachorro',
    breed: 'Labrador Mix',
    age: '3 anos',
    ageCategory: 'Adulto',
    sex: 'Macho',
    size: 'Grande',
    city: 'Campinas',
    state: 'SP',
    ongId: 'ong-patas-amigas',
    ongName: 'Amigos de Quatro Patas',
    description: 'Zeus é um cão imponente e com coração gigante. Adora brincadeiras na água, corridas e se dá muito bem com crianças e outros cães.',
    personality: ['Leal', 'Protetor', 'Brincalhão', 'Amigável'],
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 2,
    createdAt: '2026-11-03',
  },
  {
    id: 'pet-maya',
    name: 'Maya',
    species: 'Cachorro',
    breed: 'Beagle Mix',
    age: '8 meses',
    ageCategory: 'Filhote',
    sex: 'Fêmea',
    size: 'Médio',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-anjos-peludos',
    ongName: 'Anjos Peludos Resgate',
    description: 'Maya é uma filhotona alegre, curiosa e muito ativa. Está aprendendo comandos de obediência e precisa de uma família com disposição para brincadeiras diárias.',
    personality: ['Curiosa', 'Ativa', 'Alegre', 'Inteligente'],
    image: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505628346881-b72b27e84530?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: false,
    dewormed: true,
    interestedCount: 0,
    createdAt: '2026-11-04',
  },
  {
    id: 'pet-fred',
    name: 'Fred',
    species: 'Cachorro',
    breed: 'Fox Paulistinha Mix',
    age: '4 anos',
    ageCategory: 'Adulto',
    sex: 'Macho',
    size: 'Pequeno',
    city: 'Curitiba',
    state: 'PR',
    ongId: 'ong-refugio-esperanca',
    ongName: 'Refúgio & Esperança Pet',
    description: 'Fred é esperto, fiel e muito apegado aos tutores. Convive tranquilamente em ambientes menores e é um excelente companheiro para o dia a dia.',
    personality: ['Esperto', 'Fiel', 'Companheiro', 'Alerta'],
    image: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 1,
    createdAt: '2026-11-05',
  },
  {
    id: 'pet-nina',
    name: 'Nina',
    species: 'Cachorro',
    breed: 'Border Collie Mix',
    age: '1 ano e meio',
    ageCategory: 'Jovem',
    sex: 'Fêmea',
    size: 'Médio',
    city: 'Santos',
    state: 'SP',
    ongId: 'ong-patinhas-do-sul',
    ongName: 'Patinhas do Bem',
    description: 'Nina é extremamente inteligente e rápida no aprendizado. Adora buscar bolinhas, correr na praia e conviver com pessoas e outros animais.',
    personality: ['Inteligente', 'Brincalhona', 'Carinhosa', 'Ágil'],
    image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 2,
    createdAt: '2026-11-06',
  },
  {
    id: 'pet-max',
    name: 'Max',
    species: 'Cachorro',
    breed: 'Pastor Mix',
    age: '3 anos',
    ageCategory: 'Adulto',
    sex: 'Macho',
    size: 'Grande',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-vida-animal',
    ongName: 'Instituto Vida Animal',
    description: 'Max é calmo, equilibrado e protetor. Já passou por adestramento básico, anda perfeitamente ao lado na guia e é muito dócil com toda a família.',
    personality: ['Equilibrado', 'Dócil', 'Obediente', 'Protetor'],
    image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 1,
    createdAt: '2026-11-07',
  },
  {
    id: 'pet-belinha',
    name: 'Belinha',
    species: 'Cachorro',
    breed: 'SRD Dourada',
    age: '5 anos',
    ageCategory: 'Adulto',
    sex: 'Fêmea',
    size: 'Médio',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    description: 'Belinha tem um temperamento dócil e amoroso. Ama carinho, passeios calmos e é perfeita para lares tranquilos com idosos ou crianças.',
    personality: ['Amorosa', 'Calma', 'Dócil', 'Companheira'],
    image: 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 0,
    createdAt: '2026-11-08',
  },
  {
    id: 'pet-chico',
    name: 'Chico',
    species: 'Cachorro',
    breed: 'Dachshund Mix',
    age: '2 anos',
    ageCategory: 'Adulto',
    sex: 'Macho',
    size: 'Pequeno',
    city: 'Campinas',
    state: 'SP',
    ongId: 'ong-patas-amigas',
    ongName: 'Amigos de Quatro Patas',
    description: 'Chico é o famoso "salsichinha" mestiço. Cheio de charme, curioso e companheiro para todas as horas.',
    personality: ['Charmeiro', 'Curioso', 'Divertido', 'Carinhoso'],
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: true,
    dewormed: true,
    interestedCount: 1,
    createdAt: '2026-11-09',
  },
  {
    id: 'pet-tobby',
    name: 'Tobby',
    species: 'Cachorro',
    breed: 'Golden Retriever Mix',
    age: '7 meses',
    ageCategory: 'Filhote',
    sex: 'Macho',
    size: 'Grande',
    city: 'São Paulo',
    state: 'SP',
    ongId: 'ong-anjos-peludos',
    ongName: 'Anjos Peludos Resgate',
    description: 'Tobby tem uma pelagem dourada linda e um olhar que derrete qualquer coração. Sociável com todos os cães e adora pegar bolinhas.',
    personality: ['Carinhoso', 'Sociável', 'Divertido', 'Amoroso'],
    image: 'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=800&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598133894008-61f7fdb8cc3a?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'Disponível',
    vaccinated: true,
    neutered: false,
    dewormed: true,
    interestedCount: 2,
    createdAt: '2026-11-10',
  }
];

export const INITIAL_ABANDONMENT_REPORTS: AbandonmentReport[] = [
  {
    id: 'rep-1',
    photoUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
    address: 'Rua Domingos de Morais, próximo ao 1800',
    neighborhood: 'Vila Mariana',
    city: 'São Paulo',
    state: 'SP',
    date: '2026-10-24',
    description: 'Encontrei este cachorro próximo à praça. Ele estava sozinho e aparentava estar abandonado, sem coleira ou identificação.',
    species: 'Cachorro',
    healthCondition: 'Sadio',
    status: 'Confirmado por múltiplos registros',
    reportCount: 2,
    lat: -23.5898,
    lng: -46.6346,
    reportedBy: 'Lucas',
    reportedByRole: 'user',
    createdAt: '2026-10-24T14:30:00Z',
    lastCorroboratedAt: '2026-11-02T10:15:00Z',
  },
  {
    id: 'rep-2',
    photoUrl: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
    address: 'Rua Fradique Coutinho, 940',
    neighborhood: 'Pinheiros',
    city: 'São Paulo',
    state: 'SP',
    date: '2026-11-05',
    description: 'Gata com filhotes deixada dentro de uma caixa de papelão em calçada comercial.',
    species: 'Gato',
    healthCondition: 'Debilitado / Desnutrido',
    status: 'Ativo',
    reportCount: 1,
    lat: -23.5612,
    lng: -46.6892,
    reportedBy: 'Morador Local',
    reportedByRole: 'user',
    createdAt: '2026-11-05T09:12:00Z',
  },
  {
    id: 'rep-3',
    photoUrl: 'https://images.unsplash.com/photo-1544568100-847a948585b9?auto=format&fit=crop&w=600&q=80',
    address: 'Av. Santo Amaro, 3200',
    neighborhood: 'Santo Amaro',
    city: 'São Paulo',
    state: 'SP',
    date: '2026-07-10',
    description: 'Cão avistado no canteiro central. Sem novos relatos após 3 meses.',
    species: 'Cachorro',
    healthCondition: 'Sadio',
    status: 'Expirado', // Rule: 3 months passed without additional reports
    reportCount: 1,
    lat: -23.6277,
    lng: -46.6865,
    reportedBy: 'Cidadão',
    reportedByRole: 'user',
    createdAt: '2026-07-10T11:00:00Z',
  }
];

export const INITIAL_FOOD_ITEMS: FoodBankItem[] = [
  {
    id: 'food-1',
    type: 'need',
    title: 'Ração para cães adultos',
    orgOrUserName: 'ONG SalvaPet',
    role: 'ong',
    foodType: 'Ração seca cães adultos',
    quantityKg: 20,
    city: 'São Paulo',
    state: 'SP',
    locationDetails: 'Vila Mariana (Ponto de coleta SalvaPet)',
    description: 'Necessidade de ração para cães adultos recém-resgatados acolhidos na base.',
    contact: '(11) 99123-4567',
    date: '2026-11-09',
    urgency: 'Média',
    status: 'Aberto'
  },
  {
    id: 'food-2',
    type: 'available',
    title: 'Ração para gatos adultos',
    orgOrUserName: 'ONG SalvaPet',
    role: 'ong',
    foodType: 'Ração para felinos',
    quantityKg: 15,
    city: 'São Paulo',
    state: 'SP',
    locationDetails: 'Vila Mariana (Disponível para retirada)',
    description: 'Lote disponível para famílias em vulnerabilidade que possuem gatos acolhidos.',
    contact: '(11) 99123-4567',
    date: '2026-11-08',
    urgency: 'Normal',
    status: 'Aberto'
  }
];

export const INITIAL_ADOPTION_INTERESTS: AdoptionInterest[] = [
  {
    id: 'int-1',
    petId: 'pet-thor',
    petName: 'Thor',
    petImage: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=300&q=80',
    ongId: 'ong-salvapet',
    ongName: 'ONG SalvaPet',
    userName: 'Lucas',
    userEmail: 'lucas@gmail.com',
    userPhone: '(11) 98765-4321',
    housingType: 'Casa com quintal',
    message: 'Olá! Tenho muito interesse em adotar o Thor. Tenho casa murada com espaço para ele brincar.',
    date: '2026-11-09',
    status: 'Em análise'
  }
];

export const INITIAL_DONATIONS: DonationRecord[] = [
  {
    id: 'don-1',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    donorName: 'Lucas',
    donorEmail: 'lucas@gmail.com',
    amount: 50,
    date: '2026-11-08',
    method: 'PIX',
    status: 'Confirmado'
  }
];

export const INITIAL_VACCINATIONS: VaccinationRequest[] = [
  {
    id: 'vac-1',
    dogName: 'Caramelo',
    breed: 'SRD',
    size: 'Médio',
    tutorName: 'Lucas',
    tutorPhone: '(11) 98765-4321',
    tutorEmail: 'lucas@gmail.com',
    preferredDate: '2026-11-20',
    preferredShift: 'Manhã',
    vaccineType: 'Múltipla V10 (Polivalente)',
    notes: 'Cachorro resgatado recentemente da rua, dócil e bem de saúde.',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    status: 'Agendado',
    protocol: 'VAC-2026-8812',
    createdAt: '2026-11-10',
  },
  {
    id: 'vac-2',
    dogName: 'Pipoca',
    breed: 'Poodle Mix',
    size: 'Pequeno',
    tutorName: 'Camila Santos',
    tutorPhone: '(11) 97123-9988',
    tutorEmail: 'camila.santos@email.com',
    preferredDate: '2026-11-22',
    preferredShift: 'Tarde',
    vaccineType: 'Antirrábica',
    notes: 'Dose anual de reforço da vacina contra a raiva.',
    ongId: 'ong-salvapet',
    ongName: 'SalvaPet',
    status: 'Solicitado',
    protocol: 'VAC-2026-8903',
    createdAt: '2026-11-12',
  },
  {
    id: 'vac-3',
    dogName: 'Bidu',
    breed: 'SRD',
    size: 'Médio',
    tutorName: 'Roberto Alves',
    tutorPhone: '(11) 98234-5511',
    tutorEmail: 'roberto.alves@email.com',
    preferredDate: '2026-11-25',
    preferredShift: 'Manhã',
    vaccineType: 'Gripe Canina (Tosse dos Canis)',
    notes: 'Precisa de reforço antes de viagem para casa de campo.',
    ongId: 'ong-vida-animal',
    ongName: 'Instituto Vida Animal',
    status: 'Solicitado',
    protocol: 'VAC-2026-8941',
    createdAt: '2026-11-13',
  }
];

// Helper functions with localStorage persistence
const STORAGE_KEYS = {
  PETS: 'pethub_mvp_pets_v4',
  ONGS: 'pethub_mvp_ongs_v3',
  REPORTS: 'pethub_mvp_reports',
  FOOD: 'pethub_mvp_food',
  INTERESTS: 'pethub_mvp_interests',
  DONATIONS: 'pethub_mvp_donations',
  CURRENT_USER: 'pethub_mvp_current_user',
  VACCINATIONS: 'pethub_mvp_vaccinations_v1',
};

function getStored<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const DataStore = {
  getPets: (): Pet[] => {
    const pets = getStored<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS);
    return pets.map(p => {
      const init = INITIAL_PETS.find(ip => ip.id === p.id);
      if (init && (p.id === 'pet-zeus' || p.id === 'pet-belinha' || p.id === 'pet-chico' || p.id === 'pet-mel')) {
        return { ...p, image: init.image, gallery: init.gallery };
      }
      return p;
    });
  },
  savePets: (pets: Pet[]): void => setStored(STORAGE_KEYS.PETS, pets),
  addPet: (pet: Pet): void => {
    const pets = DataStore.getPets();
    setStored(STORAGE_KEYS.PETS, [pet, ...pets]);
  },
  updatePet: (updatedPet: Pet): void => {
    const pets = DataStore.getPets().map(p => p.id === updatedPet.id ? updatedPet : p);
    setStored(STORAGE_KEYS.PETS, pets);
  },
  deletePet: (petId: string): void => {
    const pets = DataStore.getPets().filter(p => p.id !== petId);
    setStored(STORAGE_KEYS.PETS, pets);
  },

  getONGs: (): ONG[] => getStored<ONG[]>(STORAGE_KEYS.ONGS, INITIAL_ONGS),
  saveONGs: (ongs: ONG[]): void => setStored(STORAGE_KEYS.ONGS, ongs),
  updateONG: (updatedONG: ONG): void => {
    const ongs = DataStore.getONGs().map(o => o.id === updatedONG.id ? updatedONG : o);
    setStored(STORAGE_KEYS.ONGS, ongs);
  },

  getReports: (): AbandonmentReport[] => getStored<AbandonmentReport[]>(STORAGE_KEYS.REPORTS, INITIAL_ABANDONMENT_REPORTS),
  addReport: (report: AbandonmentReport): void => {
    const reports = DataStore.getReports();
    setStored(STORAGE_KEYS.REPORTS, [report, ...reports]);
  },
  corroborateReport: (reportId: string): void => {
    const reports = DataStore.getReports().map(r => {
      if (r.id === reportId) {
        return {
          ...r,
          reportCount: r.reportCount + 1,
          status: 'Confirmado por múltiplos registros' as const,
          lastCorroboratedAt: new Date().toISOString()
        };
      }
      return r;
    });
    setStored(STORAGE_KEYS.REPORTS, reports);
  },

  getFoodItems: (): FoodBankItem[] => getStored<FoodBankItem[]>(STORAGE_KEYS.FOOD, INITIAL_FOOD_ITEMS),
  addFoodItem: (item: FoodBankItem): void => {
    const items = DataStore.getFoodItems();
    setStored(STORAGE_KEYS.FOOD, [item, ...items]);
  },

  getAdoptionInterests: (): AdoptionInterest[] => getStored<AdoptionInterest[]>(STORAGE_KEYS.INTERESTS, INITIAL_ADOPTION_INTERESTS),
  addAdoptionInterest: (interest: AdoptionInterest): void => {
    const interests = DataStore.getAdoptionInterests();
    setStored(STORAGE_KEYS.INTERESTS, [interest, ...interests]);
  },
  updateAdoptionInterestStatus: (id: string, status: AdoptionInterest['status']): void => {
    const interests = DataStore.getAdoptionInterests().map(i => i.id === id ? { ...i, status } : i);
    setStored(STORAGE_KEYS.INTERESTS, interests);
  },

  getDonations: (): DonationRecord[] => getStored<DonationRecord[]>(STORAGE_KEYS.DONATIONS, INITIAL_DONATIONS),
  addDonation: (donation: DonationRecord): void => {
    const donations = DataStore.getDonations();
    setStored(STORAGE_KEYS.DONATIONS, [donation, ...donations]);
  },

  getVaccinationRequests: (): VaccinationRequest[] => getStored<VaccinationRequest[]>(STORAGE_KEYS.VACCINATIONS, INITIAL_VACCINATIONS),
  addVaccinationRequest: (request: VaccinationRequest): void => {
    const list = DataStore.getVaccinationRequests();
    setStored(STORAGE_KEYS.VACCINATIONS, [request, ...list]);
  },
  updateVaccinationRequestStatus: (id: string, status: VaccinationRequest['status']): void => {
    const list = DataStore.getVaccinationRequests().map(v => v.id === id ? { ...v, status } : v);
    setStored(STORAGE_KEYS.VACCINATIONS, list);
  },

  getCurrentUser: (): User | null => getStored<User | null>(STORAGE_KEYS.CURRENT_USER, null),
  setCurrentUser: (user: User | null): void => setStored(STORAGE_KEYS.CURRENT_USER, user),

  resetAllData: (): void => {
    localStorage.removeItem(STORAGE_KEYS.PETS);
    localStorage.removeItem(STORAGE_KEYS.ONGS);
    localStorage.removeItem(STORAGE_KEYS.REPORTS);
    localStorage.removeItem(STORAGE_KEYS.FOOD);
    localStorage.removeItem(STORAGE_KEYS.INTERESTS);
    localStorage.removeItem(STORAGE_KEYS.DONATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.VACCINATIONS);
  }
};
