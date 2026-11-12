import React, { useState } from 'react';
import { ONG, Pet } from '../types';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Instagram, 
  Globe, 
  Check, 
  Heart, 
  Bone, 
  DollarSign, 
  Copy, 
  ArrowRight, 
  PawPrint,
  ArrowLeft
} from '../components/Icons';

interface NGOProfilePageProps {
  ong: ONG;
  pets: Pet[];
  onBack: () => void;
  onSelectPet: (pet: Pet) => void;
  onOpenFinancialDonate: (ong: ONG) => void;
}

export const NGOProfilePage: React.FC<NGOProfilePageProps> = ({
  ong,
  pets,
  onBack,
  onSelectPet,
  onOpenFinancialDonate
}) => {
  const [copied, setCopied] = useState(false);

  const ongPets = pets.filter(p => p.ongId === ong.id);
  const availablePets = ongPets.filter(p => p.status === 'Disponível');

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(ong.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '80vh', paddingBottom: '90px' }}>
      {/* Cover Image & Back button */}
      <div style={{
        position: 'relative',
        height: '240px',
        backgroundColor: 'var(--c-black-900)'
      }}>
        <img
          src={ong.coverImage}
          alt={ong.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6 }}
        />
        <div className="container" style={{ position: 'relative', height: '100%' }}>
          <button
            onClick={onBack}
            className="btn btn-sm btn-outline-white"
            style={{
              position: 'absolute',
              top: '24px',
              left: '24px',
              gap: '6px'
            }}
          >
            <ArrowLeft size={16} />
            <span>Voltar para ONGs</span>
          </button>
        </div>
      </div>

      <div className="container" style={{ marginTop: '-60px', position: 'relative', zIndex: 10 }}>
        {/* Main Profile Header Card */}
        <div style={{
          backgroundColor: 'var(--c-white)',
          borderRadius: 'var(--r-xl)',
          padding: '36px',
          border: '1.5px solid var(--c-sand-200)',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '36px'
        }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '24px'
          }}>
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'center' }}>
              <img
                src={ong.logo}
                alt={ong.name}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '24px',
                  objectFit: 'cover',
                  border: '3px solid #fff',
                  boxShadow: 'var(--shadow-md)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <h1 style={{ fontSize: 'clamp(1.6rem, 2.8vw, 2.3rem)', fontWeight: 800, color: 'var(--c-black-900)' }}>
                    {ong.name}
                  </h1>
                  <span className="badge badge-confirmed" style={{ fontSize: '0.75rem' }}>
                    Verificada
                  </span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.95rem',
                  color: 'var(--c-gray-600)',
                  marginBottom: '10px'
                }}>
                  <MapPin size={16} color="var(--c-brown-600)" />
                  <span>{ong.address}, {ong.neighborhood} • {ong.city} - {ong.state}</span>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.85rem', color: 'var(--c-gray-700)' }}>
                  <span>WhatsApp: <strong>{ong.whatsapp}</strong></span>
                  <span>E-mail: <strong>{ong.email}</strong></span>
                  <span>Instagram: <strong>{ong.instagram}</strong></span>
                </div>
              </div>
            </div>

            {/* Support CTA Button */}
            {ong.acceptsDonations && (
              <button
                onClick={() => onOpenFinancialDonate(ong)}
                className="btn btn-lg btn-earth"
                style={{ gap: '8px' }}
              >
                <Heart size={18} fill="currentColor" />
                <span>Apoiar Financeiramente</span>
              </button>
            )}
          </div>

          {/* Description */}
          <div style={{ marginTop: '28px', paddingTop: '24px', borderTop: '1px solid var(--c-sand-200)' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Sobre a Organização:
            </h4>
            <p style={{ color: 'var(--c-black-800)', fontSize: '1rem', lineHeight: 1.7, maxWidth: '900px' }}>
              {ong.description}
            </p>
          </div>

          {/* Services & Support Modalities Required by Prompt */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            marginTop: '28px'
          }}>
            <div style={{
              backgroundColor: 'var(--c-sand-50)',
              padding: '18px 20px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--c-sand-200)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Bone size={18} color="var(--c-brown-700)" />
                <span style={{ fontWeight: 700, color: 'var(--c-black-900)', fontSize: '0.92rem' }}>
                  Recebimento de Ração
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: ong.acceptsFood ? '#15803d' : 'var(--c-gray-600)', fontWeight: 600 }}>
                {ong.acceptsFood ? '✓ Aberto para receber doações de ração' : '✕ Não está recebendo no momento'}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--c-sand-50)',
              padding: '18px 20px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--c-sand-200)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <Bone size={18} color="var(--c-brown-700)" />
                <span style={{ fontWeight: 700, color: 'var(--c-black-900)', fontSize: '0.92rem' }}>
                  Disponibilização de Ração
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: ong.providesFood ? '#15803d' : 'var(--c-gray-600)', fontWeight: 600 }}>
                {ong.providesFood ? '✓ Disponibiliza lotes para famílias em vulnerabilidade' : '✕ Sem ração excedente no momento'}
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--c-sand-50)',
              padding: '18px 20px',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--c-sand-200)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <DollarSign size={18} color="var(--c-brown-700)" />
                <span style={{ fontWeight: 700, color: 'var(--c-black-900)', fontSize: '0.92rem' }}>
                  Doações Financeiras
                </span>
              </div>
              <div style={{ fontSize: '0.86rem', color: ong.acceptsDonations ? '#15803d' : 'var(--c-gray-600)', fontWeight: 600 }}>
                {ong.acceptsDonations ? '✓ Aceita PIX e Transferência Bancária direta' : '✕ Não recebe recursos financeiros'}
              </div>
            </div>
          </div>
        </div>

        {/* Financial Donation Card If Accepted */}
        {ong.acceptsDonations && (
          <div style={{
            backgroundColor: 'var(--c-sand-100)',
            borderRadius: 'var(--r-xl)',
            padding: '28px 32px',
            border: '1.5px solid var(--c-sand-200)',
            marginBottom: '40px'
          }}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Dados para Apoio Financeiro Direto
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)', marginBottom: '20px' }}>
              Ajude essa ONG a continuar cuidando dos animais. As transferências vão direto para a conta institucional da entidade.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}>
              {/* PIX Box */}
              <div style={{
                backgroundColor: 'var(--c-white)',
                padding: '20px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--c-sand-200)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span className="badge badge-earth">Chave PIX</span>
                  <button
                    onClick={handleCopyPix}
                    className="btn btn-sm btn-outline"
                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                  >
                    {copied ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
                    <span>{copied ? 'Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem', color: 'var(--c-brown-900)' }}>
                  {ong.pixKey}
                </div>
              </div>

              {/* Bank Details */}
              <div style={{
                backgroundColor: 'var(--c-white)',
                padding: '20px',
                borderRadius: 'var(--r-md)',
                border: '1px solid var(--c-sand-200)',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                  Conta Bancária:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div>Banco: <strong>{ong.bank.bankName} ({ong.bank.code})</strong></div>
                  <div>Agência: <strong>{ong.bank.agency}</strong></div>
                  <div>Conta: <strong>{ong.bank.account}</strong></div>
                  <div>Tipo: <strong>{ong.bank.accountType}</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Animals Available from this NGO */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                Animais sob Cuidado desta ONG
              </h2>
              <p style={{ color: 'var(--c-gray-600)', fontSize: '0.95rem', marginTop: '4px' }}>
                {availablePets.length} {availablePets.length === 1 ? 'pet disponível' : 'pets disponíveis'} para adoção responsável
              </p>
            </div>
          </div>

          {availablePets.length === 0 ? (
            <div style={{
              backgroundColor: 'var(--c-white)',
              borderRadius: 'var(--r-lg)',
              padding: '40px',
              textAlign: 'center',
              border: '1px dashed var(--c-sand-300)'
            }}>
              <p style={{ color: 'var(--c-gray-600)' }}>
                No momento, todos os animais desta ONG estão em processo de adoção ou foram adotados!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {availablePets.map((pet) => (
                <div key={pet.id} className="card pet-card">
                  <div className="pet-card-image-wrap">
                    <img src={pet.image} alt={pet.name} />
                    <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                      <span className="badge badge-white">{pet.species}</span>
                    </div>
                  </div>
                  <div className="pet-card-content">
                    <div className="pet-card-header">
                      <h3 className="pet-card-title">{pet.name}</h3>
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-brown-700)' }}>
                        {pet.age}
                      </span>
                    </div>
                    <div className="pet-card-subtitle">
                      <span>{pet.breed}</span>
                      <span>•</span>
                      <span>{pet.sex}</span>
                    </div>
                    <div className="pet-tags">
                      {pet.personality.slice(0, 2).map((t, idx) => (
                        <span key={idx} className="pet-tag">{t}</span>
                      ))}
                    </div>
                    <div className="pet-card-footer">
                      <button
                        onClick={() => onSelectPet(pet)}
                        className="btn btn-outline"
                        style={{ width: '100%', padding: '10px' }}
                      >
                        <span>Ver detalhes</span>
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

