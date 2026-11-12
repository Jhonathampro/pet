import React, { useState } from 'react';
import type { Pet, ONG } from '../types';
import { 
  PawPrint, 
  Heart, 
  AlertTriangle, 
  Building2, 
  MapPin, 
  Bone, 
  DollarSign, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Info
} from '../components/Icons';

interface HomeProps {
  pets: Pet[];
  ongs: ONG[];
  onNavigate: (tab: string, meta?: any) => void;
  onSelectPet: (pet: Pet) => void;
}

export const Home: React.FC<HomeProps> = ({
  pets,
  ongs,
  onNavigate,
  onSelectPet
}) => {
  const [selectedSpecies, setSelectedSpecies] = useState<'Todos' | 'Cachorro' | 'Gato'>('Todos');

  const filteredFeaturedPets = pets
    .filter(p => p.status === 'Disponível')
    .filter(p => selectedSpecies === 'Todos' || p.species === selectedSpecies);

  return (
    <div>
      {/* ===================== HERO SECTION ===================== */}
      <section style={{
        position: 'relative',
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        paddingTop: '68px',
        paddingBottom: '90px',
        overflow: 'hidden',
        borderBottom: '4px solid var(--c-brown-800)'
      }}>
        {/* Subtle background ambient glow */}
        <div style={{
          position: 'absolute',
          top: '-20%',
          right: '5%',
          width: '550px',
          height: '550px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180, 83, 9, 0.22) 0%, rgba(15, 14, 13, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '48px'
          }}>
            {/* Left Column: Headlines & CTAs */}
            <div>
              {/* Trust Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: 'var(--r-full)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                marginBottom: '24px',
                fontSize: '0.82rem',
                color: '#e6ded4'
              }}>
                <ShieldCheck size={16} color="#f59e0b" />
                <span>PetHub • Hub de Saúde e Proteção Animal</span>
              </div>

              {/* Main Headline Requerida pelo Prompt */}
              <h1 style={{
                fontSize: 'clamp(2.3rem, 4.2vw, 3.6rem)',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.18,
                letterSpacing: '-0.03em',
                marginBottom: '20px'
              }}>
                Conectando pessoas, ONGs e animais que precisam de ajuda.
              </h1>

              {/* Subtitle Requerido pelo Prompt */}
              <p style={{
                fontSize: 'clamp(1rem, 1.8vw, 1.2rem)',
                color: '#d1c4b5',
                lineHeight: 1.6,
                marginBottom: '36px',
                maxWidth: '540px'
              }}>
                Encontre um novo companheiro, ajude um animal em situação de abandono ou apoie uma organização de proteção animal.
              </p>

              {/* Main CTAs Requested by Prompt */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '14px',
                marginBottom: '36px'
              }}>
                <button
                  onClick={() => onNavigate('adotar')}
                  className="btn btn-lg btn-earth"
                  style={{ gap: '10px' }}
                >
                  <PawPrint size={20} />
                  <span>Adotar um pet</span>
                </button>

                <button
                  onClick={() => onNavigate('denunciar')}
                  className="btn btn-lg"
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#991b1b',
                    border: '1px solid #fecaca',
                    fontWeight: 700
                  }}
                >
                  <AlertTriangle size={18} color="#b91c1c" />
                  <span>Denunciar abandono</span>
                </button>

                <button
                  onClick={() => onNavigate('ongs')}
                  className="btn btn-lg btn-outline-white"
                >
                  <Building2 size={18} />
                  <span>Encontrar uma ONG</span>
                </button>

                <button
                  onClick={() => onNavigate('doacoes')}
                  className="btn btn-lg btn-outline-white"
                >
                  <Heart size={18} color="#f59e0b" />
                  <span>Quero ajudar</span>
                </button>
              </div>

              {/* Notice that this is an honest MVP */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.84rem',
                color: '#a89d91',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 14px',
                borderRadius: '8px',
                maxWidth: '520px'
              }}>
                <Info size={16} color="#d97706" style={{ flexShrink: 0 }} />
                <span>
                  O PetHub facilita o encontro entre adotantes e ONGs. A adoção é realizada diretamente com a organização responsável.
                </span>
              </div>
            </div>

            {/* Right Column: Hero High-Impact Photography Card */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'relative',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.65)',
                border: '3px solid rgba(255, 255, 255, 0.12)',
                height: '460px'
              }}>
                <img
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80"
                  alt="Cachorros acolhidos e felizes"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />

                {/* Floating Animal Highlight Pill */}
                <div style={{
                  position: 'absolute',
                  bottom: '24px',
                  left: '24px',
                  right: '24px',
                  backgroundColor: 'rgba(15, 14, 13, 0.88)',
                  backdropFilter: 'blur(12px)',
                  padding: '16px 20px',
                  borderRadius: 'var(--r-lg)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      border: '2px solid var(--c-brown-500)'
                    }}>
                      <img
                        src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=200&q=80"
                        alt="Thor"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#fff' }}>
                        Thor • 2 anos
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#d1c4b5' }}>
                        Aguardando adoção responsável na ONG SalvaPet
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const thor = pets.find(p => p.id === 'pet-thor') || pets[0];
                      if (thor) onSelectPet(thor);
                      else onNavigate('adotar');
                    }}
                    className="btn btn-sm btn-earth"
                    style={{ padding: '8px 14px', fontSize: '0.82rem' }}
                  >
                    <span>Conhecer</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== CONCEPT PILLARS (NO FAKE GLOBAL METRICS) ===================== */}
      <section style={{
        backgroundColor: 'var(--c-white)',
        borderBottom: '1px solid var(--c-sand-200)',
        padding: '36px 0'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--c-brown-100)',
                color: 'var(--c-brown-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <PawPrint size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--c-black-900)' }}>
                  Adoção de Cães e Gatos
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                  Animais resgatados e cuidados por ONGs
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#991b1b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <AlertTriangle size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--c-black-900)' }}>
                  Denúncias de Abandono
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                  Mapeamento comunitário com regra de 3 meses
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: 'var(--c-brown-100)',
                color: 'var(--c-brown-900)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bone size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--c-black-900)' }}>
                  Banco de Ração
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                  Quem quer doar ↔ Quem precisa de ajuda
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={22} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--c-black-900)' }}>
                  Apoio Direto a ONGs
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                  Doações via PIX sem taxas ou intermediários
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== ADOPTION HIGHLIGHT SECTION ===================== */}
      <section style={{ padding: '72px 0', backgroundColor: 'var(--c-sand-50)' }}>
        <div className="container">
          {/* Section Header */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            gap: '20px',
            marginBottom: '36px'
          }}>
            <div>
              <span className="badge badge-earth" style={{ marginBottom: '8px' }}>
                Adoção Responsável
              </span>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: 'var(--c-black-900)' }}>
                Animais disponíveis para adoção
              </h2>
              <p style={{ color: 'var(--c-gray-600)', fontSize: '1rem', marginTop: '4px' }}>
                Conheça os cães e gatos sob os cuidados da ONG SalvaPet esperando por um lar responsável.
              </p>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', gap: '8px', backgroundColor: 'var(--c-sand-200)', padding: '4px', borderRadius: 'var(--r-md)' }}>
              {(['Todos', 'Cachorro', 'Gato'] as const).map(spec => (
                <button
                  key={spec}
                  onClick={() => setSelectedSpecies(spec)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 'var(--r-sm)',
                    border: 'none',
                    backgroundColor: selectedSpecies === spec ? 'var(--c-black-900)' : 'transparent',
                    color: selectedSpecies === spec ? '#ffffff' : 'var(--c-black-800)',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  {spec === 'Todos' ? 'Todos os Pets' : spec === 'Cachorro' ? 'Cachorros' : 'Gatos'}
                </button>
              ))}
            </div>
          </div>

          {/* Pet Cards Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '24px',
            marginBottom: '36px'
          }}>
            {filteredFeaturedPets.map((pet) => (
              <div key={pet.id} className="card pet-card">
                <div className="pet-card-image-wrap">
                  <img src={pet.image} alt={pet.name} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <span className="badge badge-white">
                      {pet.species}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-earth" style={{ fontSize: '0.72rem' }}>
                      {pet.sex}
                    </span>
                  </div>
                </div>

                <div className="pet-card-content">
                  <div className="pet-card-header">
                    <h3 className="pet-card-title">{pet.name}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--c-brown-700)' }}>
                      {pet.age}
                    </span>
                  </div>

                  <div className="pet-card-subtitle">
                    <span>{pet.breed}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={13} color="var(--c-brown-600)" />
                      {pet.city} - {pet.state}
                    </span>
                  </div>

                  {/* Personality preview */}
                  <div className="pet-tags">
                    {pet.personality.map((t, idx) => (
                      <span key={idx} className="pet-tag">{t}</span>
                    ))}
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)', marginBottom: '16px' }}>
                    ONG: <strong>{pet.ongName}</strong>
                  </div>

                  <div className="pet-card-footer">
                    <button
                      onClick={() => onSelectPet(pet)}
                      className="btn btn-outline"
                      style={{ width: '100%', padding: '10px', fontWeight: 700 }}
                    >
                      <span>Ver detalhes</span>
                      <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              onClick={() => onNavigate('adotar')}
              className="btn btn-lg btn-primary"
            >
              <PawPrint size={18} />
              <span>Ver todos os animais para adoção</span>
            </button>
          </div>
        </div>
      </section>

      {/* ===================== ABANDONMENT TEASER ===================== */}
      <section style={{
        backgroundColor: 'var(--c-black-800)',
        color: '#fff',
        padding: '72px 0',
        position: 'relative'
      }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '48px'
          }}>
            <div>
              <span className="badge badge-earth" style={{ marginBottom: '14px', backgroundColor: '#fee2e2', color: '#991b1b', border: '1px solid #fecaca' }}>
                Alerta Comunitário
              </span>

              <h2 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '16px' }}>
                Mapa de Registros de Abandono
              </h2>

              <p style={{ color: '#d1c4b5', fontSize: '1rem', lineHeight: 1.6, marginBottom: '20px' }}>
                O PetHub reúne relatos da comunidade para alertar moradores e ajudar ONGs a identificarem regiões críticas com animais que necessitam de acolhimento.
              </p>

              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
                marginBottom: '28px',
                fontSize: '0.86rem',
                color: '#d1c4b5',
                lineHeight: 1.5
              }}>
                <strong style={{ color: '#f59e0b' }}>Regra dos 3 Meses:</strong> Um relato permanece visível por até 3 meses. Caso passem 90 dias sem confirmações adicionais na mesma área, o registro expira. Havendo múltiplos relatos, o ponto continua confirmado.
              </div>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => onNavigate('mapa')}
                  className="btn btn-earth"
                  style={{ gap: '8px' }}
                >
                  <MapPin size={18} />
                  <span>Explorar Mapa</span>
                </button>

                <button
                  onClick={() => onNavigate('denunciar')}
                  className="btn btn-outline-white"
                  style={{ gap: '8px' }}
                >
                  <AlertTriangle size={16} />
                  <span>Registrar Denúncia</span>
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: '#171513',
              borderRadius: 'var(--r-xl)',
              padding: '24px',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#fff', marginBottom: '14px' }}>
                Exemplo de Registro no Sistema:
              </div>
              <div style={{
                backgroundColor: 'rgba(255,255,255,0.05)',
                padding: '16px',
                borderRadius: 'var(--r-md)',
                fontSize: '0.86rem',
                color: '#d1c4b5',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
                  📍 Vila Mariana - São Paulo (2 registros nesta região)
                </div>
                <div style={{ color: '#f59e0b', fontSize: '0.78rem', marginBottom: '8px' }}>
                  Status: Confirmado por múltiplos registros
                </div>
                <p>
                  "Encontrei este cachorro próximo à praça. Ele estava sozinho e aparentava estar abandonado."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
