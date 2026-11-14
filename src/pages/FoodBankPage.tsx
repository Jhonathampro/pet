import React, { useState, useMemo } from 'react';
import { FoodBankItem } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Bone, 
  Heart, 
  MapPin, 
  Building2, 
  User, 
  Plus, 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  Check, 
  SlidersHorizontal 
} from '../components/Icons';

interface FoodBankPageProps {
  items: FoodBankItem[];
  onOpenDonateModal: (targetItem?: FoodBankItem) => void;
  onOpenRequestModal: (targetItem?: FoodBankItem) => void;
}

export const FoodBankPage: React.FC<FoodBankPageProps> = ({
  items,
  onOpenDonateModal,
  onOpenRequestModal
}) => {
  const { isONG } = useAuth();
  const [activeTab, setActiveTab] = useState<'all' | 'need' | 'available'>('all');
  const [searchCity, setSearchCity] = useState('');
  const [filterType, setFilterType] = useState('Todos');

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (activeTab === 'need' && item.type !== 'need') return false;
      if (activeTab === 'available' && item.type !== 'available') return false;

      if (searchCity.trim()) {
        const q = searchCity.toLowerCase();
        const matches = item.city.toLowerCase().includes(q) || item.orgOrUserName.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (filterType !== 'Todos') {
        if (filterType === 'Cães' && !item.foodType.toLowerCase().includes('cã') && !item.foodType.toLowerCase().includes('cachorro')) {
          return false;
        }
        if (filterType === 'Gatos' && !item.foodType.toLowerCase().includes('gat') && !item.foodType.toLowerCase().includes('felin')) {
          return false;
        }
      }

      return true;
    });
  }, [items, activeTab, searchCity, filterType]);

  const needsList = filteredItems.filter(i => i.type === 'need');
  const availableList = filteredItems.filter(i => i.type === 'available');

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '85vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        padding: '56px 0',
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
            <div>
              <span className="badge badge-earth" style={{ marginBottom: '12px' }}>
                Solidariedade Alimentar
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
                Banco de Ração Solidário
              </h1>
              <p style={{ color: '#d1c4b5', fontSize: '1.1rem', maxWidth: '640px', marginTop: '8px' }}>
                Conectando <strong>quem quer doar ração</strong> com <strong>quem precisa de ração</strong> para nutrir animais resgatados e apoiar tutores em dificuldade.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {isONG ? (
                <div style={{
                  backgroundColor: 'rgba(255,255,255,0.08)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 20px',
                  color: '#d1c4b5',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Building2 size={18} color="#f59e0b" />
                  <span>Gerencie a situação de ração da sua ONG no <strong>Painel da ONG</strong>.</span>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => onOpenDonateModal()}
                    className="btn btn-earth"
                    style={{ gap: '8px' }}
                  >
                    <Plus size={18} />
                    <span>Tenho Ração para Doar</span>
                  </button>

                  <button
                    onClick={() => onOpenRequestModal()}
                    className="btn btn-outline-white"
                    style={{ gap: '8px' }}
                  >
                    <Bone size={18} />
                    <span>Solicitar Ração</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Concept Banner Required by Prompt */}
        <div style={{
          backgroundColor: 'var(--c-white)',
          border: '1.5px solid var(--c-sand-200)',
          borderRadius: 'var(--r-xl)',
          padding: '24px 32px',
          marginBottom: '36px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '14px',
              backgroundColor: 'var(--c-brown-100)',
              color: 'var(--c-brown-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Bone size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--c-black-900)' }}>
                Como Funciona o Banco de Ração
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)' }}>
                ONGs e cidadãos podem cadastrar lotes disponíveis para doação ou solicitar sacos de ração para cães e gatos sob cuidados emergenciais.
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backgroundColor: 'var(--c-sand-50)',
            padding: '10px 18px',
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--c-sand-200)',
            fontSize: '0.86rem',
            color: 'var(--c-black-800)',
            fontWeight: 700
          }}>
            <span>Quem Quer Doar</span>
            <span style={{ color: 'var(--c-brown-600)', fontSize: '1.2rem' }}>↔</span>
            <span>Quem Precisa de Apoio</span>
          </div>
        </div>

        {/* Tab & Filter Navigation Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {/* Main Filter Tabs */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setActiveTab('all')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-md)',
                border: activeTab === 'all' ? '2px solid var(--c-black-900)' : '1px solid var(--c-sand-300)',
                backgroundColor: activeTab === 'all' ? 'var(--c-black-900)' : 'var(--c-white)',
                color: activeTab === 'all' ? '#fff' : 'var(--c-black-800)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Todos ({items.length})
            </button>

            <button
              onClick={() => setActiveTab('need')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-md)',
                border: activeTab === 'need' ? '2px solid #b45309' : '1px solid var(--c-sand-300)',
                backgroundColor: activeTab === 'need' ? '#fef3c7' : 'var(--c-white)',
                color: activeTab === 'need' ? '#78350f' : 'var(--c-black-800)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Quem Precisa de Ração ({items.filter(i => i.type === 'need').length})
            </button>

            <button
              onClick={() => setActiveTab('available')}
              style={{
                padding: '10px 20px',
                borderRadius: 'var(--r-md)',
                border: activeTab === 'available' ? '2px solid #15803d' : '1px solid var(--c-sand-300)',
                backgroundColor: activeTab === 'available' ? '#dcfce7' : 'var(--c-white)',
                color: activeTab === 'available' ? '#14532d' : 'var(--c-black-800)',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer'
              }}
            >
              Quem Disponibiliza Ração ({items.filter(i => i.type === 'available').length})
            </button>
          </div>

          {/* Quick Search */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              className="form-select"
              style={{ padding: '8px 12px', fontSize: '0.86rem', width: '130px' }}
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="Todos">Todos os pets</option>
              <option value="Cães">Para Cães</option>
              <option value="Gatos">Para Gatos</option>
            </select>

            <input
              type="text"
              className="form-input"
              style={{ padding: '8px 14px', fontSize: '0.86rem', width: '180px' }}
              placeholder="Buscar cidade..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
        </div>

        {/* ===================== CARDS GRID ===================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {filteredItems.map((item) => {
            const isNeed = item.type === 'need';

            return (
              <div
                key={item.id}
                className="card"
                style={{
                  borderTop: isNeed ? '4px solid #b45309' : '4px solid #15803d',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Top Badge & Entity Name */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <span className={`badge ${isNeed ? 'badge-active' : 'badge-confirmed'}`}>
                      {isNeed ? 'Precisa de Ração' : 'Disponível para Doação'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--c-gray-500)' }}>
                      {item.date}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                    {item.orgOrUserName}
                  </h3>

                  {/* Quantity & Food Type Highlight Card Required by Prompt */}
                  <div style={{
                    backgroundColor: 'var(--c-sand-50)',
                    borderRadius: 'var(--r-md)',
                    padding: '14px 18px',
                    border: '1px solid var(--c-sand-200)',
                    marginBottom: '16px'
                  }}>
                    <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--c-gray-600)', fontWeight: 700 }}>
                      {isNeed ? 'Precisa de:' : 'Disponível:'}
                    </div>
                    <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--c-black-900)', marginTop: '2px' }}>
                      {item.foodType}
                    </div>
                    <div style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: isNeed ? 'var(--c-brown-800)' : '#15803d',
                      marginTop: '6px'
                    }}>
                      {item.quantityKg} kg
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.88rem', color: 'var(--c-black-800)', lineHeight: 1.5, marginBottom: '16px' }}>
                    {item.description}
                  </p>

                  {/* Location Details */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.85rem',
                    color: 'var(--c-gray-600)',
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--c-sand-100)'
                  }}>
                    <MapPin size={15} color="var(--c-brown-600)" />
                    <span><strong>Local:</strong> {item.city} - {item.state} ({item.locationDetails})</span>
                  </div>
                </div>

                {/* Card Action Footer */}
                {!isONG && (
                  <div style={{
                    padding: '16px 24px',
                    backgroundColor: 'var(--c-sand-50)',
                    borderTop: '1px solid var(--c-sand-200)'
                  }}>
                    {isNeed ? (
                      <button
                        onClick={() => onOpenDonateModal(item)}
                        className="btn btn-earth"
                        style={{ width: '100%' }}
                      >
                        <Heart size={16} fill="currentColor" />
                        <span>Quero doar</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenRequestModal(item)}
                        className="btn btn-primary"
                        style={{ width: '100%' }}
                      >
                        <Bone size={16} />
                        <span>Tenho interesse</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

