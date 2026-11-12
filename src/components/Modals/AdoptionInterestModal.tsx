import React, { useState, useEffect } from 'react';
import { Pet } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../data/mockData';
import { Heart, CheckCircle2, X, Phone, Mail, User as UserIcon, Home, Send } from '../Icons';

interface AdoptionInterestModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: Pet | null;
  onSuccess?: () => void;
}

export const AdoptionInterestModal: React.FC<AdoptionInterestModalProps> = ({
  isOpen,
  onClose,
  pet,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [housingType, setHousingType] = useState<'Casa com quintal' | 'Apartamento' | 'Chácara / Sítio' | 'Outro'>('Casa com quintal');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    } else {
      setName('');
      setEmail('');
      setPhone('');
    }
    setMessage('');
    setSubmitted(false);
  }, [user, isOpen]);

  if (!isOpen || !pet) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone) return;

    DataStore.addAdoptionInterest({
      id: `int-${Date.now()}`,
      petId: pet.id,
      petName: pet.name,
      petImage: pet.image,
      ongId: pet.ongId,
      ongName: pet.ongName,
      userName: name,
      userEmail: email,
      userPhone: phone,
      housingType,
      message: message || `Olá! Tenho muito interesse em adotar o(a) ${pet.name}. Gostaria de entender os próximos passos da adoção responsável.`,
      date: new Date().toISOString().split('T')[0],
      status: 'Em análise'
    });

    setSubmitted(true);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
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
              <Heart size={22} fill="currentColor" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                Interesse de Adoção
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--c-gray-600)' }}>
                Demonstrar interesse por <strong>{pet.name}</strong> • {pet.ongName}
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
                Seu interesse foi enviado para a ONG!
              </h3>
              <p style={{ fontSize: '0.95rem', color: 'var(--c-gray-600)', maxWidth: '420px', margin: '0 auto 24px', lineHeight: 1.6 }}>
                A equipe de <strong>{pet.ongName}</strong> recebeu suas informações e entrará em contato via WhatsApp ou e-mail para dar continuidade à entrevista de adoção.
              </p>

              <div style={{
                backgroundColor: 'var(--c-sand-100)',
                borderRadius: 'var(--r-md)',
                padding: '16px',
                maxWidth: '420px',
                margin: '0 auto 24px',
                textAlign: 'left',
                fontSize: '0.85rem'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '4px' }}>
                  🐾 Lembrete do PetHub:
                </div>
                <div style={{ color: 'var(--c-gray-700)' }}>
                  A adoção é realizada diretamente com a ONG parceira. Mantenha seu telefone e mensagens abertos para agilizar o contato.
                </div>
              </div>

              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '160px' }}>
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                backgroundColor: 'var(--c-sand-100)',
                padding: '12px 16px',
                borderRadius: 'var(--r-md)',
                marginBottom: '20px'
              }}>
                <img
                  src={pet.image}
                  alt={pet.name}
                  style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--c-black-900)' }}>
                    {pet.name} ({pet.species})
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                    {pet.breed} • {pet.age} • {pet.city} - {pet.state}
                  </div>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Nome Completo *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    required
                    className="form-input"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Telefone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    className="form-input"
                    placeholder="(11) 99999-9999"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">E-mail *</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Moradia</label>
                <select
                  className="form-select"
                  value={housingType}
                  onChange={(e) => setHousingType(e.target.value as any)}
                >
                  <option value="Casa com quintal">Casa com quintal telado/fechado</option>
                  <option value="Apartamento">Apartamento (com redes de proteção)</option>
                  <option value="Chácara / Sítio">Chácara / Sítio</option>
                  <option value="Outro">Outro</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mensagem para a ONG</label>
                <textarea
                  className="form-textarea"
                  placeholder="Conte um pouco sobre sua rotina, se tem outros animais e por que deseja acolher este pet..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              <div style={{
                fontSize: '0.8rem',
                color: 'var(--c-gray-600)',
                backgroundColor: 'var(--c-sand-50)',
                padding: '12px 14px',
                borderRadius: 'var(--r-sm)',
                marginBottom: '20px',
                border: '1px solid var(--c-sand-200)'
              }}>
                <strong>Importante:</strong> A adoção é realizada diretamente com a ONG. O PetHub apenas facilita o encontro entre adotantes e organizações.
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-earth">
                  <Send size={16} />
                  <span>Enviar Interesse</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

