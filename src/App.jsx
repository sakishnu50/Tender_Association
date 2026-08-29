import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
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
import AuditTrailView from './views/AuditTrailView';
import SettingsView from './views/SettingsView';
import LoginPageView from './views/LoginPageView';

import { mockOpportunities } from './data/mockData';
import { usePursueOpportunity, useDeclineOpportunity } from './hooks/useApiQueries';

export default function App() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [isPursueOpen, setIsPursueOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);

  const pursueMutation = usePursueOpportunity();
  const declineMutation = useDeclineOpportunity();

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
    setSelectedOpp(opp || mockOpportunities[0]);
    setActiveTab('opp_details');
    navigate('/opportunities/details');
  };

  const titlesMap = {
    dashboard: 'Dashboard',
    opportunities: 'Opportunities List',
    opp_details: 'Opportunity Details',
    alerts: 'Alerts & Priority Notifications',
    calendar: 'Bid Calendar',
    consortium: 'Consortium Recommendations',
    reports: 'Reports & Analytics',
    sources: 'Monitored Sources',
    offices: 'Offices Overview',
    users: 'Users & Roles',
    audit: 'Audit Trail',
    settings: 'Settings',
    login: 'Login Page'
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace Area */}
      <div className="main-content">
        <Header
          searchVal={searchVal}
          setSearchVal={setSearchVal}
          activeTabTitle={titlesMap[activeTab]}
          darkMode={darkMode}
          toggleTheme={toggleTheme}
        />

        {/* Declarative View Router */}
        <Routes>
          <Route
            path="/"
            element={
              <DashboardView
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
            element={<OpportunitiesListView onSelectOpportunity={handleSelectOpportunity} />}
          />
          <Route
            path="/opportunities/details"
            element={
              <OpportunityDetailsView
                opportunity={selectedOpp || mockOpportunities[0]}
                onBack={() => {
                  setActiveTab('opportunities');
                  navigate('/opportunities');
                }}
                onOpenPursue={() => setIsPursueOpen(true)}
                onOpenDecline={() => setIsDeclineOpen(true)}
              />
            }
          />
          <Route
            path="/alerts"
            element={<AlertsView onSelectProject={() => handleSelectOpportunity(mockOpportunities[0])} />}
          />
          <Route path="/calendar" element={<BidCalendarView searchVal={searchVal} onSelectOpportunity={handleSelectOpportunity} />} />
          <Route path="/consortium" element={<ConsortiumView />} />
          <Route path="/reports" element={<ReportsView />} />
          <Route path="/sources" element={<SourcesView />} />
          <Route path="/offices" element={<OfficesView />} />
          <Route path="/users" element={<UsersRolesView />} />
          <Route path="/audit" element={<AuditTrailView />} />
          <Route path="/settings" element={<SettingsView darkMode={darkMode} toggleTheme={toggleTheme} />} />
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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Decision Modals */}
      <PursueModal
        isOpen={isPursueOpen}
        onClose={() => setIsPursueOpen(false)}
        onConfirm={async () => {
          const currentId = selectedOpp ? selectedOpp.id : 'OPP-001';
          await pursueMutation.mutateAsync({ id: currentId, details: { priority: 'High' } });
          alert('Opportunity marked as PURSUED!');
          setIsPursueOpen(false);
        }}
      />

      <DeclineModal
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        onConfirm={async () => {
          const currentId = selectedOpp ? selectedOpp.id : 'OPP-001';
          await declineMutation.mutateAsync({ id: currentId, details: { reason: 'Budget Constraints' } });
          alert('Opportunity DECLINED.');
          setIsDeclineOpen(false);
        }}
      />
    </div>
  );
}
