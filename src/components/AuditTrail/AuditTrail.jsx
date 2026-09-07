// src/components/AuditTrail/AuditTrail.jsx

import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuditTrail } from '../../hooks/useApiQueries';
import AuditFilters from './AuditFilters';
import AuditTable from './AuditTable';
import styles from './AuditTrail.module.css';

const AUDIT_TRAIL_STATE_KEY = 'auditTrailState';

const INITIAL_AUDIT_LOGS = [
  { timestamp: '25 Aug · 08:15', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Consultancy Services for Highway Development', opportunityId: 'MA-26-0101', change: 'HIGH' },
  { timestamp: '25 Aug · 09:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Urban Water Resilience Program', opportunityId: 'MA-26-0102', change: 'HIGH' },
  { timestamp: '25 Aug · 10:30', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Nairobi Metropolitan Transport Study', opportunityId: 'MA-26-0103', change: 'HIGH' },
  { timestamp: '25 Aug · 11:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Smart City Digital Command Centre', opportunityId: 'MA-26-0104', change: 'MEDIUM' },
  { timestamp: '25 Aug · 12:30', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Kuala Lumpur Bridge Engineering Services', opportunityId: 'MA-26-0105', change: 'MEDIUM' },
  { timestamp: '25 Aug · 13:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Abu Dhabi Municipal Buildings Program', opportunityId: 'MA-26-0106', change: 'MEDIUM' },
  { timestamp: '25 Aug · 14:30', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Coastal Flood Protection Advisory', opportunityId: 'MA-26-0107', change: 'HIGH' },
  { timestamp: '25 Aug · 15:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Kathmandu Ring Road Expansion', opportunityId: 'MA-26-0108', change: 'HIGH' },
  { timestamp: '25 Aug · 16:30', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Bengaluru Transit Oriented Development', opportunityId: 'MA-26-0109', change: 'HIGH' },
  { timestamp: '25 Aug · 17:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Penang Water Treatment Upgrade', opportunityId: 'MA-26-0110', change: 'MEDIUM' },
  { timestamp: '25 Aug · 18:30', user: 'Arjun Rao', action: 'Opportunity detected', opportunity: 'Mombasa Port Access Road', opportunityId: 'MA-26-0111', change: 'HIGH' },
  { timestamp: '25 Aug · 19:30', user: 'Arjun Rao', action: 'AI score generated', opportunity: 'Dubai Green Buildings Audit', opportunityId: 'MA-26-0112', change: 'LOW' }
];

function parseAuditDate(value) {
  if (!value) return 0;

  const isoMatch = value.match(/(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
  if (isoMatch) {
    const parsed = new Date(`${isoMatch[1]}T${isoMatch[2]}:00`);
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  const textMatch = value.match(/(\d{1,2})\s+(\w{3})\s+·\s*(\d{2}:\d{2})/);
  if (textMatch) {
    const [, day, month, time] = textMatch;
    const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
    const parsed = new Date(new Date().getFullYear(), monthIndex, Number(day), Number(time.split(':')[0]), Number(time.split(':')[1]));
    if (!Number.isNaN(parsed.getTime())) return parsed.getTime();
  }

  return 0;
}

export default function AuditTrail({ searchVal = '', setSearchVal = () => {} }) {
  const { data: rawLogs } = useAuditTrail();
  const logs = Array.isArray(rawLogs) && rawLogs.length ? rawLogs : INITIAL_AUDIT_LOGS;
  const navigate = useNavigate();

  const [selectedUser, setSelectedUser] = useState('All Users');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedDate, setSelectedDate] = useState('All dates');
  const [sortBy, setSortBy] = useState('oldest');

  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(AUDIT_TRAIL_STATE_KEY) || '{}');
      if (saved.selectedUser) setSelectedUser(saved.selectedUser);
      if (saved.selectedAction) setSelectedAction(saved.selectedAction);
      if (saved.selectedPriority) setSelectedPriority(saved.selectedPriority);
      if (saved.selectedDate) setSelectedDate(saved.selectedDate);
      if (saved.sortBy) setSortBy(saved.sortBy);
      if (typeof saved.searchVal === 'string') setSearchVal(saved.searchVal);
    } catch {
      // ignore persisted state parse issues
    }
  }, [setSearchVal]);

  useEffect(() => {
    try {
      sessionStorage.setItem(AUDIT_TRAIL_STATE_KEY, JSON.stringify({
        selectedUser,
        selectedAction,
        selectedPriority,
        selectedDate,
        sortBy,
        searchVal
      }));
    } catch {
      // ignore storage write issues
    }
  }, [selectedUser, selectedAction, selectedPriority, selectedDate, sortBy, searchVal]);

  const users = useMemo(() => ['All Users', ...Array.from(new Set(logs.map((log) => log.user))).filter(Boolean)], [logs]);
  const actions = useMemo(() => ['All Actions', ...Array.from(new Set(logs.map((log) => log.action))).filter(Boolean)], [logs]);
  const priorities = ['All Priorities', 'HIGH', 'MEDIUM', 'LOW'];
  const dateOptions = ['All dates', '25 Aug'];

  const getSearchableValues = (record) => {
    const values = [];

    const collect = (value) => {
      if (value === null || value === undefined) return;
      if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
        values.push(String(value));
        return;
      }
      if (Array.isArray(value)) {
        value.forEach(collect);
        return;
      }
      if (typeof value === 'object') {
        Object.values(value).forEach(collect);
      }
    };

    collect(record);
    return values;
  };

  const filteredRecords = useMemo(() => {
    const term = (searchVal || '').trim().toLowerCase();

    return logs.filter((log) => {
      if (selectedUser !== 'All Users' && log.user !== selectedUser) return false;
      if (selectedAction !== 'All Actions' && log.action !== selectedAction) return false;
      if (selectedPriority !== 'All Priorities' && log.change !== selectedPriority) return false;
      if (selectedDate !== 'All dates' && !log.timestamp.includes(selectedDate)) return false;

      if (term) {
        const matchesSearch = getSearchableValues(log).some((field) =>
          String(field || '').toLowerCase().includes(term)
        );

        if (!matchesSearch) return false;
      }

      return true;
    });
  }, [logs, searchVal, selectedUser, selectedAction, selectedPriority, selectedDate]);

  const sortedRecords = useMemo(() => {
    const copy = [...filteredRecords];

    switch (sortBy) {
      case 'oldest':
        return copy.sort((a, b) => parseAuditDate(a.timestamp) - parseAuditDate(b.timestamp));
      case 'user':
        return copy.sort((a, b) => (a.user || '').localeCompare(b.user || ''));
      case 'action':
        return copy.sort((a, b) => (a.action || '').localeCompare(b.action || ''));
      case 'opportunity':
        return copy.sort((a, b) => (a.opportunity || '').localeCompare(b.opportunity || ''));
      case 'change':
        return copy.sort((a, b) => (a.change || '').localeCompare(b.change || ''));
      case 'newest':
      default:
        return copy.sort((a, b) => parseAuditDate(b.timestamp) - parseAuditDate(a.timestamp));
    }
  }, [filteredRecords, sortBy]);

  const clearAllFilters = () => {
    setSelectedUser('All Users');
    setSelectedAction('All Actions');
    setSelectedPriority('All Priorities');
    setSelectedDate('All dates');
    setSortBy('oldest');
    setSearchVal('');
  };

  const hasActiveFilters =
    selectedUser !== 'All Users' ||
    selectedAction !== 'All Actions' ||
    selectedPriority !== 'All Priorities' ||
    selectedDate !== 'All dates' ||
    sortBy !== 'oldest' ||
    (searchVal || '').trim() !== '';

  return (
    <div className={styles.page}>
      <div className={styles.headerSection}>
        <h1 className={styles.title}>Audit trail</h1>
        <p className={styles.subtitle}>A clear record of the decisions and changes that shape your pipeline.</p>
      </div>

      <AuditFilters
        users={users}
        actions={actions}
        priorities={priorities}
        dateOptions={dateOptions}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        selectedAction={selectedAction}
        setSelectedAction={setSelectedAction}
        selectedPriority={selectedPriority}
        setSelectedPriority={setSelectedPriority}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        sortBy={sortBy}
        setSortBy={setSortBy}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={hasActiveFilters}
        searchVal={searchVal}
        setSearchVal={setSearchVal}
      />

      <section className={styles.tableWrapper}>
        {sortedRecords.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>No audit records found</p>
            <p className={styles.emptyHint}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <AuditTable logs={sortedRecords} onRowClick={(log) => navigate(`/audit/details/${log.id}`)} />
        )}
      </section>
    </div>
  );
}
