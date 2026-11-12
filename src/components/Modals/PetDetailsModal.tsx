import React, { useState } from 'react';
import type { Pet, ONG } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { 
  Heart, 
  MapPin, 
  Building2, 
  Check, 
  X, 
  ArrowRight,
  Info,
  AlertCircle
} from '../Icons';

interface PetDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
  ong?: ONG | null;
  onOpenInterest: (pet: Pet) => void;
  onRequireLogin: () => void;
  onViewONG?: (ongId: string) => void;
}

export const PetDetailsModal: React.FC<PetDetailsModalProps> = ({
  isOpen,
  onClose,
  pet,
  onOpenInterest,
  onRequireLogin,
  onViewONG
}) => {
  const { isLoggedIn, isONG, isUser } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!isOpen || !pet) return null;

  const images = pet.gallery && pet.gallery.length > 0 ? pet.gallery : [pet.image];

  const handleInterestClick = () => {
    if (!isLoggedIn) {
      onRequireLogin();
      return;
    }

    if (isONG) {
      // ONG não pode adotar animais
      return;
    }

    onClose();
    onOpenInterest(pet);
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '820px' }}
      >
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            border: '1px solid var(--c-sand-200)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)'
          }}
        >
          <X size={20} color="var(--c-black-900)" />
        </button>

        <div className="modal-body" style={{ padding: 0 }}>
          {/* Main Visual Image Banner & Gallery */}
          <div style={{ position: 'relative', width: '100%', height: '360px', backgroundColor: 'var(--c-sand-100)' }}>
            <img
              src={images[activeImageIndex] || pet.image}
              alt={pet.name}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            {/* Status & Species Badges */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px' }}>
              <span className={`badge ${
                pet.status === 'Disponível' ? 'badge-confirmed' :
                pet.status === 'Em processo de adoção' ? 'badge-active' : 'badge-expired'
              }`} style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                {pet.status}
              </span>
              <span className="badge badge-black" style={{ padding: '6px 14px', fontSize: '0.82rem' }}>
                {pet.species}
              </span>
            </div>

            {/* Thumbnail switcher if multiple images */}
            {images.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                display: 'flex',
                gap: '8px'
              }}>
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '8px',
                      border: activeImageIndex === idx ? '2px solid #fff' : '2px solid transparent',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      padding: 0,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Content Container */}
          <div style={{ padding: '32px' }}>
            {/* Title & Key Stats */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div>
                <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                  {pet.name}
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: 'var(--c-gray-600)',
                  fontSize: '0.95rem',
                  marginTop: '4px'
                }}>
                  <span style={{ fontWeight: 600 }}>{pet.breed}</span>
                  <span>•</span>
                  <span>{pet.sex}</span>
                  <span>•</span>
                  <span>{pet.age}</span>
                  <span>•</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={15} color="var(--c-brown-600)" />
                    {pet.city} - {pet.state}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-earth" style={{ fontSize: '0.85rem' }}>
                  Porte: {pet.size}
                </span>
                <span className="badge badge-earth" style={{ fontSize: '0.85rem' }}>
                  {pet.ageCategory}
                </span>
              </div>
            </div>

            {/* Health & Veterinary Badges */}
            <div style={{
              backgroundColor: 'var(--c-sand-50)',
              border: '1px solid var(--c-sand-200)',
              borderRadius: 'var(--r-md)',
              padding: '16px 20px',
              display: 'flex',
              flexWrap: 'wrap',
              gap: '24px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span><strong>Castrado</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span><strong>Vacinas em dia</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Check size={14} strokeWidth={3} />
                </div>
                <span><strong>Vermifugado</strong></span>
              </div>
            </div>

            {/* Personality Tags */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                Personalidade & Temperamento:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {pet.personality.map((trait, i) => (
                  <span key={i} className="pet-tag" style={{ fontSize: '0.85rem', padding: '6px 12px' }}>
                    ✨ {trait}
                  </span>
                ))}
              </div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                Sobre o animal:
              </div>
              <p style={{ color: 'var(--c-black-800)', fontSize: '0.98rem', lineHeight: 1.7 }}>
                {pet.description}
              </p>
            </div>

            {/* Responsible NGO Card */}
            <div style={{
              border: '1.5px solid var(--c-sand-200)',
              borderRadius: 'var(--r-lg)',
              padding: '20px',
              backgroundColor: 'var(--c-white)',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--c-brown-100)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--c-brown-900)'
                }}>
                  <Building2 size={24} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--c-brown-600)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    ONG Responsável
                  </div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                    {pet.ongName}
                  </div>
                  <div style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                    {pet.city} - {pet.state}
                  </div>
                </div>
              </div>

              {onViewONG && (
                <button
                  onClick={() => {
                    onClose();
                    onViewONG(pet.ongId);
                  }}
                  className="btn btn-sm btn-outline"
                >
                  <span>Ver perfil da ONG</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* Fluxo e Intermediação Explicada com o disclaimer oficial exigido */}
            <div style={{
              backgroundColor: 'var(--c-sand-50)',
              border: '1px solid var(--c-sand-200)',
              borderRadius: 'var(--r-md)',
              padding: '16px 20px',
              marginBottom: '28px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78350f', fontWeight: 700, fontSize: '0.9rem', marginBottom: '8px' }}>
                <Info size={18} color="#b45309" />
                <span>Como funciona a adoção no PetHub:</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#57534e', lineHeight: 1.5, marginBottom: '10px' }}>
                <strong>"O PetHub facilita o encontro entre adotantes e ONGs. A adoção é realizada diretamente com a organização responsável pelo animal."</strong>
              </p>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '8px',
                fontSize: '0.8rem',
                color: 'var(--c-gray-700)',
                backgroundColor: 'var(--c-white)',
                padding: '8px 14px',
                borderRadius: 'var(--r-sm)',
                border: '1px solid var(--c-sand-200)'
              }}>
                <span style={{ fontWeight: 700 }}>Usuário</span>
                <span>➔</span>
                <span style={{ fontWeight: 700 }}>PetHub</span>
                <span>➔</span>
                <span style={{ fontWeight: 700 }}>ONG responsável</span>
                <span>➔</span>
                <span style={{ fontWeight: 700 }}>Contato / Visita</span>
                <span>➔</span>
                <span style={{ fontWeight: 700, color: '#15803d' }}>Adoção Responsável</span>
              </div>
            </div>

            {/* Aviso especial se logado como ONG: ONG não pode adotar animais */}
            {isONG && (
              <div style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1e40af',
                padding: '14px 18px',
                borderRadius: 'var(--r-md)',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '0.88rem'
              }}>
                <AlertCircle size={20} color="#2563eb" />
                <span>
                  <strong>Regra de Perfil:</strong> Contas de ONG não realizam adoções. A ONG existe no sistema para disponibilizar animais e receber ajuda. Para adotar como tutor, acesse com uma conta de Usuário.
                </span>
              </div>
            )}

            {/* Primary Action Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', alignItems: 'center' }}>
              <button onClick={onClose} className="btn btn-outline">
                Fechar
              </button>

              {isONG ? (
                <button
                  disabled
                  className="btn btn-lg btn-outline"
                  style={{ opacity: 0.6, cursor: 'not-allowed' }}
                >
                  <span>ONG não realiza adoções</span>
                </button>
              ) : (
                <button
                  onClick={handleInterestClick}
                  className="btn btn-lg btn-earth"
                  style={{ minWidth: '240px' }}
                  disabled={pet.status === 'Adotado'}
                >
                  <Heart size={20} fill={pet.status === 'Adotado' ? 'none' : 'currentColor'} />
                  <span>
                    {pet.status === 'Adotado' ? 'Animal já adotado' : 'Tenho interesse em adotar'}
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
