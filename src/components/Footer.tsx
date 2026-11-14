import React from 'react';
import { PawPrint, ShieldCheck, Heart, AlertTriangle, Phone, Mail, Instagram, ExternalLink } from './Icons';

interface FooterProps {
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer style={{
      backgroundColor: 'var(--c-black-900)',
      color: '#e6ded4',
      borderTop: '3px solid var(--c-brown-800)',
      paddingTop: '64px',
      paddingBottom: '32px'
    }}>
      <div className="container">
        {/* Top Emergency / Safety Alert Banner */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 'var(--r-lg)',
          padding: '24px 28px',
          marginBottom: '56px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', maxWidth: '640px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              backgroundColor: 'rgba(217, 119, 6, 0.15)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
              flexShrink: 0
            }}>
              <ShieldCheck size={26} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#fff', marginBottom: '4px' }}>
                Proteção Animal em Primeiro Lugar
              </div>
              <div style={{ fontSize: '0.88rem', color: '#a8a29e', lineHeight: 1.5 }}>
                Em situações de flagrante de maus-tratos ou risco iminente à vida, acione diretamente a Polícia Militar Ambiental (190) ou Disque Denúncia (181).
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#d97706', fontWeight: 700 }}>Emergência Policial:</span> 190
            </div>
            <div style={{
              padding: '8px 16px',
              borderRadius: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              fontSize: '0.85rem'
            }}>
              <span style={{ color: '#d97706', fontWeight: 700 }}>Disque Denúncia:</span> 181
            </div>
          </div>
        </div>

        {/* Main Footer Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '40px',
          marginBottom: '56px'
        }}>
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, var(--c-brown-700), var(--c-brown-900))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <PawPrint size={20} />
              </div>
              <span style={{ fontFamily: 'var(--font-heading)', fontSize: '1.45rem', fontWeight: 800, color: '#fff' }}>
                Pet<span style={{ color: 'var(--c-brown-400)' }}>Hub</span>
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#a89d91', lineHeight: 1.6, marginBottom: '20px' }}>
              Conectando pessoas, ONGs e animais. Um espaço seguro para adoção responsável, solidariedade comunitária e proteção animal.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#e6ded4'
              }}>
                <Instagram size={18} />
              </span>
              <span style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: 'rgba(255,255,255,0.08)',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: '#e6ded4'
              }}>
                <Mail size={18} />
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '18px' }}>
              Plataforma
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <button 
                  onClick={() => onNavigate('home')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Página Inicial
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('adotar')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Adotar cão ou gato
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('ongs')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Encontre uma ONG
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('mapa')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Mapa de abandonos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('banco-racao')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Banco de Ração Solidário
                </button>
              </li>
            </ul>
          </div>

          {/* Social Impact */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '18px' }}>
              Ajude e Participe
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li>
                <button 
                  onClick={() => onNavigate('doacoes')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Doações financeiras diretas
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('denunciar')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Registrar relato de abandono
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigate('login')} 
                  style={{ background: 'none', border: 'none', color: '#a89d91', cursor: 'pointer', textAlign: 'left', padding: 0 }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#a89d91'}
                >
                  Cadastrar minha ONG
                </button>
              </li>
            </ul>
          </div>

          {/* Disclaimer & Transparency */}
          <div>
            <h4 style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 700, marginBottom: '18px' }}>
              Segurança e Transparência
            </h4>
            <p style={{ fontSize: '0.84rem', color: '#9c9288', lineHeight: 1.5, marginBottom: '12px' }}>
              O PetHub é uma plataforma tecnológica de facilitação. Denúncias cadastradas são relatos colaborativos e não substituem boletins oficiais perante as autoridades.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.78rem',
              color: '#d97706',
              fontWeight: 600
            }}>
              <span>• Plataforma de proteção animal</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div style={{
          borderTop: '1px solid rgba(255,255,255,0.08)',
          paddingTop: '28px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
          color: '#78716c'
        }}>
          <div>
            © 2026 PetHub. Todos os direitos reservados. Cuidar, proteger e encontrar um novo lar.
          </div>
          <div>
            Desenvolvido com carinho para a causa animal • Cores: Preto, Marrom & Branco
          </div>
        </div>
      </div>
    </footer>
  );
};

