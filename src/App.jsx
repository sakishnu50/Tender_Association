import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

import DashboardView from './views/DashboardView';
import OpportunitiesListView from './views/OpportunitiesListView';
import OpportunityDetailsView from './views/OpportunityDetailsView';
import { PursueModal, DeclineModal } from './views/PursueModal';
import AlertsView from './views/AlertsView';
import BidCalendarView from './views/BidCalendarView';
import ConsortiumView from './views/ConsortiumView';
import ReportsView from './views/ReportsView';
import SourcesView from './views/SourcesView';
import OfficesView from './views/OfficesView';
import UsersRolesView from './views/UsersRolesView';
import AuditTrail from './components/AuditTrail/AuditTrail.jsx';
import AuditRecordDetailsPage from './components/AuditTrail/AuditRecordDetailsPage.jsx';
import SettingsView from './views/SettingsView';
import LoginPageView from './views/LoginPageView';
import Dashboard from './views/Dashboard';
import ClientProfileView from './views/ClientProfileView';
import LogoutModal from './components/LogoutModal';

import { useAuth } from './context/AuthContext';
import { useOpportunities, usePursueOpportunity, useDeclineOpportunity } from './hooks/useApiQueries';
import { mockClientProfile } from './data/clientProfileData';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const [tabState, setTabState] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [activeProject, setActiveProject] = useState(mockClientProfile.pastProjects[0]);
  const [darkMode, setDarkMode] = useState(false);

  const [isPursueOpen, setIsPursueOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // User-isolated opportunities from React Query
  const { data: userOpportunities = [] } = useOpportunities();
  const pursueMutation = usePursueOpportunity();
  const declineMutation = useDeclineOpportunity();

  // Derive activeTab from current route pathname
  const activeTab = React.useMemo(() => {
    const path = location.pathname;
    if (path.startsWith('/opportunities/details') || (path.startsWith('/opportunities/') && path !== '/opportunities')) {
      return 'opp_details';
    }
    if (path === '/opportunities') return 'opportunities';
    if (path === '/alerts') return 'alerts';
    if (path === '/calendar') return 'calendar';
    if (path === '/consortium') return 'consortium';
    if (path === '/client-profile') return 'client_profile';
    if (path === '/reports') return 'reports';
    if (path === '/sources') return 'sources';
    if (path === '/offices') return 'offices';
    if (path === '/users') return 'users';
    if (path === '/audit') return 'audit';
    if (path === '/settings') return 'settings';
    if (path === '/login') return 'login';
    if (path === '/') return 'dashboard';
    return tabState;
  }, [location.pathname, tabState]);

  const setActiveTab = (tab) => {
    setTabState(tab);
    // Clear search when switching pages so stale queries don’t carry over
    setSearchVal('');
  };

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    if (nextMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleSelectOpportunity = (opp) => {
    const selected = opp || userOpportunities[0] || null;
    setSelectedOpp(selected);
    setActiveTab('opp_details');
    if (selected) {
      navigate(`/opportunities/details?id=${selected.id}`, { state: { id: selected.id } });
    }
  };

  const titlesMap = {
    dashboard: 'Dashboard',
    opportunities: 'Opportunities List',
    opp_details: 'Opportunity Details',
    alerts: 'Alerts & Priority Notifications',
    calendar: 'Bid Calendar',
    consortium: 'Consortium Recommendations',
    client_profile: 'Client Profile Administration',
    reports: 'Reports & Analytics',
    sources: 'Monitored Sources',
    offices: 'Offices Overview',
    users: 'Users & Roles',
    audit: 'Audit Trail',
    settings: 'Settings',
    login: 'Login Page'
  };

  // User-isolated filtered opportunities for global actions
  const filteredOpportunities = React.useMemo(() => {
    if (!userOpportunities || userOpportunities.length === 0) return [];
    if (!searchVal || !searchVal.trim()) return userOpportunities;
    const term = searchVal.trim().toLowerCase();
    return userOpportunities.filter((o) => {
      const name = (o.name || o.title || '').toLowerCase();
      const id = (o.id || '').toLowerCase();
      const source = (o.source || '').toLowerCase();
      const sector = (o.sector || '').toLowerCase();
      const location = (o.location || o.country || '').toLowerCase();
      return name.includes(term) || id.includes(term) || source.includes(term) || sector.includes(term) || location.includes(term);
    });
  }, [userOpportunities, searchVal]);

  // Requirement 3 & 5: If not authenticated, render LoginPageView or redirect to /login
  if (!isAuthenticated) {
    return (
      <Routes>
        <Route
          path="/login"
          element={
            <LoginPageView
              onLoginSuccess={() => {
                setActiveTab('dashboard');
                navigate('/');
              }}
            />
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    if (logout) {
      logout();
    }
    navigate('/login');
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRequestLogout={() => setIsLogoutModalOpen(true)}
        activeProject={activeProject}
      />

      {/* Main Workspace Area */}
      <div className="main-content">
        {/* Global Header — search bar, download, notifications, theme, profile */}
        <Header
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          activeTabTitle={titlesMap[activeTab]}
          activeTab={activeTab}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
          opportunities={userOpportunities}
          filteredOpportunities={filteredOpportunities}
          onRequestLogout={() => setIsLogoutModalOpen(true)}
        />

        {/* Declarative View Router */}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardView
                searchVal={searchVal}
                setSearchVal={setSearchVal}
                onSelectOpportunity={handleSelectOpportunity}
                onViewAll={() => {
                  setActiveTab('opportunities');
                  navigate('/opportunities');
                }}
              />
            }
          />
          <Route
            path="/opportunities"
            element={
              <OpportunitiesListView
                searchVal={searchVal}
                onSelectOpportunity={handleSelectOpportunity}
              />
            }
          />
          <Route
            path="/opportunities/details"
            element={
              <OpportunityDetailsView
                opportunity={selectedOpp || userOpportunities[0]}
                onBack={() => {
                  setActiveTab('opportunities');
                  navigate('/opportunities');
                }}
              />
            }
          />
          <Route
            path="/opportunities/details/:id"
            element={
              <OpportunityDetailsView
                opportunity={selectedOpp}
                onBack={() => {
                  setActiveTab('opportunities');
                  navigate('/opportunities');
                }}
              />
            }
          />
          <Route
            path="/opportunities/:id"
            element={
              <OpportunityDetailsView
                opportunity={selectedOpp}
                onBack={() => {
                  setActiveTab('opportunities');
                  navigate('/opportunities');
                }}
              />
            }
          />
          <Route
            path="/alerts"
            element={
              <AlertsView
                onSelectProject={(alert) => {
                  const opp = userOpportunities.find((o) => o.name === alert?.project) || userOpportunities[0];
                  handleSelectOpportunity(opp);
                }}
              />
            }
          />
          <Route path="/calendar" element={<BidCalendarView searchVal={searchVal} onSelectOpportunity={handleSelectOpportunity} />} />
          <Route path="/consortium" element={<ConsortiumView searchVal={searchVal} />} />
          <Route
            path="/client-profile"
            element={
              <ClientProfileView
                activeProject={activeProject}
                setActiveProject={setActiveProject}
              />
            }
          />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/sources" element={<SourcesView searchVal={searchVal} />} />
          <Route path="/offices" element={<OfficesView searchVal={searchVal} />} />
          <Route path="/users" element={<UsersRolesView searchVal={searchVal} />} />
          <Route path="/audit" element={<AuditTrail searchVal={searchVal} setSearchVal={setSearchVal} />} />
          <Route path="/audit/details/:auditId" element={<AuditRecordDetailsPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<SettingsView darkMode={darkMode} toggleTheme={toggleTheme} />} />
          {/* Requirement 3: If already authenticated and navigating to /login, redirect to / */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Decision Modals */}
      <PursueModal
        isOpen={isPursueOpen}
        onClose={() => setIsPursueOpen(false)}
        onConfirm={async () => {
          const currentId = selectedOpp ? selectedOpp.id : (userOpportunities[0]?.id || 'OPP-001');
          await pursueMutation.mutateAsync({ id: currentId, details: { priority: 'High' } });
          alert('Opportunity marked as PURSUED!');
          setIsPursueOpen(false);
        }}
      />

      <DeclineModal
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        onConfirm={async () => {
          const currentId = selectedOpp ? selectedOpp.id : (userOpportunities[0]?.id || 'OPP-001');
          await declineMutation.mutateAsync({ id: currentId, details: { reason: 'Budget Constraints' } });
          alert('Opportunity DECLINED.');
          setIsDeclineOpen(false);
        }}
      />

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
