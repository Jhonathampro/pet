import React, { useState } from 'react';
import type { ONG, PetSize, VaccinationRequest } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore, errorMessage } from '../../data/store';
import { Syringe, X, CheckCircle2, Calendar, Clock, MapPin, AlertCircle } from '../Icons';

interface VaccinationModalProps {
  isOpen: boolean;
  onClose: () => void;
  ong: ONG | null;
  onSuccess: () => void;
}

export const VaccinationModal: React.FC<VaccinationModalProps> = ({
  isOpen,
  onClose,
  ong,
  onSuccess,
}) => {
  const { user } = useAuth();

  const [dogName, setDogName] = useState('');
  const [breed, setBreed] = useState('');
  const [size, setSize] = useState<PetSize>('Médio');
  const [vaccineType, setVaccineType] = useState('Múltipla V10 (Polivalente)');
  const [tutorName, setTutorName] = useState(user?.name || '');
  const [tutorPhone, setTutorPhone] = useState(user?.phone || '');
  const [tutorEmail, setTutorEmail] = useState(user?.email || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredShift, setPreferredShift] = useState<'Manhã' | 'Tarde'>('Manhã');
  const [notes, setNotes] = useState('');

  const [submittedRequest, setSubmittedRequest] = useState<VaccinationRequest | null>(null);

  if (!isOpen || !ong) return null;

  const handleClose = () => {
    setSubmittedRequest(null);
    setDogName('');
    setBreed('');
    setNotes('');
    setPreferredDate('');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const protocol = `VAC-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newRequest: VaccinationRequest = {
      id: `vac-${Date.now()}`,
      dogName: dogName.trim(),
      breed: breed.trim() || 'SRD',
      size,
      tutorName: tutorName.trim(),
      tutorPhone: tutorPhone.trim(),
      tutorEmail: tutorEmail.trim(),
      preferredDate: preferredDate || new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      preferredShift,
      vaccineType,
      notes: notes.trim(),
      ongId: ong.id,
      ongName: ong.name,
      status: 'Solicitado',
      protocol,
      createdAt: new Date().toISOString(),
    };

    try {
      // o protocolo exibido é o gerado pelo servidor
      setSubmittedRequest(await DataStore.addVaccinationRequest(newRequest));
    } catch (err) {
      alert(errorMessage(err));
      return;
    }
    onSuccess();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', padding: 0 }}
      >
        {/* Header */}
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
              <Syringe size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--c-black-900)' }}>
                Agendar Vacinação para Cão
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Serviço realizado pela <strong>{ong.name}</strong>
              </p>
            </div>
          </div>
          <button onClick={handleClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={{ padding: '28px' }}>
          {submittedRequest ? (
            /* Success Feedback View */
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={36} />
              </div>

              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--c-black-900)', marginBottom: '8px' }}>
                Solicitação de Vacinação Enviada!
              </h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--c-gray-600)', marginBottom: '24px' }}>
                A equipe da <strong>{ong.name}</strong> recebeu o agendamento de <strong>{submittedRequest.dogName}</strong> e entrará em contato via WhatsApp/telefone para confirmar o horário exato.
              </p>

              <div style={{
                backgroundColor: 'var(--c-sand-100)',
                borderRadius: 'var(--r-md)',
                padding: '20px',
                textAlign: 'left',
                border: '1px solid var(--c-sand-200)',
                marginBottom: '24px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Protocolo:</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--c-brown-900)' }}>{submittedRequest.protocol}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Cachorro:</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--c-black-900)' }}>{submittedRequest.dogName} ({submittedRequest.breed} • {submittedRequest.size})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Vacina:</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--c-black-900)' }}>{submittedRequest.vaccineType}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Data / Turno:</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--c-black-900)' }}>{submittedRequest.preferredDate} ({submittedRequest.preferredShift})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>Local da Vacinação:</span>
                  <strong style={{ fontSize: '0.88rem', color: 'var(--c-black-900)' }}>{ong.address}, {ong.neighborhood} ({ong.city})</strong>
                </div>
              </div>

              <div style={{
                backgroundColor: '#eff6ff',
                borderRadius: 'var(--r-md)',
                padding: '12px 16px',
                fontSize: '0.82rem',
                color: '#1e40af',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                textAlign: 'left'
              }}>
                <AlertCircle size={16} color="#2563eb" />
                <span>Recomendação: leve a carteirinha anterior de vacinação se houver e mantenha o cão com guia e coleira segura.</span>
              </div>

              <button
                type="button"
                onClick={handleClose}
                className="btn btn-earth btn-lg"
                style={{ width: '100%' }}
              >
                Concluir
              </button>
            </div>
          ) : (
            /* Scheduling Form */
            <form onSubmit={handleSubmit}>
              <div style={{
                backgroundColor: 'var(--c-sand-100)',
                borderRadius: 'var(--r-md)',
                padding: '12px 16px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <MapPin size={18} color="var(--c-brown-700)" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div style={{ fontSize: '0.84rem', color: 'var(--c-black-800)', lineHeight: 1.5 }}>
                  A vacinação é realizada na sede da <strong>{ong.name}</strong> ({ong.address}, {ong.neighborhood} - {ong.city}).
                </div>
              </div>

              {/* Dog Information */}
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--c-black-900)', marginBottom: '12px' }}>
                Dados do Cachorro:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nome do Cão *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Rex, Pipoca..."
                    className="form-input"
                    value={dogName}
                    onChange={(e) => setDogName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Raça ou SRD</label>
                  <input
                    type="text"
                    placeholder="Ex: SRD Caramelo, Poodle..."
                    className="form-input"
                    value={breed}
                    onChange={(e) => setBreed(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Porte do Cão *</label>
                  <select
                    className="form-select"
                    value={size}
                    onChange={(e) => setSize(e.target.value as PetSize)}
                  >
                    <option value="Pequeno">Pequeno (até 10kg)</option>
                    <option value="Médio">Médio (11 a 25kg)</option>
                    <option value="Grande">Grande (acima de 25kg)</option>
                  </select>
                </div>
              </div>

              {/* Vaccine Selection */}
              <div className="form-group">
                <label className="form-label">Tipo de Vacina *</label>
                <select
                  className="form-select"
                  value={vaccineType}
                  onChange={(e) => setVaccineType(e.target.value)}
                >
                  <option value="Múltipla V10 (Polivalente)">Múltipla V10 (Polivalente canina completa)</option>
                  <option value="Múltipla V8 (Polivalente)">Múltipla V8 (Polivalente básica)</option>
                  <option value="Antirrábica">Antirrábica (Dose anual contra Raiva)</option>
                  <option value="Gripe Canina (Tosse dos Canis)">Gripe Canina (Tosse dos Canis)</option>
                  <option value="Giárdia">Vacina contra Giárdia</option>
                  <option value="Avaliação Veterinária / Carteirinha Inicial">Avaliação Veterinária / Primeira Carteirinha</option>
                </select>
              </div>

              {/* Date & Shift */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Data Preferencial *</label>
                  <div style={{ position: 'relative' }}>
                    <Calendar size={16} color="var(--c-gray-500)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="date"
                      required
                      className="form-input"
                      style={{ paddingLeft: '38px' }}
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Turno Preferencial *</label>
                  <div style={{ position: 'relative' }}>
                    <Clock size={16} color="var(--c-gray-500)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <select
                      className="form-select"
                      style={{ paddingLeft: '38px' }}
                      value={preferredShift}
                      onChange={(e) => setPreferredShift(e.target.value as 'Manhã' | 'Tarde')}
                    >
                      <option value="Manhã">Manhã (09h00 às 12h00)</option>
                      <option value="Tarde">Tarde (13h30 às 17h00)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Tutor Info */}
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--c-black-900)', marginTop: '18px', marginBottom: '12px' }}>
                Dados do Tutor Responsável:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Nome do Tutor *</label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome completo"
                    className="form-input"
                    value={tutorName}
                    onChange={(e) => setTutorName(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Telefone / WhatsApp *</label>
                  <input
                    type="text"
                    required
                    placeholder="(11) 99999-9999"
                    className="form-input"
                    value={tutorPhone}
                    onChange={(e) => setTutorPhone(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">E-mail *</label>
                  <input
                    type="email"
                    required
                    placeholder="seu.email@exemplo.com"
                    className="form-input"
                    value={tutorEmail}
                    onChange={(e) => setTutorEmail(e.target.value)}
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="form-group">
                <label className="form-label">Observações (opcional)</label>
                <textarea
                  className="form-textarea"
                  rows={2}
                  placeholder="Informe idade estimada, histórico de reações a vacinas ou observações de saúde..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-earth"
                  style={{ gap: '8px' }}
                >
                  <Syringe size={16} />
                  <span>Confirmar Agendamento</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

