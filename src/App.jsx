import React, { useState } from 'react';
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

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchVal, setSearchVal] = useState('');
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const [isPursueOpen, setIsPursueOpen] = useState(false);
  const [isDeclineOpen, setIsDeclineOpen] = useState(false);

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

        {/* View Router */}
        {activeTab === 'dashboard' && (
          <DashboardView
            onSelectOpportunity={handleSelectOpportunity}
            onViewAll={() => setActiveTab('opportunities')}
          />
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesListView
            onSelectOpportunity={handleSelectOpportunity}
          />
        )}

        {activeTab === 'opp_details' && (
          <OpportunityDetailsView
            opportunity={selectedOpp || mockOpportunities[0]}
            onBack={() => setActiveTab('opportunities')}
            onOpenPursue={() => setIsPursueOpen(true)}
            onOpenDecline={() => setIsDeclineOpen(true)}
          />
        )}

        {activeTab === 'alerts' && (
          <AlertsView
            onSelectProject={() => handleSelectOpportunity(mockOpportunities[0])}
          />
        )}

        {activeTab === 'calendar' && <BidCalendarView />}
        {activeTab === 'consortium' && <ConsortiumView />}
        {activeTab === 'reports' && <ReportsView />}
        {activeTab === 'sources' && <SourcesView />}
        {activeTab === 'offices' && <OfficesView />}
        {activeTab === 'users' && <UsersRolesView />}
        {activeTab === 'audit' && <AuditTrailView />}
        {activeTab === 'settings' && <SettingsView darkMode={darkMode} toggleTheme={toggleTheme} />}

        {activeTab === 'login' && (
          <LoginPageView onLoginSuccess={() => setActiveTab('dashboard')} />
        )}
      </div>

      {/* Decision Modals */}
      <PursueModal
        isOpen={isPursueOpen}
        onClose={() => setIsPursueOpen(false)}
        onConfirm={() => {
          alert('Opportunity marked as PURSUED!');
          setIsPursueOpen(false);
        }}
      />

      <DeclineModal
        isOpen={isDeclineOpen}
        onClose={() => setIsDeclineOpen(false)}
        onConfirm={() => {
          alert('Opportunity DECLINED.');
          setIsDeclineOpen(false);
        }}
      />
    </div>
  );
}
