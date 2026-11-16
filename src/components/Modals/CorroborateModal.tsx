import React, { useState } from 'react';
import { AbandonmentReport } from '../../types';
import { DataStore, errorMessage } from '../../data/store';
import { AlertTriangle, CheckCircle2, X, Send, ShieldCheck } from '../Icons';

interface CorroborateModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: AbandonmentReport | null;
  onSuccess: () => void;
}

export const CorroborateModal: React.FC<CorroborateModalProps> = ({
  isOpen,
  onClose,
  report,
  onSuccess
}) => {
  const [comment, setComment] = useState('');
  const [witnessName, setWitnessName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await DataStore.corroborateReport(report.id);
    } catch (err) {
      alert(errorMessage(err));
      return;
    }
    setSubmitted(true);
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <div className="modal-header" style={{ backgroundColor: 'var(--c-sand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fef3c7',
              border: '1px solid #fde68a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#b45309'
            }}>
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                Confirmar Relato Comunitário
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                {report.neighborhood} • {report.city}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 18px'
              }}>
                <CheckCircle2 size={34} />
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                Registro Corroborado pela Comunidade!
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--c-gray-600)', maxWidth: '420px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Graças à sua confirmação, este ponto agora tem <strong>status "Confirmado por múltiplos registros"</strong> e permanecerá ativo no mapa comunitário sem expirar por inatividade.
              </p>
              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '150px' }}>
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                borderRadius: 'var(--r-md)',
                padding: '14px 18px',
                marginBottom: '20px',
                fontSize: '0.85rem',
                color: '#78350f',
                lineHeight: 1.5
              }}>
                <strong>Regra dos 3 Meses:</strong> Relatos únicos expiram em 90 dias se não houver confirmação de outros moradores. Ao confirmar que você também testemunhou ou avistou este caso na região, o ponto passa a ser considerado <strong>Confirmado por múltiplos registros</strong>.
              </div>

              <div className="form-group">
                <label className="form-label">Seu Nome / Identificação Comunitária</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Carlos (morador do bairro)"
                  value={witnessName}
                  onChange={(e) => setWitnessName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Atualização sobre o animal / Situação observada *</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Ex: Também vi este cachorro ontem no mesmo local, vizinhos colocaram uma vasilha de água, mas ele precisa de resgate..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-earth">
                  <ShieldCheck size={16} />
                  <span>Confirmar Registro</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

