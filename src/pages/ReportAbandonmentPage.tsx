import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { DataStore, errorMessage } from '../data/store';
import { AbandonmentReport } from '../types';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Camera, 
  ShieldAlert, 
  CheckCircle2, 
  Info, 
  Send,
  Eye,
  ArrowRight
} from '../components/Icons';

interface ReportAbandonmentPageProps {
  onSuccessNavigateToMap: () => void;
  onOpenAuthoritiesModal: () => void;
}

const PRESET_ABANDONED_PHOTOS = [
  'https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=600&q=80'
];

export const ReportAbandonmentPage: React.FC<ReportAbandonmentPageProps> = ({
  onSuccessNavigateToMap,
  onOpenAuthoritiesModal
}) => {
  const { user, role } = useAuth();
  const [photoUrl, setPhotoUrl] = useState(PRESET_ABANDONED_PHOTOS[0]);
  const [address, setAddress] = useState('Rua das Flores, 250');
  const [neighborhood, setNeighborhood] = useState('Vila Mariana');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [species, setSpecies] = useState<'Cachorro' | 'Gato' | 'Outro'>('Cachorro');
  const [healthCondition, setHealthCondition] = useState<'Sadio' | 'Debilitado / Desnutrido' | 'Ferido'>('Sadio');
  const [description, setDescription] = useState(
    'Encontrei este cachorro próximo à praça. Ele estava sozinho e aparentava estar abandonado.'
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newReport: AbandonmentReport = {
      id: `rep-${Date.now()}`,
      photoUrl,
      address,
      neighborhood,
      city,
      state,
      date,
      species,
      healthCondition,
      description,
      status: 'Ativo',
      reportCount: 1,
      lat: -23.5898 + (Math.random() - 0.5) * 0.05,
      lng: -46.6346 + (Math.random() - 0.5) * 0.05,
      reportedBy: user ? user.name : 'Cidadão Anônimo',
      reportedByRole: role,
      createdAt: new Date().toISOString()
    };

    try {
      await DataStore.addReport(newReport);
    } catch (err) {
      alert(errorMessage(err));
      return;
    }
    setSubmitted(true);
  };

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
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: 'var(--r-full)',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#fca5a5',
            fontSize: '0.8rem',
            fontWeight: 700,
            marginBottom: '14px'
          }}>
            <AlertTriangle size={15} />
            <span>Alerta Comunitário de Proteção</span>
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            Denunciar Abandono de Animal
          </h1>
          <p style={{ color: '#d1c4b5', fontSize: '1.1rem', maxWidth: '640px', marginTop: '8px' }}>
            Registre o local, fotos e detalhes de animais avistados em vias públicas para mobilizar resgates com ONGs e alertar a vizinhança.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '36px',
          alignItems: 'flex-start'
        }}>
          {/* Left Column: Form Card */}
          <div style={{
            backgroundColor: 'var(--c-white)',
            borderRadius: 'var(--r-xl)',
            padding: '36px',
            border: '1.5px solid var(--c-sand-200)',
            boxShadow: 'var(--shadow-md)'
          }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '32px 12px' }}>
                <div style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  border: '2px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803d',
                  margin: '0 auto 20px'
                }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '10px' }}>
                  Denúncia registrada.
                </h3>
                <p style={{ fontSize: '1rem', color: 'var(--c-gray-600)', maxWidth: '440px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                  O ponto foi adicionado ao mapa público de abandonos e permanecerá ativo durante <strong>3 meses</strong> para validação e acompanhamento pela comunidade e ONGs.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
                  <button
                    onClick={onSuccessNavigateToMap}
                    className="btn btn-earth btn-lg"
                  >
                    <MapPin size={18} />
                    <span>Visualizar no Mapa de Abandonos</span>
                  </button>

                  <button
                    onClick={() => setSubmitted(false)}
                    className="btn btn-outline"
                  >
                    <span>Fazer outro relato</span>
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '20px' }}>
                  Formulário de Relato
                </h3>

                {/* Photo selection with visual preview */}
                <div className="form-group">
                  <label className="form-label">Foto do animal *</label>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                    <img
                      src={photoUrl}
                      alt="Animal abandonado"
                      style={{
                        width: '90px',
                        height: '90px',
                        borderRadius: '12px',
                        objectFit: 'cover',
                        border: '2px solid var(--c-brown-800)',
                        boxShadow: 'var(--shadow-sm)'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)', marginBottom: '8px' }}>
                        Selecione uma imagem:
                      </div>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        {PRESET_ABANDONED_PHOTOS.map((p, idx) => (
                          <button
                            type="button"
                            key={idx}
                            onClick={() => setPhotoUrl(p)}
                            style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              overflow: 'hidden',
                              border: photoUrl === p ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
                              cursor: 'pointer',
                              padding: 0
                            }}
                          >
                            <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </button>
                        ))}
                      </div>
                      <input
                        type="url"
                        className="form-input"
                        style={{ fontSize: '0.82rem', padding: '6px 10px' }}
                        placeholder="Ou cole a URL de uma foto..."
                        value={photoUrl}
                        onChange={(e) => setPhotoUrl(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Location fields */}
                <div className="form-group">
                  <label className="form-label">Local do ocorrido (Endereço / Ponto de referência) *</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={18} color="var(--c-brown-700)" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      required
                      className="form-input"
                      style={{ paddingLeft: '40px' }}
                      placeholder="Ex: Rua das Flores, 250 (em frente à praça)"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Bairro *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Ex: Vila Mariana"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Cidade *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="Ex: São Paulo"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">UF *</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                    />
                  </div>
                </div>

                {/* Date & Animal characteristics */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '12px' }}>
                  <div className="form-group">
                    <label className="form-label">Data do ocorrido *</label>
                    <input
                      type="date"
                      required
                      className="form-input"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Espécie *</label>
                    <select
                      className="form-select"
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as any)}
                    >
                      <option value="Cachorro">Cachorro</option>
                      <option value="Gato">Gato</option>
                      <option value="Outro">Outro animal</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Condição de saúde</label>
                    <select
                      className="form-select"
                      value={healthCondition}
                      onChange={(e) => setHealthCondition(e.target.value as any)}
                    >
                      <option value="Sadio">Aparentemente sadio</option>
                      <option value="Debilitado / Desnutrido">Debilitado / Desnutrido</option>
                      <option value="Ferido">Ferido / Urgente</option>
                    </select>
                  </div>
                </div>

                {/* Description field */}
                <div className="form-group">
                  <label className="form-label">Descrição detalhada do ocorrido *</label>
                  <textarea
                    required
                    className="form-textarea"
                    placeholder="Descreva cor do animal, se possui coleira, comportamento e se alguém presenciou o ato de abandono..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Required Legal Disclaimer */}
                <div style={{
                  backgroundColor: '#fffbeb',
                  border: '1px solid #fde68a',
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  fontSize: '0.86rem',
                  color: '#78350f',
                  marginBottom: '20px',
                  lineHeight: 1.5
                }}>
                  ⚠️ <strong>Aviso legal:</strong> "Este registro representa um relato enviado por um usuário e não uma confirmação oficial de abandono."
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                  <button type="submit" className="btn btn-earth btn-lg" style={{ width: '100%' }}>
                    <Send size={18} />
                    <span>Registrar Denúncia</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Platform Rules & Authority Action Guidance */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Legal / Platform Integrity Notice Required by Prompt */}
            <div style={{
              backgroundColor: 'var(--c-white)',
              borderRadius: 'var(--r-xl)',
              padding: '30px',
              border: '1.5px solid var(--c-sand-200)',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <ShieldAlert size={24} color="#b45309" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                  Segurança e Confiabilidade
                </h3>
              </div>

              <ul style={{
                listStyle: 'none',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontSize: '0.88rem',
                color: 'var(--c-gray-700)',
                lineHeight: 1.55
              }}>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--c-brown-600)', fontWeight: 800 }}>•</span>
                  <span><strong>Não representam acusações oficiais:</strong> As denúncias cadastradas refletem relatos colaborativos da comunidade civil.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--c-brown-600)', fontWeight: 800 }}>•</span>
                  <span><strong>Moderação ativa:</strong> Conteúdos são verificados e denúncias falsas ou difamatórias são imediatamente removidas.</span>
                </li>
                <li style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ color: 'var(--c-brown-600)', fontWeight: 800 }}>•</span>
                  <span><strong>Identificação da situação:</strong> Fotos e descrições minuciosas ajudam equipes de resgate a mobilizar transporte adequado e suporte veterinário.</span>
                </li>
              </ul>

              {/* Informative Future Feature Button Required by Prompt */}
              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--c-sand-200)' }}>
                <button
                  type="button"
                  onClick={onOpenAuthoritiesModal}
                  className="btn btn-outline"
                  style={{
                    width: '100%',
                    backgroundColor: '#fffbeb',
                    borderColor: '#fde68a',
                    color: '#78350f',
                    fontWeight: 700
                  }}
                >
                  <ShieldAlert size={16} color="#b45309" />
                  <span>Encaminhar denúncia às autoridades</span>
                </button>
                <div style={{ fontSize: '0.78rem', color: 'var(--c-gray-600)', textAlign: 'center', marginTop: '6px' }}>
                  (Clique para visualizar canais oficiais de emergência policial)
                </div>
              </div>
            </div>

            {/* 3-Month Community Rule Card */}
            <div style={{
              backgroundColor: 'var(--c-sand-100)',
              borderRadius: 'var(--r-xl)',
              padding: '28px',
              border: '1.5px solid var(--c-sand-200)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--c-brown-900)', marginBottom: '8px' }}>
                ⚖️ Regra de Expiração Comunitária:
              </div>
              <p style={{ fontSize: '0.86rem', color: 'var(--c-black-800)', lineHeight: 1.6 }}>
                Seu relato ficará visível por até <strong>3 meses</strong>. Se nenhum outro morador registrar ocorrência na mesma região dentro de 90 dias, o registro é considerado solucionado ou expirado. Havendo <strong>múltiplos relatos</strong>, o alerta torna-se permanente no histórico da região.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

