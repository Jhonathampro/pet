import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DataStore } from '../data/mockData';
import { 
  Heart, 
  AlertTriangle, 
  DollarSign, 
  Bone, 
  MapPin, 
  PawPrint,
  Syringe,
  Calendar,
  Clock
} from '../components/Icons';

interface UserDashboardProps {
  onNavigate: (tab: string, meta?: any) => void;
  onOpenReportModal: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  onNavigate,
  onOpenReportModal
}) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'interests' | 'reports' | 'donations' | 'food' | 'vaccinations'>('interests');

  const allInterests = DataStore.getAdoptionInterests();
  const allReports = DataStore.getReports();
  const allDonations = DataStore.getDonations();
  const allFood = DataStore.getFoodItems();
  const allVaccinations = DataStore.getVaccinationRequests();

  // User-specific items for Lucas
  const myInterests = allInterests.filter(i => 
    !user || i.userEmail === user.email || i.userName.includes('Lucas')
  );

  const myReports = allReports.filter(r => 
    !user || r.reportedBy.includes('Lucas') || r.reportedBy === user.name
  );

  const myDonations = allDonations.filter(d => 
    !user || d.donorEmail === user.email || d.donorName.includes('Lucas')
  );

  const myFoodItems = allFood.filter(f => 
    !user || f.orgOrUserName.includes('Lucas') || f.role === 'user'
  );

  const myVaccinations = allVaccinations.filter(v =>
    !user || v.tutorEmail === user.email || v.tutorName.includes('Lucas')
  );

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
            gap: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: '3px solid var(--c-brown-500)',
                boxShadow: 'var(--shadow-md)',
                backgroundColor: 'var(--c-brown-800)'
              }}>
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80'}
                  alt={user?.name || 'Lucas'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <div>
                <span className="badge badge-earth" style={{ marginBottom: '6px' }}>
                  Área do Usuário
                </span>
                <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.5rem)', fontWeight: 800, color: '#fff' }}>
                  Olá, {user?.name || 'Lucas'}! 🐾
                </h1>
                <p style={{ color: '#d1c4b5', fontSize: '0.95rem', marginTop: '2px' }}>
                  Acompanhe seus interesses em adoção, denúncias cadastradas e doações.
                </p>
              </div>
            </div>

            <button
              onClick={onOpenReportModal}
              className="btn btn-earth"
              style={{ gap: '8px' }}
            >
              <AlertTriangle size={18} />
              <span>Registrar Denúncia de Abandono</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* ===================== SUMMARY STATS CARDS REAL DATA ===================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '20px',
          marginBottom: '36px'
        }}>
          {/* Card 1: Meus interesses em adoção */}
          <div
            onClick={() => setActiveTab('interests')}
            className="card"
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: activeTab === 'interests' ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
              backgroundColor: activeTab === 'interests' ? 'var(--c-sand-50)' : 'var(--c-white)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-gray-600)' }}>
                Meus interesses em adoção
              </span>
              <Heart size={20} color="var(--c-brown-700)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--c-black-900)', lineHeight: 1 }}>
              {myInterests.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              Solicitações enviadas para a ONG
            </div>
          </div>

          {/* Card 2: Minhas denúncias */}
          <div
            onClick={() => setActiveTab('reports')}
            className="card"
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: activeTab === 'reports' ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
              backgroundColor: activeTab === 'reports' ? 'var(--c-sand-50)' : 'var(--c-white)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-gray-600)' }}>
                Minhas denúncias
              </span>
              <AlertTriangle size={20} color="#b91c1c" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--c-black-900)', lineHeight: 1 }}>
              {myReports.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              Registros no mapa comunitário
            </div>
          </div>

          {/* Card 3: Minhas doações */}
          <div
            onClick={() => setActiveTab('donations')}
            className="card"
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: activeTab === 'donations' ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
              backgroundColor: activeTab === 'donations' ? 'var(--c-sand-50)' : 'var(--c-white)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-gray-600)' }}>
                Minhas doações
              </span>
              <DollarSign size={20} color="#15803d" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
              {myDonations.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              Doações realizadas
            </div>
          </div>

          {/* Card 4: Minhas solicitações de ração */}
          <div
            onClick={() => setActiveTab('food')}
            className="card"
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: activeTab === 'food' ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
              backgroundColor: activeTab === 'food' ? 'var(--c-sand-50)' : 'var(--c-white)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-gray-600)' }}>
                Minhas solicitações de ração
              </span>
              <Bone size={20} color="var(--c-brown-600)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--c-black-900)', lineHeight: 1 }}>
              {myFoodItems.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              No banco de ração
            </div>
          </div>

          {/* Card 5: Minhas vacinações */}
          <div
            onClick={() => setActiveTab('vaccinations')}
            className="card"
            style={{
              padding: '24px',
              cursor: 'pointer',
              border: activeTab === 'vaccinations' ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
              backgroundColor: activeTab === 'vaccinations' ? 'var(--c-sand-50)' : 'var(--c-white)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-gray-600)' }}>
                Vacinações agendadas
              </span>
              <Syringe size={20} color="var(--c-brown-700)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--c-black-900)', lineHeight: 1 }}>
              {myVaccinations.length}
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              Em ONGs parceiras
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tabs-nav">
          <button
            className={`tab-btn ${activeTab === 'interests' ? 'active' : ''}`}
            onClick={() => setActiveTab('interests')}
          >
            Meus interesses em adoção ({myInterests.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'vaccinations' ? 'active' : ''}`}
            onClick={() => setActiveTab('vaccinations')}
          >
            💉 Vacinações ({myVaccinations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            onClick={() => setActiveTab('reports')}
          >
            Minhas denúncias ({myReports.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'donations' ? 'active' : ''}`}
            onClick={() => setActiveTab('donations')}
          >
            Minhas doações ({myDonations.length})
          </button>
          <button
            className={`tab-btn ${activeTab === 'food' ? 'active' : ''}`}
            onClick={() => setActiveTab('food')}
          >
            Minhas solicitações de ração ({myFoodItems.length})
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'interests' && (
          <div>
            {myInterests.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <PawPrint size={36} color="var(--c-gray-500)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                  Você ainda não demonstrou interesse em adotar nenhum animal.
                </h4>
                <p style={{ color: 'var(--c-gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Veja os animais disponíveis sob os cuidados da ONG SalvaPet.
                </p>
                <button onClick={() => onNavigate('adotar')} className="btn btn-earth">
                  Adotar um pet
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myInterests.map((interest) => (
                  <div
                    key={interest.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <img
                        src={interest.petImage}
                        alt={interest.petName}
                        style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                            {interest.petName}
                          </h4>
                          <span className="badge badge-active">
                            {interest.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                          ONG Responsável: <strong>{interest.ongName}</strong> • Solicitado em {interest.date}
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--c-black-800)', marginTop: '6px', fontStyle: 'italic' }}>
                          "{interest.message}"
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('adotar')}
                      className="btn btn-sm btn-outline"
                    >
                      Ver Detalhes do Pet
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab: Vacinações do Usuário */}
        {activeTab === 'vaccinations' && (
          <div>
            {myVaccinations.length === 0 ? (
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
                <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                  Nenhum agendamento de vacina solicitado
                </h4>
                <p style={{ color: 'var(--c-gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Encontre uma ONG que oferece serviço de vacinação comunitária e agende para o seu cãozinho.
                </p>
                <button onClick={() => onNavigate('ongs')} className="btn btn-earth">
                  Buscar ONGs com Vacinação
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myVaccinations.map((vac) => (
                  <div
                    key={vac.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <div style={{
                        width: '56px',
                        height: '56px',
                        borderRadius: '14px',
                        backgroundColor: 'var(--c-brown-100)',
                        color: 'var(--c-brown-900)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Syringe size={26} />
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-brown-800)', backgroundColor: 'var(--c-sand-100)', padding: '2px 8px', borderRadius: '4px' }}>
                            {vac.protocol}
                          </span>
                          <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)', margin: 0 }}>
                            {vac.dogName} ({vac.breed} • {vac.size})
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
                          Vacina: <strong style={{ color: 'var(--c-brown-900)' }}>{vac.vaccineType}</strong> • ONG: <strong>{vac.ongName}</strong>
                        </div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                          Data sugerida: <strong>{vac.preferredDate} ({vac.preferredShift})</strong> • Solicitado por {vac.tutorName}
                        </div>
                        {vac.notes && (
                          <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-700)', marginTop: '4px', fontStyle: 'italic' }}>
                            "{vac.notes}"
                          </div>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('ongs')}
                      className="btn btn-sm btn-outline"
                    >
                      Ver ONG
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reports' && (
          <div>
            {myReports.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <AlertTriangle size={36} color="var(--c-gray-500)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                  Nenhuma denúncia registrada por você.
                </h4>
                <p style={{ color: 'var(--c-gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Avistou algum animal abandonado? Ajude a mapear a situação.
                </p>
                <button onClick={onOpenReportModal} className="btn btn-earth">
                  Denunciar abandono
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myReports.map((report) => (
                  <div
                    key={report.id}
                    className="card"
                    style={{
                      padding: '24px',
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                      <img
                        src={report.photoUrl}
                        alt="Foto da denúncia"
                        style={{ width: '70px', height: '70px', borderRadius: '14px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                            📍 {report.neighborhood} - {report.city}
                          </h4>
                          <span className={`badge ${
                            report.status === 'Confirmado por múltiplos registros' ? 'badge-confirmed' : 'badge-active'
                          }`}>
                            {report.status}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                          Registrado em: {report.date} • {report.reportCount} registros nesta região
                        </div>
                        <div style={{ fontSize: '0.84rem', color: 'var(--c-black-800)', marginTop: '6px' }}>
                          "{report.description}"
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('mapa')}
                      className="btn btn-sm btn-outline"
                      style={{ gap: '6px' }}
                    >
                      <MapPin size={14} />
                      <span>Ver no Mapa</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'donations' && (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myDonations.map((don) => (
                <div
                  key={don.id}
                  className="card"
                  style={{
                    padding: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                      Doação para {don.ongName}
                    </h4>
                    <div style={{ fontSize: '0.85rem', color: 'var(--c-gray-600)' }}>
                      Data: {don.date} • Método: {don.method} • Status: <strong style={{ color: '#15803d' }}>{don.status}</strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#15803d' }}>
                    R$ {don.amount.toFixed(2).replace('.', ',')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'food' && (
          <div>
            {myFoodItems.length === 0 ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <Bone size={36} color="var(--c-gray-500)" style={{ margin: '0 auto 12px' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                  Nenhuma solicitação de ração ativa.
                </h4>
                <p style={{ color: 'var(--c-gray-600)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Você pode doar ou solicitar ração no Banco de Ração Solidário.
                </p>
                <button onClick={() => onNavigate('banco-racao')} className="btn btn-earth">
                  Acessar Banco de Ração
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {myFoodItems.map((item) => (
                  <div
                    key={item.id}
                    className="card"
                    style={{
                      padding: '24px',
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
                        <span className="badge badge-active">
                          {item.quantityKg} kg
                        </span>
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                        {item.foodType} • {item.city} - {item.state} • Cadastrado em {item.date}
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigate('banco-racao')}
                      className="btn btn-sm btn-outline"
                    >
                      Ver no Banco
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
