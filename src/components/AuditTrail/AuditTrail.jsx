// src/components/AuditTrail/AuditTrail.jsx

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';
import { useAuditTrail, useOpportunities, useUpdateOpportunityPriority } from '../../hooks/useApiQueries';
import { useAuth } from '../../context/AuthContext';
import { recordPriorityChange, parseAuditDate, normalizePriorityCase, subscribe } from '../../services/auditService';
import AuditFilters from './AuditFilters';
import AuditTable from './AuditTable';
import EditPriorityModal from './EditPriorityModal';
import styles from './AuditTrail.module.css';

const AUDIT_TRAIL_STATE_KEY = 'auditTrailState';

export default function AuditTrail({ searchVal = '', setSearchVal = () => {} }) {
  const { data: rawLogs, refetch: refetchAuditLogs } = useAuditTrail();
  const { data: opportunitiesList = [] } = useOpportunities();
  const updatePriorityMutation = useUpdateOpportunityPriority();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [localLogs, setLocalLogs] = useState([]);
  const [selectedUser, setSelectedUser] = useState('All Users');
  const [selectedAction, setSelectedAction] = useState('All Actions');
  const [selectedPriority, setSelectedPriority] = useState('All Priorities');
  const [selectedDate, setSelectedDate] = useState('All dates');
  const [sortBy, setSortBy] = useState('newest');

  // Edit Priority Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // Success Notification State
  const [notification, setNotification] = useState(null);

  // Listen for audit logs updates from auditService
  useEffect(() => {
    const unsubscribe = subscribe((updatedLogs) => {
      if (Array.isArray(updatedLogs)) {
        setLocalLogs(updatedLogs);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (Array.isArray(rawLogs) && rawLogs.length) {
      setLocalLogs(rawLogs);
    }
  }, [rawLogs]);

  const logs = localLogs.length ? localLogs : (Array.isArray(rawLogs) ? rawLogs : []);

  // Restore persistent filter/search/sort state
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
      // ignore parse errors
    }
  }, [setSearchVal]);

  // Persist filter state
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
      // ignore write errors
    }
  }, [selectedUser, selectedAction, selectedPriority, selectedDate, sortBy, searchVal]);

  // Dismiss notification after timeout
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const users = useMemo(() => ['All Users', ...Array.from(new Set(logs.map((log) => log.user))).filter(Boolean)], [logs]);
  const actions = useMemo(() => ['All Actions', ...Array.from(new Set(logs.map((log) => log.action))).filter(Boolean)], [logs]);
  const priorities = ['All Priorities', 'High', 'Medium', 'Low'];

  const dateOptions = useMemo(() => {
    const uniqueDates = Array.from(
      new Set(
        logs.map((log) => log.date || (log.timestamp && log.timestamp.includes('·') ? log.timestamp.split('·')[0].trim() : null))
      )
    ).filter(Boolean);
    return ['All dates', ...uniqueDates];
  }, [logs]);

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

      if (selectedPriority !== 'All Priorities') {
        const changeStr = String(log.change || log.priority || '').toUpperCase();
        const filterStr = selectedPriority.toUpperCase();
        if (!changeStr.includes(filterStr)) return false;
      }

      if (selectedDate !== 'All dates') {
        const matchDate = log.date === selectedDate || (log.timestamp && log.timestamp.includes(selectedDate));
        if (!matchDate) return false;
      }

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
        return copy.sort((a, b) => parseAuditDate(a.timestamp, a) - parseAuditDate(b.timestamp, b));
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
        return copy.sort((a, b) => parseAuditDate(b.timestamp, b) - parseAuditDate(a.timestamp, a));
    }
  }, [filteredRecords, sortBy]);

  const tableRecords = useMemo(() => sortedRecords.map((log) => {
    const opportunity = opportunitiesList.find(
      (item) => item.id === log.opportunityId || item.name === log.opportunity
    );
    const normalizedPriority = normalizePriorityCase(
      opportunity?.priority || log.priority || log.newPriority || 'Medium'
    );
    return {
      ...log,
      currentPriority: ['High', 'Medium', 'Low'].includes(normalizedPriority)
        ? normalizedPriority
        : 'Medium'
    };
  }), [sortedRecords, opportunitiesList]);

  const clearAllFilters = () => {
    setSelectedUser('All Users');
    setSelectedAction('All Actions');
    setSelectedPriority('All Priorities');
    setSelectedDate('All dates');
    setSortBy('newest');
    setSearchVal('');
  };

  const hasActiveFilters =
    selectedUser !== 'All Users' ||
    selectedAction !== 'All Actions' ||
    selectedPriority !== 'All Priorities' ||
    selectedDate !== 'All dates' ||
    sortBy !== 'newest' ||
    (searchVal || '').trim() !== '';

  // Open Edit Priority Modal
  const handleOpenEdit = useCallback((log) => {
    const matchedOpp = opportunitiesList.find(
      (o) => o.id === log.opportunityId || o.name === log.opportunity
    );

    const currentPri = matchedOpp?.priority || log.newPriority || log.priority || 'Medium';

    setEditingOpportunity({
      id: log.opportunityId || matchedOpp?.id || 'OPP-001',
      name: log.opportunity || matchedOpp?.name || 'Opportunity',
      currentPriority: normalizePriorityCase(currentPri)
    });
    setIsEditModalOpen(true);
  }, [opportunitiesList]);

  // Handle Save Priority from Modal
  const handleSavePriority = async ({ opportunityId, opportunityName, previousPriority, newPriority, isChanged }) => {
    setIsEditModalOpen(false);

    // If Admin selects the same priority, do not create an unnecessary audit record (Req 6)
    if (!isChanged) {
      return;
    }

    try {
      // 1. Update opportunity's priority in persistence layer & query cache
      await updatePriorityMutation.mutateAsync({
        id: opportunityId,
        priority: newPriority
      });

      // 2. Record new audit log entry
      const actorName = user?.name || 'Admin';
      const actorRole = user?.role || 'Admin';

      const newRecord = recordPriorityChange({
        opportunityId,
        opportunityName,
        previousPriority,
        newPriority,
        user: actorName,
        userRole: actorRole
      });

      // 3. Refresh audit logs
      if (refetchAuditLogs) {
        await refetchAuditLogs();
      }

      // 4. Show success notification
      setNotification({
        type: 'success',
        message: `Priority updated for ${opportunityId}: ${previousPriority} → ${newPriority}`,
        details: `Audit record saved by ${actorName}`
      });
    } catch (err) {
      console.error('Failed to update priority:', err);
      setNotification({
        type: 'error',
        message: 'Failed to update priority. Please try again.'
      });
    }
  };

  return (
    <div className={styles.page}>
      {/* Toast Notification */}
      {notification && (
        <div className={`${styles.toastNotification} ${notification.type === 'error' ? styles.toastError : styles.toastSuccess}`} role="alert">
          <div className={styles.toastContent}>
            <CheckCircle2 size={18} className={styles.toastIcon} />
            <div>
              <strong className={styles.toastMessage}>{notification.message}</strong>
              {notification.details && <p className={styles.toastDetails}>{notification.details}</p>}
            </div>
          </div>
          <button
            type="button"
            className={styles.toastCloseBtn}
            onClick={() => setNotification(null)}
            aria-label="Dismiss notification"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className={styles.headerSection}>
        <div className={styles.headerFlex}>
          <div>
            <h1 className={styles.title}>Audit Trail</h1>
            <p className={styles.subtitle}>Complete chronological history of opportunity priority decisions and changes.</p>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
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

      {/* Audit Table */}
      <section className={styles.tableWrapper}>
        {tableRecords.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyMessage}>No audit records found</p>
            <p className={styles.emptyHint}>Try adjusting your filters or search terms.</p>
          </div>
        ) : (
          <AuditTable
            logs={tableRecords}
            onRowClick={(log) => navigate(`/audit/details/${log.id}`)}
            onEdit={handleOpenEdit}
          />
        )}
      </section>

      {/* Priority Edit Modal */}
      <EditPriorityModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        opportunity={editingOpportunity}
        currentPriority={editingOpportunity?.currentPriority}
        currentUser={user?.name || user?.role || 'Admin'}
        onSave={handleSavePriority}
      />
    </div>
  );
}
