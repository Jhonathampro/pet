import React, { useState, useEffect } from 'react';
import { Pet, PetSpecies, PetSex, PetStatus, PetSize } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { DataStore } from '../../data/mockData';
import { Plus, Edit, X, Camera, Check, PawPrint } from '../Icons';

interface AddPetModalProps {
  isOpen: boolean;
  onClose: () => void;
  petToEdit?: Pet | null;
  onSuccess: () => void;
}

const PRESET_DOG_PHOTOS = [
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=800&q=80'
];

const PRESET_CAT_PHOTOS = [
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1513360309081-38f0762b121f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=800&q=80'
];

export const AddPetModal: React.FC<AddPetModalProps> = ({
  isOpen,
  onClose,
  petToEdit,
  onSuccess
}) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [species, setSpecies] = useState<PetSpecies>('Cachorro');
  const [breed, setBreed] = useState('SRD');
  const [sex, setSex] = useState<PetSex>('Macho');
  const [age, setAge] = useState('1 ano');
  const [size, setSize] = useState<PetSize>('Médio');
  const [city, setCity] = useState('São Paulo');
  const [state, setState] = useState('SP');
  const [description, setDescription] = useState('');
  const [personalityInput, setPersonalityInput] = useState('Dócil, Brincalhão, Carinhoso');
  const [image, setImage] = useState(PRESET_DOG_PHOTOS[0]);
  const [status, setStatus] = useState<PetStatus>('Disponível');
  const [vaccinated, setVaccinated] = useState(true);
  const [neutered, setNeutered] = useState(true);
  const [dewormed, setDewormed] = useState(true);

  useEffect(() => {
    if (petToEdit) {
      setName(petToEdit.name);
      setSpecies(petToEdit.species);
      setBreed(petToEdit.breed);
      setSex(petToEdit.sex);
      setAge(petToEdit.age);
      setSize(petToEdit.size);
      setCity(petToEdit.city);
      setState(petToEdit.state);
      setDescription(petToEdit.description);
      setPersonalityInput(petToEdit.personality.join(', '));
      setImage(petToEdit.image);
      setStatus(petToEdit.status);
      setVaccinated(petToEdit.vaccinated);
      setNeutered(petToEdit.neutered);
      setDewormed(petToEdit.dewormed);
    } else {
      setName('');
      setSpecies('Cachorro');
      setBreed('SRD');
      setSex('Macho');
      setAge('2 anos');
      setSize('Médio');
      setCity(user?.city || 'São Paulo');
      setState(user?.state || 'SP');
      setDescription('');
      setPersonalityInput('Dócil, Brincalhão, Sociável');
      setImage(PRESET_DOG_PHOTOS[0]);
      setStatus('Disponível');
      setVaccinated(true);
      setNeutered(true);
      setDewormed(true);
    }
  }, [petToEdit, isOpen, user]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const personality = personalityInput
      .split(',')
      .map(p => p.trim())
      .filter(Boolean);

    const ongId = user?.ongId || 'ong-1';
    const ongName = user?.name || 'ONG Patas que Salvam';

    if (petToEdit) {
      const updated: Pet = {
        ...petToEdit,
        name,
        species,
        breed,
        sex,
        age,
        size,
        city,
        state,
        description,
        personality,
        image,
        status,
        vaccinated,
        neutered,
        dewormed
      };
      DataStore.updatePet(updated);
    } else {
      const newPet: Pet = {
        id: `pet-${Date.now()}`,
        name,
        species,
        breed,
        sex,
        age,
        ageCategory: age.includes('mes') || age.includes('mês') ? 'Filhote' : 'Adulto',
        size,
        city,
        state,
        ongId,
        ongName,
        description,
        personality,
        image,
        gallery: [image],
        status,
        vaccinated,
        neutered,
        dewormed,
        interestedCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      DataStore.addPet(newPet);
    }

    onSuccess();
    onClose();
  };

  const photoPresets = species === 'Cachorro' ? PRESET_DOG_PHOTOS : PRESET_CAT_PHOTOS;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
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
              {petToEdit ? <Edit size={20} /> : <Plus size={22} />}
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--c-black-900)' }}>
                {petToEdit ? `Editar ${petToEdit.name}` : 'Cadastrar Novo Animal para Adoção'}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
                Informações visíveis para a comunidade PetHub
              </p>
            </div>
          </div>
          <button onClick={onClose} className="btn-icon btn-ghost" style={{ border: 'none' }}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {/* Photo Selection and Preview */}
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label">Foto Principal do Animal *</label>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                <img
                  src={image}
                  alt="Preview"
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '12px',
                    objectFit: 'cover',
                    border: '2px solid var(--c-brown-800)',
                    boxShadow: 'var(--shadow-sm)'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)', marginBottom: '8px' }}>
                    Escolha uma imagem predefinida ou informe uma URL:
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                    {photoPresets.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => setImage(p)}
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '8px',
                          overflow: 'hidden',
                          border: image === p ? '2px solid var(--c-brown-800)' : '1px solid var(--c-sand-300)',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        <img src={p} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </button>
                    ))}
                  </div>
                  <input
                    type="url"
                    className="form-input"
                    style={{ fontSize: '0.85rem', padding: '8px 12px' }}
                    placeholder="Ou cole uma URL de imagem externa..."
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Nome do Pet *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: Thor, Mel, Luna"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Espécie *</label>
                <select
                  className="form-select"
                  value={species}
                  onChange={(e) => {
                    const s = e.target.value as PetSpecies;
                    setSpecies(s);
                    setImage(s === 'Cachorro' ? PRESET_DOG_PHOTOS[0] : PRESET_CAT_PHOTOS[0]);
                  }}
                >
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Raça *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: SRD, Labrador"
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Sexo *</label>
                <select
                  className="form-select"
                  value={sex}
                  onChange={(e) => setSex(e.target.value as PetSex)}
                >
                  <option value="Macho">Macho</option>
                  <option value="Fêmea">Fêmea</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Idade *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: 2 anos, 8 meses"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Porte *</label>
                <select
                  className="form-select"
                  value={size}
                  onChange={(e) => setSize(e.target.value as PetSize)}
                >
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div className="form-group">
                <label className="form-label">Cidade *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: São Paulo"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Estado *</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ex: SP"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Status do Animal *</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as PetStatus)}
              >
                <option value="Disponível">Disponível para adoção</option>
                <option value="Em processo de adoção">Em processo de adoção</option>
                <option value="Adotado">Adotado (concluído)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Personalidade (separar por vírgulas)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Ex: Brincalhão, Calmo, Sociável com cães, Dócil"
                value={personalityInput}
                onChange={(e) => setPersonalityInput(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">História e Descrição Detalhada *</label>
              <textarea
                required
                className="form-textarea"
                placeholder="Conte a história do animal, como foi o resgate, como é o comportamento no dia a dia..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Health Toggles */}
            <div style={{
              display: 'flex',
              gap: '20px',
              padding: '14px',
              backgroundColor: 'var(--c-sand-50)',
              borderRadius: 'var(--r-md)',
              border: '1px solid var(--c-sand-200)',
              marginBottom: '24px'
            }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={vaccinated}
                  onChange={(e) => setVaccinated(e.target.checked)}
                />
                <span>Vacinas em dia</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={neutered}
                  onChange={(e) => setNeutered(e.target.checked)}
                />
                <span>Castrado</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.88rem' }}>
                <input
                  type="checkbox"
                  checked={dewormed}
                  onChange={(e) => setDewormed(e.target.checked)}
                />
                <span>Vermifugado</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button type="button" onClick={onClose} className="btn btn-outline">
                Cancelar
              </button>
              <button type="submit" className="btn btn-earth">
                <Check size={16} />
                <span>{petToEdit ? 'Salvar Alterações' : 'Cadastrar Pet'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

