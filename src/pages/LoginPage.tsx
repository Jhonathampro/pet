import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PawPrint, User, Building2, LogIn, ArrowRight, Sparkles, AlertCircle, UserPlus } from '../components/Icons';

interface LoginPageProps {
  onSuccessNavigate: (role: 'user' | 'ong' | 'guest') => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onSuccessNavigate
}) => {
  const { login, loginAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showSignupNotice, setShowSignupNotice] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setShowSignupNotice(false);

    const res = login(email, password);
    if (res.success) {
      if (email.toLowerCase().includes('salvapet')) {
        onSuccessNavigate('ong');
      } else {
        onSuccessNavigate('user');
      }
    } else {
      setErrorMessage(res.message || 'Credenciais inválidas.');
    }
  };

  const handleQuickLogin = (type: 'user' | 'ong') => {
    setShowSignupNotice(false);
    setErrorMessage('');
    if (type === 'user') {
      setEmail('lucas@gmail.com');
      setPassword('chave123');
      login('lucas@gmail.com', 'chave123');
      onSuccessNavigate('user');
    } else {
      setEmail('SalvaPet@gmail.com');
      setPassword('chave123');
      login('SalvaPet@gmail.com', 'chave123');
      onSuccessNavigate('ong');
    }
  };

  const handleGuest = () => {
    loginAsGuest();
    onSuccessNavigate('guest');
  };

  return (
    <div style={{
      minHeight: '85vh',
      backgroundColor: 'var(--c-sand-50)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '920px',
        width: '100%',
        backgroundColor: 'var(--c-white)',
        borderRadius: 'var(--r-xl)',
        overflow: 'hidden',
        border: '1.5px solid var(--c-sand-200)',
        boxShadow: 'var(--shadow-xl)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))'
      }}>
        {/* Left Visual Column */}
        <div style={{
          backgroundColor: 'var(--c-black-900)',
          color: '#fff',
          padding: '48px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ position: 'relative', zIndex: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, var(--c-brown-700), var(--c-brown-900))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <PawPrint size={22} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', fontWeight: 800, color: '#fff' }}>
                Pet<span style={{ color: 'var(--c-brown-400)' }}>Hub</span>
              </span>
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: '14px' }}>
              Acesso à Plataforma
            </h2>
            <p style={{ color: '#d1c4b5', fontSize: '0.94rem', lineHeight: 1.6, marginBottom: '28px' }}>
              Selecione o tipo de perfil ou utilize o formulário ao lado.
            </p>

            {/* Quick Profiles - No credentials printed */}
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              borderRadius: 'var(--r-md)',
              padding: '18px',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f59e0b', fontSize: '0.82rem', fontWeight: 700, marginBottom: '14px' }}>
                <Sparkles size={14} />
                <span>Acesso rápido:</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('user')}
                  className="btn btn-sm btn-outline-white"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    fontSize: '0.86rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <User size={16} color="#f59e0b" />
                    <span style={{ textAlign: 'left' }}>
                      <strong>Perfil de Usuário</strong>
                      <div style={{ fontSize: '0.74rem', opacity: 0.8 }}>Lucas • Adotante</div>
                    </span>
                  </span>
                  <span className="badge badge-earth" style={{ fontSize: '0.7rem' }}>Entrar</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickLogin('ong')}
                  className="btn btn-sm btn-outline-white"
                  style={{
                    width: '100%',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    fontSize: '0.86rem'
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Building2 size={16} color="#38bdf8" />
                    <span style={{ textAlign: 'left' }}>
                      <strong>Perfil de ONG</strong>
                      <div style={{ fontSize: '0.74rem', opacity: 0.8 }}>SalvaPet • Organização</div>
                    </span>
                  </span>
                  <span className="badge badge-earth" style={{ fontSize: '0.7rem' }}>Entrar</span>
                </button>
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.78rem', color: '#78716c', position: 'relative', zIndex: 2 }}>
            PetHub • Saúde, proteção e adoção animal
          </div>
        </div>

        {/* Right Form Column */}
        <div style={{ padding: '48px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
            Entrar na Plataforma
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--c-gray-600)', marginBottom: '24px' }}>
            Digite seu e-mail e senha para continuar.
          </p>

          {errorMessage && (
            <div style={{
              backgroundColor: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '12px 16px',
              borderRadius: 'var(--r-md)',
              fontSize: '0.85rem',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <AlertCircle size={18} />
              <span>{errorMessage}</span>
            </div>
          )}

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
              gap: '8px'
            }}>
              <AlertCircle size={18} color="#2563eb" />
              <span>Cadastro de novas contas estará disponível em uma próxima versão.</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group">
              <label className="form-label">E-mail</label>
              <input
                type="email"
                required
                className="form-input"
                placeholder="seu.email@exemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Senha</label>
              <input
                type="password"
                required
                className="form-input"
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <button
                type="submit"
                className="btn btn-earth btn-lg"
                style={{ flex: 1 }}
              >
                <LogIn size={18} />
                <span>Entrar</span>
              </button>

              <button
                type="button"
                onClick={() => setShowSignupNotice(true)}
                className="btn btn-outline"
                style={{ whiteSpace: 'nowrap' }}
              >
                <UserPlus size={16} />
                <span>Criar conta</span>
              </button>
            </div>
          </form>

          {/* Visitor Mode Button Required by Prompt */}
          <div style={{
            borderTop: '1px solid var(--c-sand-200)',
            paddingTop: '18px',
            textAlign: 'center'
          }}>
            <button
              type="button"
              onClick={handleGuest}
              className="btn btn-outline"
              style={{ width: '100%', gap: '8px', fontWeight: 700 }}
            >
              <span>Entrar como visitante</span>
              <ArrowRight size={16} />
            </button>
            <div style={{ fontSize: '0.78rem', color: 'var(--c-gray-500)', marginTop: '8px' }}>
              Navegue livremente sem realizar login (para adotar, será solicitado entrar como usuário).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
