import React, { useState } from 'react';
import type { ONG } from '../types';
import { useAuth } from '../context/AuthContext';
import { 
  Heart, 
  Copy, 
  Check, 
  MapPin, 
  ShieldCheck, 
  AlertCircle 
} from '../components/Icons';

interface FinancialDonationsPageProps {
  ongs: ONG[];
  onOpenFinancialDonate: (ong: ONG) => void;
}

export const FinancialDonationsPage: React.FC<FinancialDonationsPageProps> = ({
  ongs,
  onOpenFinancialDonate
}) => {
  const { isONG } = useAuth();
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const donatingONGs = ongs.filter(o => o.acceptsDonations);

  const handleCopyPix = (pixKey: string) => {
    navigator.clipboard?.writeText(pixKey);
    setCopiedKey(pixKey);
    setTimeout(() => setCopiedKey(null), 2500);
  };

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
          <span className="badge badge-earth" style={{ marginBottom: '12px' }}>
            Apoio Financeiro Direto
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            Ajude uma ONG
          </h1>
          <p style={{ color: '#d1c4b5', fontSize: '1.1rem', maxWidth: '640px', marginTop: '8px' }}>
            Contribua diretamente com as organizações de proteção animal. Cada doação vai diretamente para os dados oficiais fornecidos pela ONG.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Transparency Alert */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: 'var(--r-lg)',
          padding: '20px 24px',
          marginBottom: '32px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={28} color="#b45309" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontWeight: 800, color: '#78350f', fontSize: '0.98rem' }}>
              Doação Direta e Transparência
            </div>
            <p style={{ fontSize: '0.86rem', color: '#92400e', marginTop: '2px', lineHeight: 1.5 }}>
              O PetHub não realiza intermediação financeira, cobranças ou taxas. Apresentamos as informações bancárias e chaves PIX cadastradas pelas próprias ONGs parceiras para transferência direta pelo seu aplicativo bancário.
            </p>
          </div>
        </div>

        {/* Notice for logged in ONG */}
        {isONG && (
          <div style={{
            backgroundColor: '#eff6ff',
            border: '1px solid #bfdbfe',
            color: '#1e40af',
            padding: '14px 18px',
            borderRadius: 'var(--r-md)',
            marginBottom: '28px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '0.88rem'
          }}>
            <AlertCircle size={20} color="#2563eb" />
            <span>
              <strong>Perfil ONG:</strong> A ONG é a entidade que recebe doações financeiras. O perfil de ONG não realiza doações financeiras para outras instituições no sistema.
            </span>
          </div>
        )}

        {/* ONGs Donation Cards Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '32px'
        }}>
          {donatingONGs.map((ong) => (
            <div
              key={ong.id}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1.5px solid var(--c-sand-200)',
                backgroundColor: 'var(--c-white)'
              }}
            >
              <div style={{ padding: '28px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header with Logo and Name */}
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                  <img
                    src={ong.logo}
                    alt={ong.name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '16px',
                      objectFit: 'cover',
                      border: '1.5px solid var(--c-sand-200)'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                      {ong.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', color: 'var(--c-gray-600)' }}>
                      <MapPin size={14} color="var(--c-brown-600)" />
                      <span>{ong.city} - {ong.state}</span>
                    </div>
                  </div>
                </div>

                <p style={{
                  fontSize: '0.88rem',
                  color: 'var(--c-gray-700)',
                  lineHeight: 1.55,
                  marginBottom: '20px'
                }}>
                  Ajude essa ONG a continuar cuidando dos animais.
                </p>

                {/* PIX Box */}
                <div style={{
                  backgroundColor: 'var(--c-sand-50)',
                  borderRadius: 'var(--r-md)',
                  padding: '16px 20px',
                  border: '1px solid var(--c-sand-200)',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--c-brown-800)', textTransform: 'uppercase' }}>
                      PIX
                    </span>
                    <button
                      onClick={() => handleCopyPix(ong.pixKey)}
                      className="btn btn-sm btn-outline"
                      style={{ padding: '4px 10px', fontSize: '0.78rem', gap: '4px' }}
                    >
                      {copiedKey === ong.pixKey ? <Check size={13} color="#15803d" /> : <Copy size={13} />}
                      <span>{copiedKey === ong.pixKey ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div style={{
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    fontSize: '0.98rem',
                    color: 'var(--c-brown-900)',
                    wordBreak: 'break-all'
                  }}>
                    Chave PIX: {ong.pixKey}
                  </div>
                </div>

                {/* Bank Account Details */}
                <div style={{
                  backgroundColor: 'var(--c-sand-50)',
                  borderRadius: 'var(--r-md)',
                  padding: '16px 20px',
                  border: '1px solid var(--c-sand-200)',
                  marginBottom: '24px',
                  fontSize: '0.85rem'
                }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <div>
                      <span style={{ color: 'var(--c-gray-600)', fontSize: '0.78rem' }}>Banco</span><br />
                      <strong>{ong.bank.code}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--c-gray-600)', fontSize: '0.78rem' }}>Agência</span><br />
                      <strong>{ong.bank.agency}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--c-gray-600)', fontSize: '0.78rem' }}>Conta</span><br />
                      <strong>{ong.bank.account}</strong>
                    </div>
                  </div>
                </div>

                {/* Card Action Button */}
                <div style={{ marginTop: 'auto' }}>
                  {isONG ? (
                    <button
                      disabled
                      className="btn btn-outline"
                      style={{ width: '100%', opacity: 0.6, cursor: 'not-allowed' }}
                    >
                      <span>ONG é a recebedora de doações</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => onOpenFinancialDonate(ong)}
                      className="btn btn-earth"
                      style={{ width: '100%', gap: '8px' }}
                    >
                      <Heart size={16} fill="currentColor" />
                      <span>Quero doar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
