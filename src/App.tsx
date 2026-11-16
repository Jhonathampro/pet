import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataStore, errorMessage } from './data/store';
import type { Pet, ONG, AbandonmentReport, FoodBankItem } from './types';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ChatBot } from './components/ChatBot';

// Modals
import { PetDetailsModal } from './components/Modals/PetDetailsModal';
import { AdoptionInterestModal } from './components/Modals/AdoptionInterestModal';
import { LoginRequiredModal } from './components/Modals/LoginRequiredModal';
import { AuthoritiesModal } from './components/Modals/AuthoritiesModal';
import { FinancialDonateModal } from './components/Modals/FinancialDonateModal';
import { DonateFoodModal, RequestFoodModal } from './components/Modals/FoodBankModals';
import { AddPetModal } from './components/Modals/AddPetModal';
import { CorroborateModal } from './components/Modals/CorroborateModal';
import { VaccinationModal } from './components/Modals/VaccinationModal';

// Pages
import { Home } from './pages/Home';
import { AdoptionPage } from './pages/AdoptionPage';
import { NGOsPage } from './pages/NGOsPage';
import { NGOProfilePage } from './pages/NGOProfilePage';
import { ReportAbandonmentPage } from './pages/ReportAbandonmentPage';
import { AbandonmentMapPage } from './pages/AbandonmentMapPage';
import { FoodBankPage } from './pages/FoodBankPage';
import { FinancialDonationsPage } from './pages/FinancialDonationsPage';
import { UserDashboard } from './pages/UserDashboard';
import { NGODashboard } from './pages/NGODashboard';
import { LoginPage } from './pages/LoginPage';

function MainApp() {
  const { isONG, user } = useAuth();

  // Carga inicial dos dados da API
  const [loaded, setLoaded] = useState(false);
  const [loadError, setLoadError] = useState('');

  // Navigation State
  const [currentTab, setCurrentTab] = useState<string>('home');

  // Entities loaded from DataStore
  const [pets, setPets] = useState<Pet[]>(() => DataStore.getPets());
  const [ongs, setONGs] = useState<ONG[]>(() => DataStore.getONGs());
  const [reports, setReports] = useState<AbandonmentReport[]>(() => DataStore.getReports());
  const [foodItems, setFoodItems] = useState<FoodBankItem[]>(() => DataStore.getFoodItems());

  // Modals state
  const [detailsPet, setDetailsPet] = useState<Pet | null>(null);
  const [interestPet, setInterestPet] = useState<Pet | null>(null);
  const [loginRequiredOpen, setLoginRequiredOpen] = useState(false);
  const [donateONG, setDonateONG] = useState<ONG | null>(null);
  const [profileONG, setProfileONG] = useState<ONG | null>(null);
  const [vaccinationONG, setVaccinationONG] = useState<ONG | null>(null);
  const [corroborateReport, setCorroborateReport] = useState<AbandonmentReport | null>(null);
  const [authoritiesModalOpen, setAuthoritiesModalOpen] = useState(false);
  const [authoritiesReportInfo, setAuthoritiesReportInfo] = useState<{ address: string; neighborhood: string; city: string; date: string } | undefined>(undefined);

  // Food Bank Modals
  const [donateFoodOpen, setDonateFoodOpen] = useState(false);
  const [donateFoodTarget, setDonateFoodTarget] = useState<FoodBankItem | null>(null);
  const [requestFoodOpen, setRequestFoodOpen] = useState(false);
  const [requestFoodTarget, setRequestFoodTarget] = useState<FoodBankItem | null>(null);

  // ONG Pet Modal
  const [addPetOpen, setAddPetOpen] = useState(false);
  const [petToEdit, setPetToEdit] = useState<Pet | null>(null);

  // Busca os dados na API e atualiza a tela
  const refreshData = async () => {
    try {
      await DataStore.load();
      setLoadError('');
    } catch (err) {
      setLoadError(errorMessage(err));
    }
    setPets(DataStore.getPets());
    setONGs(DataStore.getONGs());
    setReports(DataStore.getReports());
    setFoodItems(DataStore.getFoodItems());
    setLoaded(true);
  };

  // recarrega ao trocar de aba e ao entrar/sair de uma conta
  useEffect(() => {
    refreshData();
  }, [currentTab, user?.id]);

  // Handle navigation — bloqueia rotas de usuário para ONG e vice-versa
  const handleNavigate = (tab: string, meta?: any) => {
    // Rotas exclusivas de usuário: redireciona ONG ao dashboard
    const ongBlockedRoutes = ['adotar', 'ongs', 'doacoes', 'banco-racao', 'dashboard-usuario'];
    if (isONG && ongBlockedRoutes.includes(tab)) {
      setCurrentTab('dashboard-ong');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    // Rota exclusiva de ONG: redireciona usuário ao home
    if (!isONG && tab === 'dashboard-ong') {
      setCurrentTab('dashboard-usuario');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (tab === 'ong-profile' && meta) {
      const found = ongs.find(o => o.id === meta);
      if (found) {
        setProfileONG(found);
      }
    }
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectPet = (pet: Pet) => {
    setDetailsPet(pet);
  };

  const handleOpenInterest = (pet: Pet) => {
    setInterestPet(pet);
  };

  const handleSelectONG = (ong: ONG) => {
    setProfileONG(ong);
    setCurrentTab('ong-profile');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenAuthoritiesModal = (report?: AbandonmentReport) => {
    if (report) {
      setAuthoritiesReportInfo({
        address: report.address,
        neighborhood: report.neighborhood,
        city: report.city,
        date: report.date
      });
    } else {
      setAuthoritiesReportInfo(undefined);
    }
    setAuthoritiesModalOpen(true);
  };

  // Antes da primeira resposta da API (ou se ela estiver fora do ar) não há o que mostrar
  if (!loaded || (loadError && ongs.length === 0)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', padding: '24px', textAlign: 'center' }}>
        <p>{loadError || 'Carregando...'}</p>
        {loadError && (
          <button className="btn btn-primary" onClick={() => refreshData()}>
            Tentar novamente
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenAddPetModal={() => {
          setPetToEdit(null);
          setAddPetOpen(true);
        }}
      />

      {/* Main Page Routing */}
      <main style={{ flex: 1 }}>
        {/* / - Home */}
        {currentTab === 'home' && (
          <Home
            pets={pets}
            ongs={ongs}
            onNavigate={handleNavigate}
            onSelectPet={handleSelectPet}
            onOpenAddPetModal={() => {
              setPetToEdit(null);
              setAddPetOpen(true);
            }}
          />
        )}

        {/* /adotar - Animais disponíveis (apenas usuário/visitante) */}
        {currentTab === 'adotar' && !isONG && (
          <AdoptionPage
            pets={pets}
            ongs={ongs}
            onSelectPet={handleSelectPet}
            onNavigateToONG={(ongId) => handleNavigate('ong-profile', ongId)}
          />
        )}

        {/* /ongs - Lista de ONGs (apenas usuário/visitante) */}
        {currentTab === 'ongs' && !isONG && (
          <NGOsPage
            ongs={ongs}
            pets={pets}
            onSelectONG={handleSelectONG}
            onOpenFinancialDonate={(ong) => setDonateONG(ong)}
          />
        )}

        {/* /ongs/:id - Perfil da ONG */}
        {currentTab === 'ong-profile' && (
          <NGOProfilePage
            ong={profileONG || ongs[0]}
            pets={pets}
            onBack={() => setCurrentTab('ongs')}
            onSelectPet={handleSelectPet}
            onOpenFinancialDonate={(ong) => setDonateONG(ong)}
            onOpenVaccinationModal={(ong) => setVaccinationONG(ong)}
          />
        )}

        {/* /denunciar - Denunciar abandono */}
        {currentTab === 'denunciar' && (
          <ReportAbandonmentPage
            onSuccessNavigateToMap={() => {
              refreshData();
              handleNavigate('mapa');
            }}
            onOpenAuthoritiesModal={() => handleOpenAuthoritiesModal()}
          />
        )}

        {/* /abandono - Mapa de abandonos */}
        {currentTab === 'mapa' && (
          <AbandonmentMapPage
            reports={reports}
            onOpenReportForm={() => handleNavigate('denunciar')}
            onOpenCorroborate={(report) => setCorroborateReport(report)}
            onOpenAuthoritiesModal={(report) => handleOpenAuthoritiesModal(report)}
          />
        )}

        {/* /racao - Banco de ração */}
        {currentTab === 'banco-racao' && (
          <FoodBankPage
            items={foodItems}
            onOpenDonateModal={(target) => {
              setDonateFoodTarget(target || null);
              setDonateFoodOpen(true);
            }}
            onOpenRequestModal={(target) => {
              setRequestFoodTarget(target || null);
              setRequestFoodOpen(true);
            }}
          />
        )}

        {/* /doacoes - Doações (apenas usuário/visitante) */}
        {currentTab === 'doacoes' && !isONG && (
          <FinancialDonationsPage
            ongs={ongs}
            onOpenFinancialDonate={(ong) => setDonateONG(ong)}
          />
        )}

        {/* /dashboard - Dashboard do usuário (apenas usuário logado) */}
        {currentTab === 'dashboard-usuario' && !isONG && (
          <UserDashboard
            onNavigate={handleNavigate}
            onOpenReportModal={() => handleNavigate('denunciar')}
          />
        )}

        {/* /ong/dashboard - Dashboard da ONG (apenas ONG logada) */}
        {(currentTab === 'dashboard-ong' || currentTab === 'ong-animais' || currentTab === 'ong-novo-animal') && isONG && (
          <NGODashboard
            initialTab={currentTab === 'ong-animais' ? 'animals' : 'animals'}
            onOpenAddPetModal={() => {
              setPetToEdit(null);
              setAddPetOpen(true);
            }}
            onOpenEditPetModal={(pet) => {
              setPetToEdit(pet);
              setAddPetOpen(true);
            }}
            onSelectPet={handleSelectPet}
            onRefresh={refreshData}
          />
        )}

        {/* /login - Login mockado */}
        {currentTab === 'login' && (
          <LoginPage
            onSuccessNavigate={(loggedRole) => {
              if (loggedRole === 'ong') {
                handleNavigate('dashboard-ong');
              } else if (loggedRole === 'user') {
                handleNavigate('dashboard-usuario');
              } else {
                handleNavigate('home');
              }
            }}
            onNavigateHome={() => handleNavigate('home')}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Assistente virtual (chatbot) */}
      <ChatBot
        pets={pets}
        ongs={ongs}
        reports={reports}
        foodItems={foodItems}
        onNavigate={handleNavigate}
        onSelectPet={handleSelectPet}
        onSelectONG={handleSelectONG}
        onOpenAuthorities={() => handleOpenAuthoritiesModal()}
      />

      {/* ===================== GLOBAL MODALS ===================== */}
      {/* 1. Pet Details Modal */}
      <PetDetailsModal
        isOpen={!!detailsPet}
        onClose={() => setDetailsPet(null)}
        pet={detailsPet}
        ong={detailsPet ? ongs.find(o => o.id === detailsPet.ongId) : null}
        onOpenInterest={handleOpenInterest}
        onRequireLogin={() => {
          setDetailsPet(null);
          setLoginRequiredOpen(true);
        }}
        onViewONG={(ongId) => handleNavigate('ong-profile', ongId)}
      />

      {/* 2. Login Required Modal (When visitor clicks "Tenho interesse em adotar") */}
      <LoginRequiredModal
        isOpen={loginRequiredOpen}
        onClose={() => setLoginRequiredOpen(false)}
        onGoToLogin={() => {
          setLoginRequiredOpen(false);
          handleNavigate('login');
        }}
      />

      {/* 3. Adoption Interest Form Modal (somente para usuário logado, nunca ONG) */}
      <AdoptionInterestModal
        isOpen={!!interestPet && !isONG}
        onClose={() => setInterestPet(null)}
        pet={interestPet}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 4. Financial Donation Modal (somente usuário, nunca ONG) */}
      <FinancialDonateModal
        isOpen={!!donateONG && !isONG}
        onClose={() => setDonateONG(null)}
        ong={donateONG}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 5. Authorities Informative Modal */}
      <AuthoritiesModal
        isOpen={authoritiesModalOpen}
        onClose={() => setAuthoritiesModalOpen(false)}
        reportInfo={authoritiesReportInfo}
      />

      {/* 6. Food Bank Donate Modal */}
      <DonateFoodModal
        isOpen={donateFoodOpen}
        onClose={() => {
          setDonateFoodOpen(false);
          setDonateFoodTarget(null);
        }}
        targetItem={donateFoodTarget}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 7. Food Bank Request Modal */}
      <RequestFoodModal
        isOpen={requestFoodOpen}
        onClose={() => {
          setRequestFoodOpen(false);
          setRequestFoodTarget(null);
        }}
        targetItem={requestFoodTarget}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 8. ONG Add/Edit Pet Modal */}
      <AddPetModal
        isOpen={addPetOpen}
        onClose={() => {
          setAddPetOpen(false);
          setPetToEdit(null);
        }}
        petToEdit={petToEdit}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 9. Corroborate Report Modal (3-month rule reinforcement) */}
      <CorroborateModal
        isOpen={!!corroborateReport}
        onClose={() => setCorroborateReport(null)}
        report={corroborateReport}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 10. Dog Vaccination Request Modal */}
      <VaccinationModal
        isOpen={!!vaccinationONG}
        onClose={() => setVaccinationONG(null)}
        ong={vaccinationONG}
        onSuccess={() => {
          refreshData();
        }}
      />
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
