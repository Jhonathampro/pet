import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  PawPrint, 
  AlertTriangle, 
  User as UserIcon, 
  Building2, 
  LogOut, 
  LogIn, 
  Menu, 
  X, 
  ChevronDown,
  Sparkles,
  Heart,
  Plus
} from './Icons';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
  onOpenAddPetModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAddPetModal }) => {
  const { role, isLoggedIn, isONG, logout, switchDemoRole } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Início', path: '/' },
    { id: 'adotar', label: 'Adotar', path: '/adotar' },
    { id: 'ongs', label: 'ONGs', path: '/ongs' },
    { id: 'mapa', label: 'Mapa de abandonos', path: '/abandono' },
    { id: 'banco-racao', label: 'Banco de ração', path: '/racao' },
    { id: 'doacoes', label: 'Doações', path: '/doacoes' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Demo Bar for reviewer quick switching */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#d1c4b5',
        fontSize: '0.8rem',
        padding: '6px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-block',
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            boxShadow: '0 0 8px #10b981'
          }} />
          <span><strong>PetHub MVP</strong> • Demonstração funcional com dados mockados</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#a89d91' }}>Perfil ativo:</span>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setDemoMenuOpen(!demoMenuOpen)}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                fontSize: '0.78rem',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sparkles size={12} color="#f59e0b" />
              <span>
                {role === 'guest' && 'Visitante (Sem login)'}
                {role === 'user' && 'Usuário: Lucas (lucas@gmail.com)'}
                {role === 'ong' && 'ONG: SalvaPet (SalvaPet@gmail.com)'}
              </span>
              <ChevronDown size={12} />
            </button>

            {demoMenuOpen && (
              <div 
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '100%',
                  marginTop: '6px',
                  backgroundColor: '#1c1917',
                  border: '1px solid #44403c',
                  borderRadius: '8px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                  zIndex: 1000,
                  width: '280px',
                  overflow: 'hidden'
                }}
              >
                <div style={{ padding: '8px 12px', fontSize: '0.75rem', color: '#a8a29e', borderBottom: '1px solid #292524' }}>
                  Alternar papel de visualização:
                </div>
                <button
                  onClick={() => { switchDemoRole('guest'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    background: role === 'guest' ? '#292524' : 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <UserIcon size={14} color="#a8a29e" />
                  <span><strong>Visitante</strong> (Navega sem adotar)</span>
                </button>
                <button
                  onClick={() => { switchDemoRole('user'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    background: role === 'user' ? '#292524' : 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Heart size={14} color="#f59e0b" />
                  <span><strong>Usuário</strong> (Lucas - pode adotar)</span>
                </button>
                <button
                  onClick={() => { switchDemoRole('ong'); setDemoMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    background: role === 'ong' ? '#292524' : 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Building2 size={14} color="#38bdf8" />
                  <span><strong>ONG</strong> (SalvaPet - gerencia pets)</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'rgba(255, 255, 255, 0.96)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--c-sand-200)',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div className="container" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          height: '76px'
        }}>
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              cursor: 'pointer',
              userSelect: 'none'
            }}
          >
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '14px',
              backgroundColor: 'var(--c-black-900)',
              background: 'linear-gradient(135deg, var(--c-black-900) 0%, var(--c-brown-900) 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 14px rgba(15, 14, 13, 0.25)',
              border: '1.5px solid rgba(255,255,255,0.1)'
            }}>
              <PawPrint size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ 
                fontFamily: 'var(--font-heading)',
                fontSize: '1.65rem', 
                fontWeight: 800, 
                letterSpacing: '-0.03em',
                lineHeight: 1,
                color: 'var(--c-black-900)'
              }}>
                Pet<span style={{ color: 'var(--c-brown-600)' }}>Hub</span>
              </div>
              <div style={{ 
                fontSize: '0.68rem', 
                fontWeight: 600, 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                color: 'var(--c-gray-600)',
                marginTop: '3px'
              }}>
                Saúde • Proteção • Adoção
              </div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav style={{
            display: 'none',
            alignItems: 'center',
            gap: '8px'
          }} className="desktop-nav">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  style={{
                    background: isActive ? 'var(--c-sand-100)' : 'transparent',
                    border: 'none',
                    color: isActive ? 'var(--c-brown-900)' : 'var(--c-black-800)',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.94rem',
                    padding: '8px 14px',
                    borderRadius: 'var(--r-md)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--c-brown-700)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'var(--c-black-800)';
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Actions & Role Specific Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* If ONG, show "+ Cadastrar Pet" quick action button */}
            {isONG ? (
              <button
                onClick={() => {
                  if (onOpenAddPetModal) onOpenAddPetModal();
                  else handleNavClick('ong-novo-animal');
                }}
                className="btn btn-sm btn-earth"
                style={{ gap: '6px' }}
              >
                <Plus size={16} />
                <span>Cadastrar Pet</span>
              </button>
            ) : (
              /* Denunciar abandono quick action */
              <button
                onClick={() => handleNavClick('denunciar')}
                className="btn btn-sm"
                style={{
                  backgroundColor: '#fef2f2',
                  color: '#991b1b',
                  border: '1.5px solid #fecaca',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Registrar ponto de animal abandonado"
              >
                <AlertTriangle size={15} color="#b91c1c" />
                <span className="hidden-mobile">Denunciar abandono</span>
                <span className="visible-mobile-only">Denunciar</span>
              </button>
            )}

            {/* User State */}
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <button
                  onClick={() => handleNavClick(isONG ? 'dashboard-ong' : 'dashboard-usuario')}
                  className="btn btn-sm btn-primary"
                  style={{ gap: '8px' }}
                >
                  {isONG ? <Building2 size={16} /> : <UserIcon size={16} />}
                  <span>{isONG ? 'Painel da ONG' : 'Meu Painel'}</span>
                </button>

                <button
                  onClick={logout}
                  className="btn btn-sm btn-ghost btn-icon"
                  title="Sair da conta"
                  style={{ border: '1px solid var(--c-sand-200)' }}
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => handleNavClick('login')}
                  className="btn btn-sm btn-primary"
                >
                  <LogIn size={15} />
                  <span>Entrar</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-menu-btn"
              style={{
                background: 'transparent',
                border: '1px solid var(--c-sand-200)',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--c-black-900)'
              }}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div style={{
            backgroundColor: 'var(--c-white)',
            borderTop: '1px solid var(--c-sand-200)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                style={{
                  textAlign: 'left',
                  padding: '12px 14px',
                  background: currentTab === link.id ? 'var(--c-sand-100)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--r-md)',
                  color: currentTab === link.id ? 'var(--c-brown-900)' : 'var(--c-black-900)',
                  fontWeight: currentTab === link.id ? 700 : 500,
                  fontSize: '1rem',
                  cursor: 'pointer'
                }}
              >
                {link.label}
              </button>
            ))}

            <div style={{ borderTop: '1px solid var(--c-sand-200)', paddingTop: '12px', marginTop: '4px' }}>
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => handleNavClick(isONG ? 'dashboard-ong' : 'dashboard-usuario')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      background: 'var(--c-sand-100)',
                      border: 'none',
                      borderRadius: 'var(--r-md)',
                      fontWeight: 600,
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <UserIcon size={16} />
                    <span>{isONG ? 'Painel da ONG' : 'Meu Painel'}</span>
                  </button>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '12px 14px',
                      background: 'transparent',
                      border: 'none',
                      color: '#b91c1c',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={16} />
                    <span>Sair da conta</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleNavClick('login')}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  <LogIn size={16} />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
        }
        @media (max-width: 859px) {
          .mobile-menu-btn {
            display: flex !important;
          }
          .hidden-mobile {
            display: none !important;
          }
        }
        @media (min-width: 860px) {
          .visible-mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
