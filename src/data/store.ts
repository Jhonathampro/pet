// Acesso aos dados via API. Substitui o antigo DataStore de localStorage (mockData.ts).
//
// As leituras (getPets, getONGs...) são síncronas e devolvem o que foi carregado por último
// em `load()`; o App chama `load()` ao trocar de aba, ao logar e depois de cada gravação.
// As gravações são assíncronas: use `await` e trate o erro (a mensagem vem da API).
import type {
  Pet, ONG, AbandonmentReport, FoodBankItem, AdoptionInterest, DonationRecord, VaccinationRequest,
} from '../types';
import { api, getToken } from './api';

const cache = {
  pets: [] as Pet[],
  ongs: [] as ONG[],
  reports: [] as AbandonmentReport[],
  food: [] as FoodBankItem[],
  // listas "minhas": do usuário logado (o que enviou) ou da ONG logada (o que recebeu)
  interests: [] as AdoptionInterest[],
  donations: [] as DonationRecord[],
  vaccinations: [] as VaccinationRequest[],
};

interface FoodResponseInput {
  name: string;
  phone: string;
  quantityKg: number;
  foodType?: string;
  notes?: string;
}

export const DataStore = {
  /** Busca tudo de novo na API. Visitante recebe só os dados públicos. */
  load: async (): Promise<void> => {
    const logged = !!getToken();
    const mine = <T>(path: string) => (logged ? api<T[]>('GET', path) : Promise.resolve([] as T[]));
    const [pets, ongs, reports, food, interests, donations, vaccinations] = await Promise.all([
      api<Pet[]>('GET', '/pets'),
      api<ONG[]>('GET', '/ongs'),
      api<AbandonmentReport[]>('GET', '/reports'),
      api<FoodBankItem[]>('GET', '/food-items'),
      mine<AdoptionInterest>('/me/adoption-interests'),
      mine<DonationRecord>('/me/donations'),
      mine<VaccinationRequest>('/me/vaccinations'),
    ]);
    Object.assign(cache, { pets, ongs, reports, food, interests, donations, vaccinations });
  },

  getPets: (): Pet[] => cache.pets,
  addPet: (pet: Pet) => api<Pet>('POST', '/pets', pet),
  updatePet: (pet: Pet) => api<Pet>('PATCH', `/pets/${pet.id}`, pet),
  deletePet: (petId: string) => api<void>('DELETE', `/pets/${petId}`),

  getONGs: (): ONG[] => cache.ongs,
  updateONG: (ong: ONG) => api<ONG>('PATCH', `/ongs/${ong.id}`, ong),

  getReports: (): AbandonmentReport[] => cache.reports,
  addReport: (report: AbandonmentReport) => api<AbandonmentReport>('POST', '/reports', report),
  corroborateReport: (reportId: string) =>
    api<AbandonmentReport>('POST', `/reports/${reportId}/corroborate`),

  getFoodItems: (): FoodBankItem[] => cache.food,
  addFoodItem: (item: FoodBankItem) =>
    api<FoodBankItem>('POST', '/food-items', { ...item, name: item.orgOrUserName }),
  /** Responde a um item existente (doar para um pedido / solicitar um lote disponível). */
  respondToFoodItem: (itemId: string, response: FoodResponseInput) =>
    api<unknown>('POST', `/food-items/${itemId}/responses`, response),

  getAdoptionInterests: (): AdoptionInterest[] => cache.interests,
  addAdoptionInterest: (interest: AdoptionInterest) =>
    api<AdoptionInterest>('POST', '/adoption-interests', interest),
  updateAdoptionInterestStatus: (id: string, status: AdoptionInterest['status']) =>
    api<AdoptionInterest>('PATCH', `/adoption-interests/${id}/status`, { status }),

  getDonations: (): DonationRecord[] => cache.donations,
  addDonation: (donation: DonationRecord) => api<DonationRecord>('POST', '/donations', donation),

  getVaccinationRequests: (): VaccinationRequest[] => cache.vaccinations,
  /** Devolve o pedido criado, com o protocolo gerado pelo servidor. */
  addVaccinationRequest: (request: VaccinationRequest) =>
    api<VaccinationRequest>('POST', '/vaccinations', request),
  updateVaccinationRequestStatus: (id: string, status: VaccinationRequest['status']) =>
    api<VaccinationRequest>('PATCH', `/vaccinations/${id}/status`, { status }),
};

/** Mensagem de erro para mostrar ao usuário. */
export const errorMessage = (err: unknown): string =>
  err instanceof Error ? err.message : 'Ocorreu um erro inesperado.';
