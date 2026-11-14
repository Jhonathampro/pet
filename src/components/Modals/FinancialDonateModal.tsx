import React, { useState } from 'react';
import { ONG } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../data/mockData';
import { 
  DollarSign, 
  Copy, 
  Check, 
  CheckCircle2, 
  X, 
  Building2, 
  ShieldCheck, 
  Heart 
} from '../Icons';

interface FinancialDonateModalProps {
  isOpen: boolean;
  onClose: () => void;
  ong: ONG | null;
  onSuccess?: () => void;
}

export const FinancialDonateModal: React.FC<FinancialDonateModalProps> = ({
  isOpen,
  onClose,
  ong,
  onSuccess
}) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !ong) return null;

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : amount;

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(ong.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmDonation = () => {
    if (currentAmount <= 0) return;

    DataStore.addDonation({
      id: `don-${Date.now()}`,
      ongId: ong.id,
      ongName: ong.name,
      donorName: user ? user.name : 'Doador Solidário',
      donorEmail: user ? user.email : 'doador@exemplo.com',
      amount: currentAmount,
      date: new Date().toISOString().split('T')[0],
      method: 'PIX',
      status: 'Confirmado'
    });

    setConfirmed(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '620px' }}>
        <div className="modal-header" style={{ backgroundColor: 'var(--c-sand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--c-brown-100)',
              border: '1px solid var(--c-brown-200)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--c-brown-900)'
            }}>
              <DollarSign size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                Apoiar {ong.name}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Doação direta via dados oficiais informados pela organização
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {confirmed ? (
            <div style={{ textAlign: 'center', padding: '24px 8px' }}>
              <div style={{
                width: '68px',
                height: '68px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                border: '2px solid #bbf7d0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#15803d',
                margin: '0 auto 20px'
              }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                Doação Registrada com Sucesso!
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--c-gray-600)', maxWidth: '440px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Valor de <strong>R$ {currentAmount.toFixed(2).replace('.', ',')}</strong> registrado com sucesso para <strong>{ong.name}</strong>. A contribuição já reflete nos painéis informativos da plataforma.
              </p>
              
              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '160px' }}>
                Concluir
              </button>
            </div>
          ) : (
            <>
              {/* Preset Amounts */}
              <div style={{ marginBottom: '24px' }}>
                <label className="form-label">Selecione ou digite um valor de referência:</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                  {[20, 50, 100, 200].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => { setAmount(val); setCustomAmount(''); }}
                      style={{
                        padding: '12px 8px',
                        borderRadius: 'var(--r-md)',
                        border: (amount === val && !customAmount) ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-200)',
                        backgroundColor: (amount === val && !customAmount) ? 'var(--c-brown-100)' : 'var(--c-white)',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        color: (amount === val && !customAmount) ? 'var(--c-brown-900)' : 'var(--c-black-900)',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      R$ {val}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  className="form-input"
                  placeholder="Ou digite outro valor (ex: 75)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                />
              </div>

              {/* PIX Details Card */}
              <div style={{
                backgroundColor: 'var(--c-sand-50)',
                border: '1.5px solid var(--c-sand-200)',
                borderRadius: 'var(--r-lg)',
                padding: '20px',
                marginBottom: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge badge-earth" style={{ fontSize: '0.82rem' }}>Chave PIX Oficial</span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--c-gray-600)' }}>Sem intermediários</span>
                  </div>
                  <button
                    onClick={handleCopyPix}
                    className="btn btn-sm btn-outline"
                    style={{ gap: '6px', padding: '6px 12px' }}
                  >
                    {copied ? <Check size={14} color="#15803d" /> : <Copy size={14} />}
                    <span>{copied ? 'Copiada!' : 'Copiar chave'}</span>
                  </button>
                </div>

                <div style={{
                  backgroundColor: 'var(--c-white)',
                  border: '1px dashed var(--c-sand-300)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 16px',
                  fontFamily: 'monospace',
                  fontSize: '1rem',
                  fontWeight: 600,
                  color: 'var(--c-brown-900)',
                  wordBreak: 'break-all',
                  marginBottom: '16px'
                }}>
                  {ong.pixKey}
                </div>

                {/* Simulated QR Code Box */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  backgroundColor: 'var(--c-white)',
                  border: '1px solid var(--c-sand-200)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 16px'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    backgroundColor: 'var(--c-black-900)',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    flexShrink: 0
                  }}>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '4px',
                      padding: '8px'
                    }}>
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#fff' }} />
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#d97706' }} />
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#fff' }} />
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#d97706' }} />
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#fff' }} />
                      <div style={{ width: '12px', height: '12px', backgroundColor: '#fff' }} />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-700)', lineHeight: 1.4 }}>
                    Abra o aplicativo de seu banco, escolha a opção <strong>PIX</strong> e cole a chave acima ou utilize os dados bancários abaixo.
                  </div>
                </div>
              </div>

              {/* Bank Account Details */}
              <div style={{
                border: '1px solid var(--c-sand-200)',
                borderRadius: 'var(--r-md)',
                padding: '16px 20px',
                marginBottom: '24px',
                backgroundColor: 'var(--c-white)'
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                  Dados para Transferência Bancária (TED / DOC):
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', fontSize: '0.84rem' }}>
                  <div>
                    <span style={{ color: 'var(--c-gray-600)' }}>Banco:</span><br />
                    <strong>{ong.bank.bankName} ({ong.bank.code})</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-gray-600)' }}>Agência:</span><br />
                    <strong>{ong.bank.agency}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-gray-600)' }}>Conta:</span><br />
                    <strong>{ong.bank.account}</strong>
                  </div>
                  <div>
                    <span style={{ color: 'var(--c-gray-600)' }}>Tipo:</span><br />
                    <strong>{ong.bank.accountType}</strong>
                  </div>
                </div>
              </div>

              {/* Footer disclaimer & Simulate CTA */}
              <div style={{
                fontSize: '0.8rem',
                color: 'var(--c-gray-600)',
                marginBottom: '20px',
                lineHeight: 1.4
              }}>
                * O PetHub não cobra taxas nem intermedia valores. 100% dos recursos são enviados diretamente às contas verificadas das ONGs.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDonation}
                  className="btn btn-earth"
                  disabled={currentAmount <= 0}
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Confirmar Doação (R$ {currentAmount.toFixed(2)})</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

