import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DataStore, errorMessage } from '../data/store';
import type { Pet, ONG, AdoptionInterest, VaccinationRequest } from '../types';
import { 
  Building2, 
  PawPrint, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  DollarSign, 
  Bone, 
  CheckCircle2, 
  Save, 
  Users,
  Syringe,
  Calendar,
  Clock,
  Phone,
  Mail
} from '../components/Icons';

interface NGODashboardProps {
  initialTab?: 'animals' | 'interests' | 'vaccinations' | 'donations' | 'food' | 'settings';
  onOpenAddPetModal: () => void;
  onOpenEditPetModal: (pet: Pet) => void;
  onSelectPet: (pet: Pet) => void;
  onRefresh: () => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({
  initialTab = 'animals',
  onOpenAddPetModal,
  onOpenEditPetModal,
  onSelectPet,
  onRefresh
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'animals' | 'interests' | 'vaccinations' | 'donations' | 'food' | 'settings'>(initialTab);

  const ongs = DataStore.getONGs();
  const currentONG = ongs.find(o => o.id === (user?.ongId || 'ong-salvapet')) || ongs[0];

  const allPets = DataStore.getPets();
  const ongPets = allPets.filter(p => p.ongId === currentONG.id);

  const allInterests = DataStore.getAdoptionInterests();
  const ongInterests = allInterests.filter(i => i.ongId === currentONG.id);

  const allDonations = DataStore.getDonations();
  const ongDonations = allDonations.filter(d => d.ongId === currentONG.id);
  const totalDonationsAmount = ongDonations.reduce((sum, d) => sum + d.amount, 0);

  const allFood = DataStore.getFoodItems();
  const ongFood = allFood.filter(f => f.role === 'ong');

  const allVaccinations = DataStore.getVaccinationRequests();
  const ongVaccinations = allVaccinations.filter(v => v.ongId === currentONG.id);

  // Editable settings state
  const [acceptsFood, setAcceptsFood] = useState(currentONG.acceptsFood);
  const [providesFood, setProvidesFood] = useState(currentONG.providesFood);
  const [acceptsDonations, setAcceptsDonations] = useState(currentONG.acceptsDonations);
  const [offersVaccination, setOffersVaccination] = useState(currentONG.offersVaccination ?? true);
  const [pixKey, setPixKey] = useState(currentONG.pixKey);
  const [bankAgency, setBankAgency] = useState(currentONG.bank.agency);
  const [bankAccount, setBankAccount] = useState(currentONG.bank.account);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // grava na API e recarrega os dados; se a API recusar, mostra o motivo
  const save = async (action: () => Promise<unknown>): Promise<boolean> => {
    try {
      await action();
    } catch (err) {
      alert(errorMessage(err));
      return false;
    }
    onRefresh();
    return true;
  };

  const handleDeletePet = (petId: string, petName: string) => {
    if (window.confirm(`Tem certeza que deseja remover ${petName} do catálogo?`)) {
      save(() => DataStore.deletePet(petId));
    }
  };

  const handleUpdatePetStatus = (pet: Pet, newStatus: Pet['status']) => {
    save(() => DataStore.updatePet({ ...pet, status: newStatus }));
  };

  const handleUpdateInterestStatus = (id: string, newStatus: AdoptionInterest['status']) => {
    save(() => DataStore.updateAdoptionInterestStatus(id, newStatus));
  };

  const handleUpdateVaccinationStatus = (id: string, newStatus: VaccinationRequest['status']) => {
    save(() => DataStore.updateVaccinationRequestStatus(id, newStatus));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ONG = {
      ...currentONG,
      acceptsFood,
      providesFood,
      acceptsDonations,
      offersVaccination,
      pixKey,
      bank: {
        ...currentONG.bank,
        agency: bankAgency,
        account: bankAccount
      }
    };
    if (!(await save(() => DataStore.updateONG(updated)))) return;
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '85vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        padding: '52px 0 40px',
        borderBottom: '3px solid var(--c-brown-800)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <img
                src={currentONG.logo}
                alt={currentONG.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '20px',
                  objectFit: 'cover',
                  border: '2px solid var(--c-brown-500)',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <div>
                <span className="badge badge-earth" style={{ marginBottom: '6px' }}>
                  Painel de Gestão da ONG
                </span>
                <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>
                  Olá, SalvaPet!
                </h1>
                <p style={{ color: '#d1c4b5', fontSize: '0.95rem', marginTop: '2px' }}>
                  Administre seus animais para adoção, interessados, banco de ração e formas de recebimento.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenAddPetModal}
              className="btn btn-earth btn-lg"
              style={{ gap: '8px' }}
            >
              <Plus size={20} strokeWidth={2.5} />
              <span>+ Cadastrar animal</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Navigation Tabs Required by Prompt:
            Meus animais
            Interesses recebidos
            Doações
            Banco de ração
            Configurações
        */}
        <div className="tabs-nav" style={{ marginBottom: '32px' }}>
          <button
            className={`tab-btn ${activeTab === 'animals' ? 'active' : ''}`}
            onClick={() => setActiveTab('animals')}
          >
            Meus animais ({ongPets.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'interests' ? 'active' : ''}`}
            onClick={() => setActiveTab('interests')}
          >
            Interesses recebidos ({ongInterests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'vaccinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('vaccinations')}
          >
            💉 Vacinação ({ongVaccinations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Doações recebidas ({ongDonations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            Banco de ração
          </button>
          <button
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            Configurações
          </button>
        </div>

        {/* ===================== TAB 1: MEUS ANIMAIS ===================== */}
        {activeTab === 'animals' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                  Animais sob responsabilidade da SalvaPet
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--c-gray-600)' }}>
                  Cadastre novos pets, atualize o status ou edite informações para o público.
                </p>
              </div>

              <button onClick={onOpenAddPetModal} className="btn btn-sm btn-earth" style={{ gap: '6px' }}>
                <Plus size={16} />
                <span>+ Cadastrar animal</span>
              </button>
            </div>

            {/* Animals Table */}
            <div style={{
              backgroundColor: 'var(--c-white)',
              borderRadius: 'var(--r-xl)',
              border: '1.5px solid var(--c-sand-200)',
              overflowX: 'auto',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--c-sand-50)', borderBottom: '1px solid var(--c-sand-200)', fontSize: '0.85rem', color: 'var(--c-gray-600)' }}>
                    <th style={{ padding: '16px 20px', fontWeight: 700 }}>Animal</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700 }}>Espécie / Raça</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700 }}>Status</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700 }}>Interessados</th>
                    <th style={{ padding: '16px 20px', fontWeight: 700, textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody style={{ fontSize: '0.92rem' }}>
                  {ongPets.map((pet) => {
                    const interested = allInterests.filter(i => i.petId === pet.id).length;

                    return (
                      <tr key={pet.id} style={{ borderBottom: '1px solid var(--c-sand-100)' }}>
                        <td style={{ padding: '16px 20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <img
                              src={pet.image}
                              alt={pet.name}
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
                              }}
                              style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                            />
                            <div>
                              <strong style={{ color: 'var(--c-black-900)', fontSize: '1rem' }}>{pet.name}</strong>
                              <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>{pet.age} • {pet.sex}</div>
                            </div>
                          </div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <div>{pet.species}</div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>{pet.breed}</div>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <select
                            value={pet.status}
                            onChange={(e) => handleUpdatePetStatus(pet, e.target.value as any)}
                            style={{
                              padding: '6px 12px',
                              borderRadius: 'var(--r-sm)',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              border: '1px solid var(--c-sand-300)',
                              backgroundColor: pet.status === 'Disponível' ? '#dcfce7' : pet.status === 'Em processo de adoção' ? '#fef3c7' : '#f5f5f4',
                              color: pet.status === 'Disponível' ? '#14532d' : pet.status === 'Em processo de adoção' ? '#78350f' : '#57534e',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="Disponível">Disponível</option>
                            <option value="Em processo de adoção">Em processo de adoção</option>
                            <option value="Adotado">Adotado</option>
                          </select>
                        </td>

                        <td style={{ padding: '16px 20px' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '4px 10px',
                            borderRadius: 'var(--r-full)',
                            backgroundColor: 'var(--c-sand-100)',
                            fontWeight: 700,
                            color: 'var(--c-brown-900)'
                          }}>
                            {interested} {interested === 1 ? 'interessado' : 'interessados'}
                          </span>
                        </td>

                        <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '8px' }}>
                            <button
                              onClick={() => onSelectPet(pet)}
                              className="btn btn-sm btn-ghost btn-icon"
                              title="Ver ficha pública"
                              style={{ border: '1px solid var(--c-sand-200)' }}
                            >
                              <Eye size={16} />
                            </button>

                            <button
                              onClick={() => onOpenEditPetModal(pet)}
                              className="btn btn-sm btn-outline btn-icon"
                              title="Editar animal"
                            >
                              <Edit size={16} />
                            </button>

                            <button
                              onClick={() => handleDeletePet(pet.id, pet.name)}
                              className="btn btn-sm btn-ghost btn-icon"
                              title="Remover animal"
                              style={{ color: '#ef4444' }}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ===================== TAB 2: INTERESSES RECEBIDOS ===================== */}
        {activeTab === 'interests' && (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Interesses de Adoção Recebidos
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)', marginBottom: '24px' }}>
              Pessoas que demonstraram interesse em acolher um dos animais cadastrados pela SalvaPet.
            </p>

            {ongInterests.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <p style={{ color: 'var(--c-gray-600)' }}>Nenhum interessado no momento.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ongInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <img
                        src={interest.petImage}
                        alt={interest.petName}
                        style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                            Interesse em: {interest.petName}
                          </h4>
                          <span className={`badge ${
                            interest.status === 'Aprovado' ? 'badge-confirmed' :
                            interest.status === 'Em contato' ? 'badge-active' : 'badge-earth'
                          }`}>
                            {interest.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.88rem', color: 'var(--c-black-800)', marginTop: '4px' }}>
                          Candidato: <strong>{interest.userName}</strong> • {interest.userPhone} • {interest.userEmail}
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)', marginTop: '2px' }}>
                          Moradia: <strong>{interest.housingType}</strong> • Data: {interest.date}
                        </div>
                        <div style={{
                          backgroundColor: 'var(--c-sand-50)',
                          padding: '10px 14px',
                          borderRadius: 'var(--r-sm)',
                          fontSize: '0.86rem',
                          color: 'var(--c-black-800)',
                          marginTop: '10px',
                          border: '1px solid var(--c-sand-200)'
                        }}>
                          "{interest.message}"
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <button
                        onClick={() => handleUpdateInterestStatus(interest.id, 'Em contato')}
                        className="btn btn-sm btn-outline"
                      >
                        Marcar: Em Contato
                      </button>
                      <button
                        onClick={() => handleUpdateInterestStatus(interest.id, 'Aprovado')}
                        className="btn btn-sm btn-earth"
                      >
                        Aprovar Adoção
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB: VACINAÇÕES ===================== */}
        {activeTab === 'vaccinations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '4px' }}>
                  Agendamentos de Vacinação Canina
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)' }}>
                  Solicitações de tutores para vacinação realizada na sede da {currentONG.name}.
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className={`badge ${offersVaccination ? 'badge-confirmed' : 'badge-alert'}`} style={{ fontSize: '0.82rem' }}>
                  {offersVaccination ? '✓ Serviço Ativo no Perfil' : '✕ Serviço Desativado no Perfil'}
                </span>
              </div>
            </div>

            {!offersVaccination && (
              <div style={{
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--r-md)',
                padding: '14px 18px',
                color: '#991b1b',
                fontSize: '0.88rem',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <Syringe size={20} color="#dc2626" />
                <span>
                  O serviço de vacinação está marcado como <strong>desativado</strong> nas suas configurações. Tutores não conseguirão agendar novas vacinas até que você reative a opção em <strong>Configurações</strong>.
                </span>
              </div>
            )}

            {ongVaccinations.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--c-sand-100)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--c-brown-800)',
                  marginBottom: '16px'
                }}>
                  <Syringe size={28} />
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '6px' }}>
                  Nenhum agendamento de vacina registrado
                </h4>
                <p style={{ color: 'var(--c-gray-600)', fontSize: '0.88rem' }}>
                  Quando tutores agendarem vacinas para seus cães através do perfil da sua ONG, eles aparecerão aqui.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {ongVaccinations.map((vac) => (
                  <div
                    key={vac.id}
                    style={{
                      backgroundColor: 'var(--c-white)',
                      borderRadius: 'var(--r-lg)',
                      padding: '24px',
                      border: '1.5px solid var(--c-sand-200)',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '18px', alignItems: 'flex-start', flex: 1, minWidth: '280px' }}>
                      <div style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        backgroundColor: 'var(--c-brown-100)',
                        color: 'var(--c-brown-900)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Syringe size={22} />
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-brown-800)', backgroundColor: 'var(--c-sand-100)', padding: '2px 8px', borderRadius: '4px' }}>
                            {vac.protocol}
                          </span>
                          <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--c-black-900)', margin: 0 }}>
                            {vac.dogName} ({vac.breed} • Porte {vac.size})
                          </h4>
                          <span className={`badge ${
                            vac.status === 'Concluído' ? 'badge-confirmed' :
                            vac.status === 'Agendado' ? 'badge-active' :
                            vac.status === 'Cancelado' ? 'badge-alert' : 'badge-earth'
                          }`}>
                            {vac.status}
                          </span>
                        </div>

                        <div style={{ fontSize: '0.88rem', color: 'var(--c-black-800)', marginTop: '6px' }}>
                          Vacina: <strong style={{ color: 'var(--c-brown-900)' }}>{vac.vaccineType}</strong> • Data sugerida: <strong>{vac.preferredDate} ({vac.preferredShift})</strong>
                        </div>

                        <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-700)', marginTop: '4px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                          <span>Tutor: <strong>{vac.tutorName}</strong></span>
                          <span>WhatsApp: <strong>{vac.tutorPhone}</strong></span>
                          <span>E-mail: <strong>{vac.tutorEmail}</strong></span>
                        </div>

                        {vac.notes && (
                          <div style={{
                            backgroundColor: 'var(--c-sand-50)',
                            padding: '8px 12px',
                            borderRadius: 'var(--r-sm)',
                            fontSize: '0.84rem',
                            color: 'var(--c-gray-700)',
                            marginTop: '8px',
                            border: '1px solid var(--c-sand-200)'
                          }}>
                            Observações: "{vac.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '180px' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--c-gray-600)' }}>Alterar Status:</span>
                      <select
                        className="form-select"
                        value={vac.status}
                        onChange={(e) => handleUpdateVaccinationStatus(vac.id, e.target.value as any)}
                        style={{ fontSize: '0.82rem', padding: '6px 10px', fontWeight: 700 }}
                      >
                        <option value="Solicitado">Solicitado</option>
                        <option value="Agendado">Agendado</option>
                        <option value="Concluído">Concluído</option>
                        <option value="Cancelado">Cancelado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===================== TAB 3: DOAÇÕES ===================== */}
        {activeTab === 'donations' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                  Doações Financeiras Recebidas
                </h3>
                <p style={{ fontSize: '0.86rem', color: 'var(--c-gray-600)' }}>
                  A SalvaPet recebe doações diretamente via chave PIX e conta bancária cadastrada.
                </p>
              </div>

              <div style={{
                backgroundColor: '#dcfce7',
                padding: '10px 18px',
                borderRadius: 'var(--r-md)',
                color: '#15803d',
                fontWeight: 800,
                fontSize: '1.2rem'
              }}>
                Total: R$ {totalDonationsAmount.toFixed(2).replace('.', ',')}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {ongDonations.map((don) => (
                <div
                  key={don.id}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                      Doador: {don.donorName}
                    </h4>
                    <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                      E-mail: {don.donorEmail} • Data: {don.date} • {don.method}
                    </div>
                  </div>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
                    + R$ {don.amount.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 4: BANCO DE RAÇÃO ===================== */}
        {activeTab === 'food' && (
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Participação no Banco de Ração
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)', marginBottom: '24px' }}>
              Lotes de ração solicitados ou disponibilizados pela ONG SalvaPet.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {ongFood.map((item) => (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    padding: '20px 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                        {item.title}
                      </h4>
                      <span className={`badge ${item.type === 'need' ? 'badge-active' : 'badge-confirmed'}`}>
                        {item.type === 'need' ? 'Necessidade' : 'Disponível para retirada'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.86rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                      Quantidade: <strong>{item.quantityKg} kg</strong> • {item.foodType} • {item.locationDetails}
                    </div>
                  </div>

                  <span style={{ fontSize: '0.84rem', color: 'var(--c-gray-500)' }}>
                    Ativo no banco
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ===================== TAB 5: CONFIGURAÇÕES ===================== */}
        {activeTab === 'settings' && (
          <div style={{
            backgroundColor: 'var(--c-white)',
            borderRadius: 'var(--r-xl)',
            padding: '36px',
            border: '1.5px solid var(--c-sand-200)',
            maxWidth: '720px'
          }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Configurações da SalvaPet
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--c-gray-600)', marginBottom: '24px' }}>
              Defina se a organização recebe ou disponibiliza ração, e informe seus dados para receber doações financeiras.
            </p>

            {settingsSaved && (
              <div style={{
                backgroundColor: '#dcfce7',
                border: '1px solid #bbf7d0',
                color: '#14532d',
                padding: '12px 18px',
                borderRadius: 'var(--r-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 600
              }}>
                <CheckCircle2 size={18} />
                <span>Configurações atualizadas com sucesso!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings}>
              {/* Toggles Requeridos pelo Prompt:
                  Recebe ração: SIM / NÃO
                  Disponibiliza ração: SIM / NÃO
              */}
              <div style={{
                backgroundColor: 'var(--c-sand-50)',
                padding: '20px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--c-sand-200)',
                marginBottom: '24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ color: 'var(--c-black-900)' }}>Recebe ração: {acceptsFood ? 'SIM' : 'NÃO'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Permite doadores encaminharem ração para a ONG</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={acceptsFood}
                    onChange={(e) => setAcceptsFood(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ color: 'var(--c-black-900)' }}>Disponibiliza ração: {providesFood ? 'SIM' : 'NÃO'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Disponibiliza lotes para famílias em vulnerabilidade</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={providesFood}
                    onChange={(e) => setProvidesFood(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ color: 'var(--c-black-900)' }}>Recebe doações financeiras: {acceptsDonations ? 'SIM' : 'NÃO'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Exibe chave PIX e conta para a comunidade apoiar</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={acceptsDonations}
                    onChange={(e) => setAcceptsDonations(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>

                <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                  <div>
                    <strong style={{ color: 'var(--c-black-900)' }}>Oferece vacinação de cães: {offersVaccination ? 'SIM' : 'NÃO'}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Disponibiliza vacinação para cachorros na própria sede da ONG</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={offersVaccination}
                    onChange={(e) => setOffersVaccination(e.target.checked)}
                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                  />
                </label>
              </div>

              {/* Meios de recebimento de doações financeiras */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '14px', color: 'var(--c-black-900)' }}>
                Meios de Recebimento de Doações
              </h4>

              <div className="form-group">
                <label className="form-label">Chave PIX Oficial *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="exemplo@salvapet.org"
                  value={pixKey}
                  onChange={(e) => setPixKey(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Agência Bancária</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bankAgency}
                    onChange={(e) => setBankAgency(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Conta Corrente</label>
                  <input
                    type="text"
                    className="form-input"
                    value={bankAccount}
                    onChange={(e) => setBankAccount(e.target.value)}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-earth" style={{ gap: '8px' }}>
                <Save size={18} />
                <span>Salvar Configurações</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
