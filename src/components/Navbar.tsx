import React, { useEffect, useState } from 'react';
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
  Plus
} from './Icons';

interface NavbarProps {
  currentTab: string;
  onNavigate: (tab: string, meta?: any) => void;
  onOpenAddPetModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onNavigate, onOpenAddPetModal }) => {
  const { user, isLoggedIn, isONG, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  // Nav links variam de acordo com o papel do usuário
  const navLinks = isONG
    ? [
        { id: 'home', label: 'Início', path: '/' },
        { id: 'mapa', label: 'Mapa de abandonos', path: '/abandono' },
        { id: 'denunciar', label: 'Registrar abandono', path: '/denunciar' },
      ]
    : [
        { id: 'home', label: 'Início', path: '/' },
        { id: 'adotar', label: 'Adotar', path: '/adotar' },
        { id: 'ongs', label: 'ONGs', path: '/ongs' },
        { id: 'mapa', label: 'Mapa de abandonos', path: '/abandono' },
        { id: 'banco-racao', label: 'Banco de ração', path: '/racao' },
        { id: 'doacoes', label: 'Doações', path: '/doacoes' },
      ];

  const panelTab = isONG ? 'dashboard-ong' : 'dashboard-usuario';
  const panelLabel = isONG ? 'Painel da ONG' : 'Meu Painel';
  const roleLabel = isONG ? 'ONG' : 'Usuário';

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
    setAccountMenuOpen(false);
  };

  // Ao sair, volta para o início já com o cabeçalho de visitante
  const handleLogout = () => {
    logout();
    handleNavClick('home');
  };

  // Esc fecha os menus abertos
  useEffect(() => {
    if (!mobileMenuOpen && !accountMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setAccountMenuOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileMenuOpen, accountMenuOpen]);

  const avatar = user?.avatar ? (
    <img src={user.avatar} alt="" className="nav-avatar" />
  ) : (
    <span className="nav-avatar nav-avatar-fallback">
      {isONG ? <Building2 size={16} /> : <UserIcon size={16} />}
    </span>
  );

  return (
    <>
      {/* Main Sticky Navbar */}
      <header className="nav-header">
        <div className="container nav-bar">
          {/* Brand Logo */}
          <div className="nav-brand" onClick={() => handleNavClick('home')}>
            <div className="nav-brand-icon">
              <PawPrint size={24} strokeWidth={2.2} />
            </div>
            <div>
              <div className="nav-brand-name">
                Pet<span style={{ color: 'var(--c-brown-600)' }}>Hub</span>
              </div>
              <div className="nav-brand-tagline">Saúde • Proteção • Adoção</div>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="nav-links">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-link${currentTab === link.id ? ' is-active' : ''}`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions & Role Specific Buttons */}
          <div className="nav-actions">
            {/* If ONG, show "+ Cadastrar Pet" quick action button */}
            {isONG ? (
              <button
                onClick={() => {
                  if (onOpenAddPetModal) onOpenAddPetModal();
                  else handleNavClick('ong-novo-animal');
                }}
                className="btn btn-sm btn-earth nav-action"
                title="Cadastrar pet"
                aria-label="Cadastrar pet"
              >
                <Plus size={16} />
                <span className="nav-action-label">Cadastrar Pet</span>
              </button>
            ) : (
              /* Denunciar abandono quick action */
              <button
                onClick={() => handleNavClick('denunciar')}
                className="btn btn-sm nav-action nav-report"
                title="Registrar ponto de animal abandonado"
                aria-label="Denunciar abandono"
              >
                <AlertTriangle size={15} color="#b91c1c" />
                <span className="nav-action-label">
                  Denunciar<span className="nav-report-extra"> abandono</span>
                </span>
              </button>
            )}

            {/* User State */}
            {isLoggedIn ? (
              <div style={{ position: 'relative' }}>
                {/* Conta logada: abre menu com painel e sair */}
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  className="nav-account"
                  aria-haspopup="menu"
                  aria-expanded={accountMenuOpen}
                  title={`${roleLabel}: ${user?.name ?? ''}`}
                >
                  {avatar}
                  <span className="nav-account-text">
                    <span className="nav-account-role">{roleLabel}</span>
                    <span className="nav-account-name">{user?.name}</span>
                  </span>
                  <ChevronDown size={14} />
                </button>

                {accountMenuOpen && (
                  <>
                    {/* clique fora fecha */}
                    <div className="nav-backdrop" onClick={() => setAccountMenuOpen(false)} />
                    <div className="nav-account-menu" role="menu">
                      <div className="nav-account-menu-head">
                        <div className="nav-account-role">{roleLabel}</div>
                        <div style={{ fontWeight: 700, color: 'var(--c-black-900)' }}>{user?.name}</div>
                        <div className="nav-account-email">{user?.email}</div>
                      </div>
                      <button role="menuitem" className="nav-menu-item" onClick={() => handleNavClick(panelTab)}>
                        {isONG ? <Building2 size={16} /> : <UserIcon size={16} />}
                        <span>{panelLabel}</span>
                      </button>
                      <button role="menuitem" className="nav-menu-item is-danger" onClick={handleLogout}>
                        <LogOut size={16} />
                        <span>Sair da conta</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <button onClick={() => handleNavClick('login')} className="btn btn-sm btn-primary nav-login">
                <LogIn size={15} />
                <span>Entrar</span>
              </button>
            )}

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nav-burger"
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="nav-drawer">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`nav-drawer-link${currentTab === link.id ? ' is-active' : ''}`}
              >
                {link.label}
              </button>
            ))}

            <div className="nav-drawer-footer">
              {isLoggedIn ? (
                <>
                  <div style={{ padding: '0 14px 10px', fontSize: '0.85rem', color: 'var(--c-gray-600)' }}>
                    {roleLabel}: <strong style={{ color: 'var(--c-black-900)' }}>{user?.name}</strong>
                  </div>
                  <button onClick={() => handleNavClick(panelTab)} className="nav-drawer-link is-active nav-drawer-row">
                    {isONG ? <Building2 size={16} /> : <UserIcon size={16} />}
                    <span>{panelLabel}</span>
                  </button>
                  <button onClick={handleLogout} className="nav-drawer-link nav-drawer-row" style={{ color: '#b91c1c', fontWeight: 600 }}>
                    <LogOut size={16} />
                    <span>Sair da conta</span>
                  </button>
                </>
              ) : (
                <button onClick={() => handleNavClick('login')} className="btn btn-primary" style={{ width: '100%' }}>
                  <LogIn size={16} />
                  <span>Entrar</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      <style>{`
        .nav-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background-color: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--c-sand-200);
          box-shadow: var(--shadow-sm);
        }
        .nav-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          height: 76px;
        }

        /* Marca */
        .nav-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          user-select: none;
          flex-shrink: 0;
        }
        .nav-brand-icon {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--c-black-900) 0%, var(--c-brown-900) 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(15, 14, 13, 0.25);
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          flex-shrink: 0;
        }
        .nav-brand-name {
          font-family: var(--font-heading);
          font-size: 1.65rem;
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          color: var(--c-black-900);
        }
        .nav-brand-tagline {
          font-size: 0.68rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--c-gray-600);
          margin-top: 3px;
          white-space: nowrap;
        }

        /* Links (só no desktop) */
        .nav-links {
          display: none;
          align-items: center;
          gap: 4px;
          min-width: 0;
        }
        .nav-link {
          background: transparent;
          border: none;
          color: var(--c-black-800);
          font-weight: 500;
          font-size: 0.94rem;
          padding: 8px 12px;
          border-radius: var(--r-md);
          cursor: pointer;
          white-space: nowrap;
          transition: all var(--transition-fast);
        }
        .nav-link:hover { color: var(--c-brown-700); }
        .nav-link.is-active {
          background: var(--c-sand-100);
          color: var(--c-brown-900);
          font-weight: 700;
        }

        /* Ações à direita */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .nav-action { gap: 6px; white-space: nowrap; }
        .nav-report {
          background-color: #fef2f2;
          color: #991b1b;
          border: 1.5px solid #fecaca;
          font-weight: 700;
        }
        .nav-login { white-space: nowrap; }

        /* Conta logada */
        .nav-account {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 10px 4px 4px;
          background: var(--c-white);
          border: 1px solid var(--c-sand-200);
          border-radius: 999px;
          cursor: pointer;
          color: var(--c-black-900);
        }
        .nav-account:hover { background: var(--c-sand-50); }
        .nav-avatar {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
        }
        .nav-avatar-fallback {
          background-color: var(--c-sand-100);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .nav-account-text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
        }
        .nav-account-role {
          font-size: 0.66rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--c-gray-600);
        }
        .nav-account-name {
          font-size: 0.86rem;
          font-weight: 700;
          max-width: 130px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nav-backdrop { position: fixed; inset: 0; z-index: 110; }
        .nav-account-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          z-index: 120;
          width: 240px;
          max-width: calc(100vw - 32px);
          background: var(--c-white);
          border: 1px solid var(--c-sand-200);
          border-radius: var(--r-md);
          box-shadow: var(--shadow-lg);
          overflow: hidden;
        }
        .nav-account-menu-head {
          padding: 12px 14px;
          border-bottom: 1px solid var(--c-sand-200);
        }
        .nav-account-email {
          font-size: 0.8rem;
          color: var(--c-gray-600);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nav-menu-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 11px 14px;
          background: transparent;
          border: none;
          font-size: 0.92rem;
          font-weight: 600;
          color: var(--c-black-900);
          text-align: left;
          cursor: pointer;
        }
        .nav-menu-item:hover { background: var(--c-sand-50); }
        .nav-menu-item.is-danger { color: #b91c1c; }

        /* Menu hambúrguer + gaveta (telas menores) */
        .nav-burger {
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: 1px solid var(--c-sand-200);
          border-radius: 8px;
          padding: 8px;
          cursor: pointer;
          color: var(--c-black-900);
        }
        .nav-drawer {
          background-color: var(--c-white);
          border-top: 1px solid var(--c-sand-200);
          padding: 16px 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          box-shadow: var(--shadow-lg);
          max-height: calc(100vh - 76px);
          max-height: calc(100dvh - 76px);
          overflow-y: auto;
        }
        .nav-drawer-link {
          width: 100%;
          text-align: left;
          padding: 12px 14px;
          background: transparent;
          border: none;
          border-radius: var(--r-md);
          color: var(--c-black-900);
          font-weight: 500;
          font-size: 1rem;
          cursor: pointer;
        }
        .nav-drawer-link.is-active {
          background: var(--c-sand-100);
          color: var(--c-brown-900);
          font-weight: 700;
        }
        .nav-drawer-row { display: flex; align-items: center; gap: 8px; }
        .nav-drawer-footer {
          border-top: 1px solid var(--c-sand-200);
          padding-top: 12px;
          margin-top: 4px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        /* Desktop: links na barra, sem hambúrguer */
        @media (min-width: 1100px) {
          .nav-links { display: flex; }
          .nav-burger, .nav-drawer { display: none; }
        }

        /* Desktop estreito: compacta para os 6 links caberem */
        @media (min-width: 1100px) and (max-width: 1299px) {
          .nav-brand-tagline, .nav-report-extra, .nav-account-text { display: none; }
          .nav-bar { gap: 12px; }
          .nav-links { gap: 0; }
          .nav-link { padding: 8px 9px; font-size: 0.9rem; }
        }

        /* Celular: marca menor, ações só com ícone */
        @media (max-width: 560px) {
          .nav-bar { height: 64px; gap: 8px; padding-left: 16px; padding-right: 16px; }
          .nav-drawer { padding: 12px 16px; max-height: calc(100vh - 64px); max-height: calc(100dvh - 64px); }
          .nav-brand { gap: 8px; }
          .nav-brand-icon { width: 38px; height: 38px; border-radius: 12px; }
          .nav-brand-name { font-size: 1.35rem; }
          .nav-brand-tagline, .nav-action-label, .nav-account-text { display: none; }
          .nav-actions { gap: 8px; }
          .nav-action { padding: 9px 10px; }
          .nav-login { padding: 8px 12px; }
          .nav-account { padding: 3px 8px 3px 3px; gap: 4px; }
        }
      `}</style>
    </>
  );
};
