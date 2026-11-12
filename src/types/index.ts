export type UserRole = 'guest' | 'user' | 'ong';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
  state?: string;
  avatar?: string;
  ongId?: string; // Associated ONG if role is 'ong'
}

export type PetSpecies = 'Cachorro' | 'Gato';
export type PetSex = 'Macho' | 'Fêmea';
export type PetAgeCategory = 'Filhote' | 'Jovem' | 'Adulto' | 'Sênior';
export type PetSize = 'Pequeno' | 'Médio' | 'Grande';
export type PetStatus = 'Disponível' | 'Em processo de adoção' | 'Adotado';

export interface Pet {
  id: string;
  name: string;
  species: PetSpecies;
  breed: string;
  age: string;
  ageCategory: PetAgeCategory;
  sex: PetSex;
  size: PetSize;
  city: string;
  state: string;
  ongId: string;
  ongName: string;
  description: string;
  personality: string[];
  image: string;
  gallery: string[];
  status: PetStatus;
  vaccinated: boolean;
  neutered: boolean;
  dewormed: boolean;
  specialNeeds?: string;
  interestedCount: number;
  createdAt: string;
}

export interface ONG {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  neighborhood: string;
  description: string;
  logo: string;
  coverImage: string;
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  website?: string;
  acceptsFood: boolean;
  providesFood: boolean;
  acceptsDonations: boolean;
  pixKey: string;
  bank: {
    bankName: string;
    code: string;
    agency: string;
    account: string;
    accountType: string;
  };
  availablePetsCount: number;
  rescuedTotal: number;
  verified: boolean;
}

export type AbandonmentStatus = 'Ativo' | 'Confirmado por múltiplos registros' | 'Expirado';

export interface AbandonmentReport {
  id: string;
  photoUrl: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  date: string;
  description: string;
  species: 'Cachorro' | 'Gato' | 'Outro';
  healthCondition: 'Sadio' | 'Debilitado / Desnutrido' | 'Ferido';
  status: AbandonmentStatus;
  reportCount: number; // Number of corroborating community reports in same area
  lat: number;
  lng: number;
  reportedBy: string;
  reportedByRole: UserRole;
  createdAt: string;
  lastCorroboratedAt?: string;
}

export type FoodBankItemType = 'need' | 'available';

export interface FoodBankItem {
  id: string;
  type: FoodBankItemType;
  title: string;
  orgOrUserName: string;
  role: 'ong' | 'user';
  foodType: string; // e.g. "Ração para cães adultos", "Ração especial renal para gatos"
  quantityKg: number;
  city: string;
  state: string;
  locationDetails: string;
  description: string;
  contact: string;
  date: string;
  urgency?: 'Alta' | 'Média' | 'Normal';
  status: 'Aberto' | 'Concluído';
}

export interface AdoptionInterest {
  id: string;
  petId: string;
  petName: string;
  petImage: string;
  ongId: string;
  ongName: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  housingType: 'Casa com quintal' | 'Apartamento' | 'Chácara / Sítio' | 'Outro';
  message: string;
  date: string;
  status: 'Em análise' | 'Em contato' | 'Aprovado' | 'Finalizado';
}

export interface DonationRecord {
  id: string;
  ongId: string;
  ongName: string;
  donorName: string;
  donorEmail: string;
  amount: number;
  date: string;
  method: 'PIX' | 'Transferência Bancária';
  status: 'Confirmado' | 'Pendente';
}

