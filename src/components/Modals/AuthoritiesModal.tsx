import React from 'react';
import { ShieldAlert, AlertTriangle, Phone, FileText, CheckCircle2, X } from '../Icons';

interface AuthoritiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportInfo?: {
    address: string;
    neighborhood: string;
    city: string;
    date: string;
  };
}

export const AuthoritiesModal: React.FC<AuthoritiesModalProps> = ({
  isOpen,
  onClose,
  reportInfo
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header" style={{ backgroundColor: 'var(--c-sand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b91c1c'
            }}>
              <ShieldAlert size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                Encaminhamento às Autoridades
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Diretrizes e canais oficiais para casos urgentes
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Informative Alert */}
          <div style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: 'var(--r-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'flex-start'
          }}>
            <AlertTriangle size={22} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '0.88rem', color: '#78350f', lineHeight: 1.5 }}>
              <strong>Atenção: Funcionalidade de Simulação (Protótipo)</strong>
              <p style={{ marginTop: '4px' }}>
                O <strong>PetHub</strong> é uma plataforma comunitária de conscientização e proteção. Denúncias cadastradas no sistema não geram protocolo policial automático. Para flagrantes de maus-tratos ou abandono em andamento, utilize os canais oficiais do Estado.
              </p>
            </div>
          </div>

          {reportInfo && (
            <div style={{
              backgroundColor: 'var(--c-sand-100)',
              borderRadius: 'var(--r-md)',
              padding: '14px 18px',
              marginBottom: '20px',
              fontSize: '0.86rem'
            }}>
              <div style={{ fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '4px' }}>
                Dados do Relato Selecionado:
              </div>
              <div style={{ color: 'var(--c-gray-700)' }}>
                📍 {reportInfo.address}, {reportInfo.neighborhood} - {reportInfo.city} • Registrado em {reportInfo.date}
              </div>
            </div>
          )}

          <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--c-black-900)' }}>
            Canais Oficiais para Acionamento Imediato:
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
            <div style={{
              border: '1px solid var(--c-sand-200)',
              borderRadius: 'var(--r-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)' }}>Polícia Militar Ambiental / Emergência</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Para flagrantes de abandono, atropelamento ou violência física</div>
              </div>
              <span className="badge badge-black" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>Ligue 190</span>
            </div>

            <div style={{
              border: '1px solid var(--c-sand-200)',
              borderRadius: 'var(--r-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)' }}>Disque Denúncia Anônima</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Sigilo absoluto para denúncias de criadouros clandestinos e cativeiro</div>
              </div>
              <span className="badge badge-earth" style={{ fontSize: '0.9rem', padding: '6px 14px' }}>Ligue 181</span>
            </div>

            <div style={{
              border: '1px solid var(--c-sand-200)',
              borderRadius: 'var(--r-md)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)' }}>DEPA (Delegacia Eletrônica de Proteção Animal)</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Registro de boletim de ocorrência online com anexo de provas</div>
              </div>
              <span className="badge badge-white" style={{ border: '1px solid var(--c-sand-300)' }}>Online 24h</span>
            </div>
          </div>

          <div style={{
            fontSize: '0.82rem',
            color: 'var(--c-gray-600)',
            lineHeight: 1.5,
            borderTop: '1px solid var(--c-sand-200)',
            paddingTop: '14px'
          }}>
            <strong>O que anexar em uma queixa oficial:</strong> Local exato, horário aproximado, fotos/vídeos nítidos do animal e identificação de infratores ou placas de veículos caso tenha presenciado o ato.
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '130px' }}>
            Compreendi
          </button>
        </div>
      </div>
    </div>
  );
};

