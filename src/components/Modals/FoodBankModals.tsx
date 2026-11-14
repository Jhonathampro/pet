import React, { useState } from 'react';
import { FoodBankItem } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../data/mockData';
import { Bone, CheckCircle2, X, Send, MapPin, Building2, User } from '../Icons';

interface DonateFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: FoodBankItem | null;
  onSuccess?: () => void;
}

export const DonateFoodModal: React.FC<DonateFoodModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  onSuccess
}) => {
  const { user, isONG } = useAuth();
  const [donorName, setDonorName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantityKg, setQuantityKg] = useState<number>(10);
  const [brandOrType, setBrandOrType] = useState('Ração Adulto');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (user) {
      setDonorName(user.name);
      setPhone(user.phone || '');
    } else {
      setDonorName('');
      setPhone('');
    }
    setSubmitted(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If it's a new offering
    if (!targetItem) {
      DataStore.addFoodItem({
        id: `food-${Date.now()}`,
        type: 'available',
        title: `Disponibilização de ${quantityKg} kg de ${brandOrType}`,
        orgOrUserName: donorName || 'Doador Solidário',
        role: 'user',
        foodType: brandOrType,
        quantityKg: Number(quantityKg),
        city: user?.city || 'São Paulo',
        state: user?.state || 'SP',
        locationDetails: 'Retirada a combinar',
        description: notes || 'Ração disponível para doação solidária a abrigos ou protetores.',
        contact: phone || '(11) 98765-4321',
        date: new Date().toISOString().split('T')[0],
        status: 'Aberto'
      });
    }

    setSubmitted(true);
    if (onSuccess) onSuccess();
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
              backgroundColor: 'var(--c-brown-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--c-brown-900)'
            }}>
              <Bone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                {targetItem ? `Doar Ração para ${targetItem.orgOrUserName}` : 'Disponibilizar Ração para Doação'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Banco de Ração Comunitário PetHub
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
                {targetItem ? 'Contato de doação registrado!' : 'Disponibilização cadastrada com sucesso!'}
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--c-gray-600)', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                {targetItem
                  ? `Seus dados e a intenção de doar ${quantityKg} kg foram registrados para contato direto com ${targetItem.orgOrUserName}.`
                  : `Seu lote de ${quantityKg} kg de ração foi publicado no Banco de Ração e está visível para quem precisa.`}
              </p>
              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '150px' }}>
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {targetItem && (
                <div style={{
                  backgroundColor: 'var(--c-sand-100)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  fontSize: '0.86rem'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '4px' }}>
                    Solicitação: {targetItem.title}
                  </div>
                  <div style={{ color: 'var(--c-gray-700)' }}>
                    Necessidade: <strong>{targetItem.quantityKg} kg</strong> • Local: {targetItem.city} - {targetItem.state}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Seu Nome / Nome da Organização *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Nome do doador"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                />
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
                  <label className="form-label">Quantidade a Doar (Kg) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo / Marca da Ração</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Ração para cães adultos Golden / Royal Canin / etc."
                  value={brandOrType}
                  onChange={(e) => setBrandOrType(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Observações / Como combinar entrega ou retirada</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="Ex: Posso levar até o local no sábado, pacote fechado..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-earth">
                  <Send size={16} />
                  <span>{targetItem ? 'Confirmar Doação' : 'Publicar no Banco'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

interface RequestFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem?: FoodBankItem | null;
  onSuccess?: () => void;
}

export const RequestFoodModal: React.FC<RequestFoodModalProps> = ({
  isOpen,
  onClose,
  targetItem,
  onSuccess
}) => {
  const { user, isONG } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [quantityKg, setQuantityKg] = useState<number>(10);
  const [foodType, setFoodType] = useState('Ração para cães adultos');
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  React.useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
    } else {
      setName('');
      setPhone('');
    }
    setSubmitted(false);
  }, [user, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!targetItem) {
      DataStore.addFoodItem({
        id: `food-${Date.now()}`,
        type: 'need',
        title: `Pedido de auxílio: ${quantityKg} kg de ${foodType}`,
        orgOrUserName: name || 'Protetor em necessidade',
        role: 'user',
        foodType,
        quantityKg: Number(quantityKg),
        city: user?.city || 'São Paulo',
        state: user?.state || 'SP',
        locationDetails: 'Necessidade urgente',
        description: reason || 'Auxílio solicitado para alimentação de animais acolhidos.',
        contact: phone || '(11) 98765-4321',
        date: new Date().toISOString().split('T')[0],
        urgency: 'Média',
        status: 'Aberto'
      });
    }

    setSubmitted(true);
    if (onSuccess) onSuccess();
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
              backgroundColor: 'var(--c-brown-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--c-brown-900)'
            }}>
              <Bone size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                {targetItem ? `Solicitar Ração Disponibilizada por ${targetItem.orgOrUserName}` : 'Solicitar Ração Solidária'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Banco de Ração PetHub
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
                Solicitação Registrada!
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--c-gray-600)', maxWidth: '400px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                {targetItem
                  ? `Seu interesse no lote de ${targetItem.quantityKg} kg foi enviado para ${targetItem.orgOrUserName}.`
                  : `Seu pedido de ração foi registrado no Banco de Ração e doadores da região poderão prestar auxílio.`}
              </p>
              <button onClick={onClose} className="btn btn-primary" style={{ minWidth: '150px' }}>
                Fechar
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {targetItem && (
                <div style={{
                  backgroundColor: 'var(--c-sand-100)',
                  borderRadius: 'var(--r-md)',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  fontSize: '0.86rem'
                }}>
                  <div style={{ fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '4px' }}>
                    Lote Disponível: {targetItem.title}
                  </div>
                  <div style={{ color: 'var(--c-gray-700)' }}>
                    Quantidade: <strong>{targetItem.quantityKg} kg</strong> • Local: {targetItem.city} - {targetItem.state}
                  </div>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Nome Completo / ONG *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
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
                  <label className="form-label">Quantidade Necessária (Kg) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="form-input"
                    value={quantityKg}
                    onChange={(e) => setQuantityKg(Number(e.target.value))}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tipo de Ração Necessária</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ex: Ração para gatos castrados, ração cão adulto..."
                  value={foodType}
                  onChange={(e) => setFoodType(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Motivo da solicitação / Situação dos animais</label>
                <textarea
                  className="form-textarea"
                  style={{ minHeight: '80px' }}
                  placeholder="Descreva brevemente quantos animais atende e sua necessidade..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={onClose} className="btn btn-outline">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-earth">
                  <Send size={16} />
                  <span>{targetItem ? 'Solicitar Retirada' : 'Publicar Solicitação'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

