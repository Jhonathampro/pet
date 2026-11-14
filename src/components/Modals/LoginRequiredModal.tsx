import React, { useState } from 'react';
import { LogIn, UserPlus, X, AlertCircle } from '../Icons';

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGoToLogin: () => void;
}

export const LoginRequiredModal: React.FC<LoginRequiredModalProps> = ({
  isOpen,
  onClose,
  onGoToLogin,
}) => {
  const [showSignupNotice, setShowSignupNotice] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px', padding: '0' }}
      >
        <div className="modal-header" style={{ backgroundColor: 'var(--c-sand-50)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'var(--c-brown-100)',
              color: 'var(--c-brown-900)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <LogIn size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                Faça login para continuar
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Identificação necessária para adoção responsável
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body" style={{ padding: '28px' }}>
          <p style={{ fontSize: '1rem', color: 'var(--c-black-800)', lineHeight: 1.6, marginBottom: '24px' }}>
            Para registrar interesse em adotar um animal, você precisa criar uma conta ou entrar em uma conta existente.
          </p>

          {showSignupNotice && (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e40af',
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: '0.86rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={18} color="#2563eb" />
              <span>Cadastro de novas contas estará disponível em uma próxima versão.</span>
            </div>
          )}

          <div style={{
            backgroundColor: 'var(--c-sand-100)',
            padding: '14px 18px',
            borderRadius: 'var(--r-md)',
            fontSize: '0.86rem',
            color: 'var(--c-gray-700)',
            marginBottom: '28px',
            lineHeight: 1.5
          }}>
            Acesse sua conta de usuário para registrar seu interesse formal e permitir que a ONG entre em contato com você para as próximas etapas da adoção.
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setShowSignupNotice(true)}
              className="btn btn-outline"
            >
              <UserPlus size={16} />
              <span>Criar conta</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                onGoToLogin();
              }}
              className="btn btn-earth"
            >
              <LogIn size={16} />
              <span>Entrar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

