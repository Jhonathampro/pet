import React, { useState, useMemo } from 'react';
import type { ONG, Pet } from '../types';
import { 
  Building2, 
  MapPin, 
  Check, 
  X, 
  Search, 
  ArrowRight, 
  Bone, 
  DollarSign, 
  Phone, 
  Mail, 
  Instagram, 
  Heart,
  Syringe
} from '../components/Icons';

interface NGOsPageProps {
  ongs: ONG[];
  pets: Pet[];
  onSelectONG: (ong: ONG) => void;
  onOpenFinancialDonate: (ong: ONG) => void;
}

export const NGOsPage: React.FC<NGOsPageProps> = ({
  ongs,
  pets,
  onSelectONG,
  onOpenFinancialDonate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterReceivesFood, setFilterReceivesFood] = useState(false);
  const [filterProvidesFood, setFilterProvidesFood] = useState(false);
  const [filterDonations, setFilterDonations] = useState(false);
  const [filterVaccination, setFilterVaccination] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Todas');

  const cities = useMemo(() => {
    const set = new Set<string>();
    ongs.forEach(o => set.add(o.city));
    return Array.from(set);
  }, [ongs]);

  const filteredONGs = useMemo(() => {
    return ongs.filter(ong => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = ong.name.toLowerCase().includes(q);
        const matchesCity = ong.city.toLowerCase().includes(q);
        const matchesDesc = ong.description.toLowerCase().includes(q);
        if (!matchesName && !matchesCity && !matchesDesc) return false;
      }

      if (selectedCity !== 'Todas' && ong.city !== selectedCity) return false;
      if (filterReceivesFood && !ong.acceptsFood) return false;
      if (filterProvidesFood && !ong.providesFood) return false;
      if (filterDonations && !ong.acceptsDonations) return false;
      if (filterVaccination && !ong.offersVaccination) return false;

      return true;
    });
  }, [ongs, searchQuery, selectedCity, filterReceivesFood, filterProvidesFood, filterDonations, filterVaccination]);

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '80vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        padding: '56px 0',
        borderBottom: '3px solid var(--c-brown-800)'
      }}>
        <div className="container">
          <span className="badge badge-earth" style={{ marginBottom: '12px' }}>
            Rede de Proteção
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            Encontre uma ONG Parceira
          </h1>
          <p style={{ color: '#d1c4b5', fontSize: '1.1rem', maxWidth: '640px', marginTop: '8px' }}>
            Conheça as organizações que atuam na linha de frente do resgate, acolhimento e tratamento de animais em vulnerabilidade.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Search & Badges Filter */}
        <div style={{
          backgroundColor: 'var(--c-white)',
          borderRadius: 'var(--r-xl)',
          padding: '24px 28px',
          border: '1.5px solid var(--c-sand-200)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '18px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--c-gray-500)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Buscar por nome da ONG ou bairro..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div style={{ minWidth: '180px' }}>
              <select
                className="form-select"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
              >
                <option value="Todas">Todas as Cidades</option>
                {cities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Quick Checkbox Filters Required by Prompt */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--r-md)',
              border: filterReceivesFood ? '1.5px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
              backgroundColor: filterReceivesFood ? 'var(--c-brown-50)' : 'transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={filterReceivesFood}
                onChange={(e) => setFilterReceivesFood(e.target.checked)}
              />
              <span>✓ Recebe doações de ração</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--r-md)',
              border: filterProvidesFood ? '1.5px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
              backgroundColor: filterProvidesFood ? 'var(--c-brown-50)' : 'transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={filterProvidesFood}
                onChange={(e) => setFilterProvidesFood(e.target.checked)}
              />
              <span>✓ Disponibiliza ração</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--r-md)',
              border: filterDonations ? '1.5px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
              backgroundColor: filterDonations ? 'var(--c-brown-50)' : 'transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={filterDonations}
                onChange={(e) => setFilterDonations(e.target.checked)}
              />
              <span>✓ Aceita doações financeiras (PIX/Banco)</span>
            </label>

            <label style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 14px',
              borderRadius: 'var(--r-md)',
              border: filterVaccination ? '1.5px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
              backgroundColor: filterVaccination ? 'var(--c-brown-50)' : 'transparent',
              cursor: 'pointer',
              fontSize: '0.88rem',
              fontWeight: 600
            }}>
              <input
                type="checkbox"
                checked={filterVaccination}
                onChange={(e) => setFilterVaccination(e.target.checked)}
              />
              <Syringe size={14} color="var(--c-brown-700)" />
              <span>✓ Oferece vacinação de cães</span>
            </label>
          </div>
        </div>

        {/* ONGs Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '28px'
        }}>
          {filteredONGs.map((ong) => {
            const availableCount = pets.filter(p => p.ongId === ong.id && p.status === 'Disponível').length;

            return (
              <div key={ong.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                {/* Header with Logo & Basic Info */}
                <div style={{ padding: '24px 24px 16px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <img
                    src={ong.logo}
                    alt={ong.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '1.5px solid var(--c-sand-200)',
                      boxShadow: 'var(--shadow-sm)'
                    }}
                  />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '4px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)', margin: 0 }}>
                        {ong.name}
                      </h3>
                      {ong.offersVaccination && (
                        <span className="badge badge-earth" style={{ fontSize: '0.7rem', padding: '2px 8px', whiteSpace: 'nowrap' }}>
                          💉 Vacina Cães
                        </span>
                      )}
                    </div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '0.85rem',
                      color: 'var(--c-gray-600)',
                      fontWeight: 500
                    }}>
                      <MapPin size={14} color="var(--c-brown-600)" />
                      <span>{ong.city} - {ong.state} ({ong.neighborhood})</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div style={{ padding: '0 24px 16px', flex: 1 }}>
                  <p style={{
                    fontSize: '0.9rem',
                    color: 'var(--c-black-800)',
                    lineHeight: 1.55,
                    marginBottom: '16px'
                  }}>
                    {ong.description}
                  </p>

                  {/* Badges Required by Prompt */}
                  <div style={{
                    backgroundColor: 'var(--c-sand-50)',
                    border: '1px solid var(--c-sand-200)',
                    borderRadius: 'var(--r-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    fontSize: '0.82rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ong.offersVaccination ? '#15803d' : '#9ca3af' }}>
                      <Check size={14} strokeWidth={3} />
                      <span><strong>{ong.offersVaccination ? '✓ Oferece vacinação de cães na sede' : '✕ Não oferece vacinação'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ong.acceptsFood ? '#15803d' : '#9ca3af' }}>
                      <Check size={14} strokeWidth={3} />
                      <span><strong>{ong.acceptsFood ? 'Recebe ração' : 'Não recebe ração no momento'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ong.providesFood ? '#15803d' : '#9ca3af' }}>
                      <Check size={14} strokeWidth={3} />
                      <span><strong>{ong.providesFood ? 'Disponibiliza ração' : 'Não disponibiliza ração para retirada'}</strong></span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: ong.acceptsDonations ? '#15803d' : '#9ca3af' }}>
                      <Check size={14} strokeWidth={3} />
                      <span><strong>{ong.acceptsDonations ? 'Aceita doações financeiras (PIX/Banco)' : 'Não recebe valores'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Footer with Available Pets & Action Button */}
                <div style={{
                  padding: '16px 24px',
                  borderTop: '1px solid var(--c-sand-200)',
                  backgroundColor: 'var(--c-sand-50)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}>
                  <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-700)' }}>
                    🐾 <strong>{availableCount}</strong> {availableCount === 1 ? 'animal disponível' : 'animais disponíveis'}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    {ong.acceptsDonations && (
                      <button
                        onClick={() => onOpenFinancialDonate(ong)}
                        className="btn btn-sm btn-outline"
                        style={{ padding: '8px 12px' }}
                        title="Doar via PIX"
                      >
                        <Heart size={14} color="#b45309" />
                        <span>Apoiar</span>
                      </button>
                    )}

                    <button
                      onClick={() => onSelectONG(ong)}
                      className="btn btn-sm btn-earth"
                    >
                      <span>Ver ONG</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

