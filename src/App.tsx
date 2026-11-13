import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataStore } from './data/mockData';
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
  const { isLoggedIn, isONG } = useAuth();

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

  const refreshData = () => {
    setPets(DataStore.getPets());
    setONGs(DataStore.getONGs());
    setReports(DataStore.getReports());
    setFoodItems(DataStore.getFoodItems());
  };

  useEffect(() => {
    refreshData();
  }, [currentTab]);

  // Handle navigation
  const handleNavigate = (tab: string, meta?: any) => {
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
          />
        )}

        {/* /adotar - Animais disponíveis */}
        {currentTab === 'adotar' && (
          <AdoptionPage
            pets={pets}
            ongs={ongs}
            onSelectPet={handleSelectPet}
            onNavigateToONG={(ongId) => handleNavigate('ong-profile', ongId)}
          />
        )}

        {/* /ongs - Lista de ONGs */}
        {currentTab === 'ongs' && (
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

        {/* /doacoes - Doações */}
        {currentTab === 'doacoes' && (
          <FinancialDonationsPage
            ongs={ongs}
            onOpenFinancialDonate={(ong) => setDonateONG(ong)}
          />
        )}

        {/* /dashboard - Dashboard do usuário */}
        {currentTab === 'dashboard-usuario' && (
          <UserDashboard
            onNavigate={handleNavigate}
            onOpenReportModal={() => handleNavigate('denunciar')}
          />
        )}

        {/* /ong/dashboard, /ong/animais, /ong/animais/novo - Dashboard da ONG */}
        {(currentTab === 'dashboard-ong' || currentTab === 'ong-animais' || currentTab === 'ong-novo-animal') && (
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

      {/* 3. Adoption Interest Form Modal (Only for logged in user) */}
      <AdoptionInterestModal
        isOpen={!!interestPet}
        onClose={() => setInterestPet(null)}
        pet={interestPet}
        onSuccess={() => {
          refreshData();
        }}
      />

      {/* 4. Financial Donation Modal (PIX & Bank) */}
      <FinancialDonateModal
        isOpen={!!donateONG}
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
