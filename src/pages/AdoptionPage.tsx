import React, { useState, useMemo } from 'react';
import type { Pet, ONG, PetSpecies, PetSex, PetAgeCategory } from '../types';
import { 
  PawPrint, 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  ArrowRight, 
  Heart,
  SlidersHorizontal,
  X,
  Check
} from '../components/Icons';

interface AdoptionPageProps {
  pets: Pet[];
  ongs: ONG[];
  onSelectPet: (pet: Pet) => void;
  onNavigateToONG: (ongId: string) => void;
}

export const AdoptionPage: React.FC<AdoptionPageProps> = ({
  pets,
  ongs,
  onSelectPet,
  onNavigateToONG
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState<'Todos' | PetSpecies>('Todos');
  const [sexFilter, setSexFilter] = useState<'Todos' | PetSex>('Todos');
  const [ageFilter, setAgeFilter] = useState<'Todos' | PetAgeCategory>('Todos');
  const [cityFilter, setCityFilter] = useState<'Todas' | string>('Todas');
  const [ongFilter, setOngFilter] = useState<'Todas' | string>('Todas');
  const [statusFilter, setStatusFilter] = useState<'Todos' | 'Disponível' | 'Em processo de adoção' | 'Adotado'>('Disponível');

  // Extract unique cities from pets
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    pets.forEach(p => cities.add(p.city));
    return Array.from(cities);
  }, [pets]);

  // Filter logic
  const filteredPets = useMemo(() => {
    return pets.filter(pet => {
      // Search query (name, breed, city)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = pet.name.toLowerCase().includes(q);
        const matchesBreed = pet.breed.toLowerCase().includes(q);
        const matchesCity = pet.city.toLowerCase().includes(q);
        const matchesONG = pet.ongName.toLowerCase().includes(q);
        if (!matchesName && !matchesBreed && !matchesCity && !matchesONG) {
          return false;
        }
      }

      // Species
      if (speciesFilter !== 'Todos' && pet.species !== speciesFilter) {
        return false;
      }

      // Sex
      if (sexFilter !== 'Todos' && pet.sex !== sexFilter) {
        return false;
      }

      // Age category
      if (ageFilter !== 'Todos' && pet.ageCategory !== ageFilter) {
        return false;
      }

      // City
      if (cityFilter !== 'Todas' && pet.city !== cityFilter) {
        return false;
      }

      // ONG
      if (ongFilter !== 'Todas' && pet.ongId !== ongFilter) {
        return false;
      }

      // Status
      if (statusFilter !== 'Todos' && pet.status !== statusFilter) {
        return false;
      }

      return true;
    });
  }, [pets, searchQuery, speciesFilter, sexFilter, ageFilter, cityFilter, ongFilter, statusFilter]);

  const resetFilters = () => {
    setSearchQuery('');
    setSpeciesFilter('Todos');
    setSexFilter('Todos');
    setAgeFilter('Todos');
    setCityFilter('Todas');
    setOngFilter('Todas');
    setStatusFilter('Disponível');
  };

  const hasActiveFilters = 
    searchQuery || 
    speciesFilter !== 'Todos' || 
    sexFilter !== 'Todos' || 
    ageFilter !== 'Todos' || 
    cityFilter !== 'Todas' || 
    ongFilter !== 'Todas' ||
    statusFilter !== 'Disponível';

  return (
    <div style={{ backgroundColor: 'var(--c-sand-50)', minHeight: '80vh', paddingBottom: '90px' }}>
      {/* Header Banner */}
      <div style={{
        backgroundColor: 'var(--c-black-900)',
        color: '#fff',
        padding: '56px 0',
        borderBottom: '3px solid var(--c-brown-800)'
      }}>
        <div className="container">
          <span className="badge badge-earth" style={{ marginBottom: '12px' }}>
            Portal de Adoção
          </span>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 3rem)', fontWeight: 800, color: '#fff' }}>
            Encontre seu novo companheiro
          </h1>
          <p style={{ color: '#d1c4b5', fontSize: '1.1rem', maxWidth: '640px', marginTop: '8px' }}>
            Adotar é um ato de amor e compromisso. Todos os animais cadastrados são acompanhados por organizações dedicadas ao bem-estar animal.
          </p>
        </div>
      </div>

      <div className="container" style={{ marginTop: '36px' }}>
        {/* Transparency Banner Requerido pelo Prompt */}
        <div style={{
          backgroundColor: '#fffbeb',
          border: '1.5px solid #fde68a',
          borderRadius: 'var(--r-lg)',
          padding: '16px 20px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '1.3rem' }}>🐾</span>
          <div style={{ fontSize: '0.9rem', color: '#78350f', lineHeight: 1.5 }}>
            <strong>Importante:</strong> O PetHub facilita o encontro entre adotantes e ONGs. A adoção é realizada diretamente com a organização responsável pelo animal.
          </div>
        </div>

        {/* Filter Controls Card */}
        <div style={{
          backgroundColor: 'var(--c-white)',
          borderRadius: 'var(--r-xl)',
          padding: '24px 28px',
          border: '1.5px solid var(--c-sand-200)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '36px'
        }}>
          {/* Search bar & quick reset */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
              <Search
                size={18}
                color="var(--c-gray-500)"
                style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: '44px' }}
                placeholder="Buscar por nome, raça, cidade ou ONG..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="btn btn-outline"
                style={{ gap: '6px' }}
              >
                <X size={16} />
                <span>Limpar Filtros</span>
              </button>
            )}
          </div>

          {/* Filter Dropdowns Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '14px'
          }}>
            {/* Espécie */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Espécie</label>
              <select
                className="form-select"
                value={speciesFilter}
                onChange={(e) => setSpeciesFilter(e.target.value as any)}
              >
                <option value="Todos">Todas as Espécies</option>
                <option value="Cachorro">Cachorro</option>
                <option value="Gato">Gato</option>
              </select>
            </div>

            {/* Sexo */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Sexo</label>
              <select
                className="form-select"
                value={sexFilter}
                onChange={(e) => setSexFilter(e.target.value as any)}
              >
                <option value="Todos">Ambos os Sexos</option>
                <option value="Macho">Macho</option>
                <option value="Fêmea">Fêmea</option>
              </select>
            </div>

            {/* Idade */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Faixa Etária</label>
              <select
                className="form-select"
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value as any)}
              >
                <option value="Todos">Todas as Idades</option>
                <option value="Filhote">Filhote (&lt; 1 ano)</option>
                <option value="Jovem">Jovem (1 a 2 anos)</option>
                <option value="Adulto">Adulto (2 a 7 anos)</option>
                <option value="Sênior">Sênior (7+ anos)</option>
              </select>
            </div>

            {/* Cidade */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Cidade</label>
              <select
                className="form-select"
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
              >
                <option value="Todas">Todas as Cidades</option>
                {availableCities.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* ONG */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>ONG Responsável</label>
              <select
                className="form-select"
                value={ongFilter}
                onChange={(e) => setOngFilter(e.target.value)}
              >
                <option value="Todas">Todas as ONGs</option>
                {ongs.map(o => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="form-label" style={{ fontSize: '0.8rem', color: 'var(--c-gray-600)' }}>Status</label>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
              >
                <option value="Disponível">Apenas Disponíveis</option>
                <option value="Em processo de adoção">Em processo de adoção</option>
                <option value="Adotado">Adotados (Histórico)</option>
                <option value="Todos">Todos os Status</option>
              </select>
            </div>
          </div>
        </div>

        {/* Results Counter and Summary */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.95rem', color: 'var(--c-black-800)', fontWeight: 600 }}>
            Mostrando <strong>{filteredPets.length}</strong> {filteredPets.length === 1 ? 'animal encontrado' : 'animais encontrados'}
          </div>

          <div style={{ fontSize: '0.82rem', color: 'var(--c-gray-600)' }}>
            * Todos os animais possuem vacinação e castração registradas
          </div>
        </div>

        {/* Pet Cards Grid */}
        {filteredPets.length === 0 ? (
          <div style={{
            backgroundColor: 'var(--c-white)',
            borderRadius: 'var(--r-xl)',
            padding: '56px 20px',
            textAlign: 'center',
            border: '1.5px dashed var(--c-sand-300)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--c-sand-100)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--c-gray-600)',
              margin: '0 auto 16px'
            }}>
              <Search size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--c-black-900)', marginBottom: '8px' }}>
              Nenhum pet encontrado com os filtros selecionados
            </h3>
            <p style={{ color: 'var(--c-gray-600)', fontSize: '0.95rem', marginBottom: '24px' }}>
              Tente redefinir os filtros ou buscar por outra cidade ou espécie.
            </p>
            <button onClick={resetFilters} className="btn btn-earth">
              Ver todos os animais disponíveis
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '28px'
          }}>
            {filteredPets.map((pet) => (
              <div key={pet.id} className="card pet-card">
                <div className="pet-card-image-wrap">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  
                  {/* Top species badge */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <span className="badge badge-white">
                      {pet.species}
                    </span>
                    <span className={`badge ${
                      pet.status === 'Disponível' ? 'badge-confirmed' :
                      pet.status === 'Em processo de adoção' ? 'badge-active' : 'badge-expired'
                    }`} style={{ fontSize: '0.72rem' }}>
                      {pet.status}
                    </span>
                  </div>

                  {/* Top sex badge */}
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span className="badge badge-earth" style={{ fontSize: '0.72rem' }}>
                      {pet.sex}
                    </span>
                  </div>
                </div>

                <div className="pet-card-content">
                  <div className="pet-card-header">
                    <h3 className="pet-card-title">{pet.name}</h3>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--c-brown-700)' }}>
                      {pet.age}
                    </span>
                  </div>

                  <div className="pet-card-subtitle">
                    <span>{pet.breed}</span>
                    <span>•</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <MapPin size={13} color="var(--c-brown-600)" />
                      {pet.city} - {pet.state}
                    </span>
                  </div>

                  {/* Personality preview tags */}
                  <div className="pet-tags">
                    {pet.personality.slice(0, 3).map((t, idx) => (
                      <span key={idx} className="pet-tag">{t}</span>
                    ))}
                  </div>

                  {/* Responsible NGO */}
                  <div style={{
                    fontSize: '0.82rem',
                    color: 'var(--c-gray-600)',
                    marginBottom: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <Building2 size={14} color="var(--c-brown-600)" />
                    <span>ONG: <strong style={{ color: 'var(--c-black-900)' }}>{pet.ongName}</strong></span>
                  </div>

                  <div className="pet-card-footer">
                    <button
                      onClick={() => onSelectPet(pet)}
                      className="btn btn-outline"
                      style={{ width: '100%', padding: '11px', fontWeight: 700 }}
                    >
                      <span>Ver detalhes</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

