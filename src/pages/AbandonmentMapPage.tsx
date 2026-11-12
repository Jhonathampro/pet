import React, { useState, useMemo } from 'react';
import { AbandonmentReport, AbandonmentStatus } from '../types';
import { 
  AlertTriangle, 
  MapPin, 
  Calendar, 
  Eye, 
  CheckCircle2, 
  ShieldAlert, 
  Info, 
  Filter, 
  Plus, 
  ArrowRight,
  ShieldCheck,
  Search,
  Camera
} from '../components/Icons';

interface AbandonmentMapPageProps {
  reports: AbandonmentReport[];
  onOpenReportForm: () => void;
  onOpenCorroborate: (report: AbandonmentReport) => void;
  onOpenAuthoritiesModal: (report?: AbandonmentReport) => void;
}

export const AbandonmentMapPage: React.FC<AbandonmentMapPageProps> = ({
  reports,
  onOpenReportForm,
  onOpenCorroborate,
  onOpenAuthoritiesModal
}) => {
  const [selectedReportId, setSelectedReportId] = useState<string>(reports[0]?.id || '');
  const [statusFilter, setStatusFilter] = useState<'Todos' | AbandonmentStatus>('Todos');
  const [searchCity, setSearchCity] = useState('');
  const [showExpiredToggle, setShowExpiredToggle] = useState(false);

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      // By default, hide expired unless toggle or filter asks for it
      if (!showExpiredToggle && statusFilter !== 'Expirado' && r.status === 'Expirado') {
        return false;
      }

      if (statusFilter !== 'Todos' && r.status !== statusFilter) {
        return false;
      }

      if (searchCity.trim()) {
        const q = searchCity.toLowerCase();
        const matches = r.city.toLowerCase().includes(q) || 
                        r.neighborhood.toLowerCase().includes(q) || 
                        r.address.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [reports, statusFilter, searchCity, showExpiredToggle]);

  const selectedReport = useMemo(() => {
    return reports.find(r => r.id === selectedReportId) || filteredReports[0] || null;
  }, [reports, selectedReportId, filteredReports]);

  // Map coordinates normalized to 0-100% inside container
  const getMapPosition = (report: AbandonmentReport) => {
    // Generate deterministic visual map offsets based on report coordinates or ID
    const hash = report.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const left = 20 + ((hash * 17) % 60);
    const top = 18 + ((hash * 29) % 62);
    return { left: `${left}%`, top: `${top}%` };
  };

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '85vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        padding: '52px 0 44px',
        borderBottom: '3px solid var(--c-brown-800)'
      }}>
        <div className="container">
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            <div>
              <span className="badge badge-earth" style={{ marginBottom: '10px' }}>
                Vigilância Comunitária
              </span>
              <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
                Mapa de Abandonos
              </h1>
              <p style={{ color: '#d1c4b5', fontSize: '1.05rem', maxWidth: '640px', marginTop: '6px' }}>
                Visualização geográfica de relatos de abandono registrados por moradores e protetores de animais.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={onOpenReportForm}
                className="btn btn-earth"
                style={{ gap: '8px' }}
              >
                <Plus size={18} />
                <span>Registrar Nova Denúncia</span>
              </button>

              <button
                onClick={() => onOpenAuthoritiesModal()}
                className="btn btn-outline-white"
                style={{ gap: '8px' }}
              >
                <ShieldAlert size={16} color="#f59e0b" />
                <span>Acionar Autoridades</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ marginTop: '28px' }}>
        {/* 3-Month Rule Explanatory Banner Required by Prompt */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: 'var(--r-lg)',
          padding: '18px 24px',
          marginBottom: '28px',
          display: 'flex',
          gap: '16px',
          alignItems: 'flex-start'
        }}>
          <Info size={24} color="#b45309" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <div style={{ fontWeight: 800, color: '#78350f', fontSize: '0.98rem', marginBottom: '4px' }}>
              ⚖️ Entenda a Regra dos Pontos de Abandono (Validação Comunitária de 3 Meses)
            </div>
            <p style={{ fontSize: '0.88rem', color: '#92400e', lineHeight: 1.55 }}>
              Um registro de abandono pode permanecer visível durante até <strong>3 meses</strong>. Caso passem 3 meses desde o ocorrido e não exista mais de um registro relacionado ao mesmo local/região, o ponto é considerado <strong>expirado</strong> e removido da visualização pública padrão. Se houver <strong>múltiplos registros</strong> relacionados ao mesmo local, o ponto permanece <strong>ativo e confirmado</strong> pela comunidade.
            </p>
            <div style={{ fontSize: '0.8rem', color: '#78350f', marginTop: '6px' }}>
              * Os relatos são colaborativos e têm finalidade de mobilização comunitária e resgate, não constituindo boletins policiais formais.
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div style={{
          backgroundColor: 'var(--c-white)',
          borderRadius: 'var(--r-xl)',
          padding: '18px 24px',
          border: '1.5px solid var(--c-sand-200)',
          marginBottom: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Status Filter Tabs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {[
              { id: 'Todos', label: 'Todos os Ativos' },
              { id: 'Ativo', label: 'Ativos (< 3 meses)' },
              { id: 'Confirmado por múltiplos registros', label: 'Confirmados (Múltiplos)' },
              { id: 'Expirado', label: 'Histórico Expirados' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id as any);
                  if (tab.id === 'Expirado') setShowExpiredToggle(true);
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--r-md)',
                  border: statusFilter === tab.id ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
                  backgroundColor: statusFilter === tab.id ? 'var(--c-brown-100)' : 'transparent',
                  color: statusFilter === tab.id ? 'var(--c-brown-900)' : 'var(--c-black-800)',
                  fontWeight: 700,
                  fontSize: '0.84rem',
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Quick Neighborhood search */}
          <div style={{ position: 'relative', width: '260px' }}>
            <Search
              size={16}
              color="var(--c-gray-500)"
              style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '36px', padding: '8px 12px 8px 36px', fontSize: '0.86rem' }}
              placeholder="Filtrar por bairro ou cidade..."
              value={searchCity}
              onChange={(e) => setSearchCity(e.target.value)}
            />
          </div>
        </div>

        {/* ===================== INTERACTIVE MAP & DETAILS SPLIT VIEW ===================== */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '28px',
          alignItems: 'stretch'
        }}>
          {/* Map Visual Canvas */}
          <div style={{
            backgroundColor: '#1c1917',
            borderRadius: 'var(--r-xl)',
            overflow: 'hidden',
            border: '2px solid #292524',
            position: 'relative',
            minHeight: '520px',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Map Top Bar */}
            <div style={{
              backgroundColor: 'rgba(28, 25, 23, 0.95)',
              padding: '14px 20px',
              borderBottom: '1px solid #292524',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '0.88rem', fontWeight: 700 }}>
                <MapPin size={16} color="#d97706" />
                <span>Região Metropolitana • {filteredReports.length} Pontos Marcados</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-black" style={{ fontSize: '0.72rem', border: '1px solid #44403c' }}>
                  Visualizador Interativo
                </span>
              </div>
            </div>

            {/* Map Surface Graphic */}
            <div style={{
              flex: 1,
              position: 'relative',
              backgroundColor: '#181614',
              backgroundImage: `
                radial-gradient(#292524 2px, transparent 2px),
                linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)
              `,
              backgroundSize: '32px 32px, 64px 64px, 64px 64px',
              overflow: 'hidden'
            }}>
              {/* Stylized River & Roads */}
              <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0, opacity: 0.25 }}>
                {/* River Tietê / Pinheiros curve */}
                <path d="M -50 150 Q 200 120 400 240 T 800 350" fill="none" stroke="#0284c7" strokeWidth="18" opacity="0.6" />
                {/* Main Arterials */}
                <line x1="0" y1="280" x2="100%" y2="280" stroke="#78716c" strokeWidth="4" />
                <line x1="160" y1="0" x2="160" y2="100%" stroke="#78716c" strokeWidth="4" />
                <line x1="450" y1="0" x2="450" y2="100%" stroke="#78716c" strokeWidth="4" />
                <path d="M 50 50 L 550 450" stroke="#57534e" strokeWidth="3" strokeDasharray="6,6" />
              </svg>

              {/* Plotted Interactive Pins */}
              {filteredReports.map((report) => {
                const pos = getMapPosition(report);
                const isSelected = selectedReport?.id === report.id;
                const isMultiple = report.status === 'Confirmado por múltiplos registros';
                const isExpired = report.status === 'Expirado';

                return (
                  <div
                    key={report.id}
                    onClick={() => setSelectedReportId(report.id)}
                    style={{
                      position: 'absolute',
                      left: pos.left,
                      top: pos.top,
                      transform: 'translate(-50%, -50%)',
                      cursor: 'pointer',
                      zIndex: isSelected ? 30 : 20,
                      transition: 'all var(--transition-fast)'
                    }}
                  >
                    {/* Pin Outer Ring / Glow */}
                    <div style={{
                      width: isSelected ? '46px' : '36px',
                      height: isSelected ? '46px' : '36px',
                      borderRadius: '50%',
                      backgroundColor: isExpired ? '#57534e' : isMultiple ? '#15803d' : '#b45309',
                      border: isSelected ? '3px solid #ffffff' : '2px solid rgba(255,255,255,0.85)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      boxShadow: isSelected ? '0 0 20px rgba(255,255,255,0.6)' : '0 4px 12px rgba(0,0,0,0.6)',
                      animation: isSelected ? 'pulseGlow 1.8s infinite' : 'none'
                    }}>
                      <AlertTriangle size={isSelected ? 20 : 16} />
                    </div>

                    {/* Neighborhood Tag Label */}
                    <div style={{
                      backgroundColor: isSelected ? '#ffffff' : 'rgba(15, 14, 13, 0.9)',
                      color: isSelected ? '#000000' : '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginTop: '4px',
                      whiteSpace: 'nowrap',
                      textAlign: 'center',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
                      border: isSelected ? '1px solid #d97706' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                      {report.neighborhood} ({report.reportCount})
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Map Legend Footer */}
            <div style={{
              backgroundColor: '#1c1917',
              padding: '12px 20px',
              borderTop: '1px solid #292524',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '16px',
              fontSize: '0.78rem',
              color: '#d1c4b5'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#15803d' }} />
                <span>Confirmado por múltiplos registros</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#b45309' }} />
                <span>Ativo (&lt; 3 meses)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#57534e' }} />
                <span>Expirado (&gt; 3 meses sem novos relatos)</span>
              </div>
            </div>
          </div>

          {/* Right Column: Selected Point Details Card Required by Prompt */}
          <div>
            {selectedReport ? (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                overflow: 'hidden',
                border: '2px solid var(--c-sand-200)',
                boxShadow: 'var(--shadow-md)',
                display: 'flex',
                flexDirection: 'column'
              }}>
                {/* Animal Photo with Status Badge */}
                <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: 'var(--c-sand-100)' }}>
                  <img
                    src={selectedReport.photoUrl}
                    alt="Animal abandonado"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px' }}>
                    <span className={`badge ${
                      selectedReport.status === 'Confirmado por múltiplos registros' ? 'badge-confirmed' :
                      selectedReport.status === 'Ativo' ? 'badge-active' : 'badge-expired'
                    }`} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                      {selectedReport.status}
                    </span>
                    <span className="badge badge-black">
                      {selectedReport.species}
                    </span>
                  </div>
                </div>

                {/* Details Body */}
                <div style={{ padding: '28px' }}>
                  <div style={{
                    fontSize: '0.8rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    fontWeight: 700,
                    color: 'var(--c-brown-700)',
                    marginBottom: '4px'
                  }}>
                    Abandono registrado
                  </div>

                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                    📍 {selectedReport.neighborhood} - {selectedReport.city}
                  </h3>

                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '12px',
                    fontSize: '0.88rem',
                    color: 'var(--c-gray-600)',
                    marginBottom: '18px'
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={15} />
                      Data: <strong>{selectedReport.date}</strong>
                    </span>
                    <span>•</span>
                    <span>Endereço: <strong>{selectedReport.address}</strong></span>
                  </div>

                  {/* Description Box */}
                  <div style={{
                    backgroundColor: 'var(--c-sand-50)',
                    borderRadius: 'var(--r-md)',
                    padding: '16px 18px',
                    border: '1px solid var(--c-sand-200)',
                    marginBottom: '20px',
                    fontSize: '0.92rem',
                    lineHeight: 1.6,
                    color: 'var(--c-black-800)'
                  }}>
                    "{selectedReport.description}"
                  </div>

                  {/* Multiple registrations counter badge Required by Prompt */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 16px',
                    borderRadius: 'var(--r-md)',
                    backgroundColor: selectedReport.reportCount > 1 ? '#dcfce7' : 'var(--c-sand-100)',
                    border: selectedReport.reportCount > 1 ? '1px solid #bbf7d0' : '1px solid var(--c-sand-200)',
                    marginBottom: '24px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700 }}>
                      <CheckCircle2 size={18} color={selectedReport.reportCount > 1 ? '#15803d' : '#854d0e'} />
                      <span style={{ color: selectedReport.reportCount > 1 ? '#14532d' : 'var(--c-black-900)' }}>
                        {selectedReport.reportCount} {selectedReport.reportCount === 1 ? 'registro nesta região' : 'registros nesta região'}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.78rem', color: 'var(--c-gray-600)' }}>
                      {selectedReport.reportCount > 1 ? 'Validação permanente' : 'Aguardando validação'}
                    </span>
                  </div>

                  {/* Actions for this report */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button
                      onClick={() => onOpenCorroborate(selectedReport)}
                      className="btn btn-earth"
                      style={{ width: '100%', gap: '8px' }}
                    >
                      <ShieldCheck size={18} />
                      <span>Adicionar Confirmação / Relato nesta região</span>
                    </button>

                    <button
                      onClick={() => onOpenAuthoritiesModal(selectedReport)}
                      className="btn btn-outline"
                      style={{
                        width: '100%',
                        backgroundColor: '#fffbeb',
                        borderColor: '#fde68a',
                        color: '#78350f',
                        gap: '8px'
                      }}
                    >
                      <ShieldAlert size={16} color="#b45309" />
                      <span>Encaminhar denúncia às autoridades</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{
                backgroundColor: 'var(--c-white)',
                borderRadius: 'var(--r-xl)',
                padding: '48px 24px',
                textAlign: 'center',
                border: '1.5px dashed var(--c-sand-300)'
              }}>
                <MapPin size={32} color="var(--c-gray-500)" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)' }}>
                  Selecione um ponto no mapa
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--c-gray-600)', marginTop: '4px' }}>
                  Clique em qualquer marcador para ver fotos, data e histórico de relatos da região.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

