import type { Pet, ONG, AbandonmentReport, FoodBankItem, AdoptionInterest, DonationRecord, User } from '../types';

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
    description: 'A SalvaPet é uma organização dedicada ao resgate, acolhimento, reabilitação física e encaminhamento responsável de cães e gatos em situação de vulnerabilidade e abandono em São Paulo.',
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
    pixKey: 'exemplo@salvapet.org',
    bank: {
      bankName: 'Banco do Brasil',
      code: '001',
      agency: '1234-5',
      account: '123456-7',
      accountType: 'Conta Corrente Jurídica'
    },
    availablePetsCount: 3,
    rescuedTotal: 18,
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
    ongName: 'ONG SalvaPet',
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
    ongName: 'ONG SalvaPet',
    donorName: 'Lucas',
    donorEmail: 'lucas@gmail.com',
    amount: 50,
    date: '2026-11-08',
    method: 'PIX',
    status: 'Confirmado'
  }
];

// Helper functions with localStorage persistence
const STORAGE_KEYS = {
  PETS: 'pethub_mvp_pets',
  ONGS: 'pethub_mvp_ongs',
  REPORTS: 'pethub_mvp_reports',
  FOOD: 'pethub_mvp_food',
  INTERESTS: 'pethub_mvp_interests',
  DONATIONS: 'pethub_mvp_donations',
  CURRENT_USER: 'pethub_mvp_current_user',
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
  getPets: (): Pet[] => getStored<Pet[]>(STORAGE_KEYS.PETS, INITIAL_PETS),
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
  }
};
