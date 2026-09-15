// src/components/AuditTrail/AuditFilters.jsx

import React from 'react';
import styles from './AuditTrail.module.css';

export default function AuditFilters({
  users,
  actions,
  priorities,
  dateOptions,
  selectedUser,
  setSelectedUser,
  selectedAction,
  setSelectedAction,
  selectedPriority,
  setSelectedPriority,
  selectedDate,
  setSelectedDate,
  sortBy,
  setSortBy,
  clearAllFilters,
  hasActiveFilters,
  searchVal,
  setSearchVal,
}) {
  const sortOptions = [
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
    { value: 'user', label: 'User' },
    { value: 'action', label: 'Action' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'change', label: 'Change' }
  ];

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterRow}>
        <input
          className={styles.searchInput}
          placeholder="Search audit trail..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          aria-label="Search audit trail"
        />

        <select
          className={styles.filterSelect}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          aria-label="Filter by date"
        >
          {dateOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className={styles.filterRow}>
        <select
          className={styles.filterSelect}
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
          aria-label="Filter by user"
        >
          {users.map((user) => (
            <option key={user} value={user}>{user}</option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedAction}
          onChange={(e) => setSelectedAction(e.target.value)}
          aria-label="Filter by action"
        >
          {actions.map((action) => (
            <option key={action} value={action}>{action}</option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
          aria-label="Filter by change"
        >
          {priorities.map((priority) => (
            <option key={priority} value={priority}>{priority}</option>
          ))}
        </select>

        <select
          className={styles.filterSelect}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort audit trail"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>

        <button className={styles.clearBtn} onClick={clearAllFilters} disabled={!hasActiveFilters}>
          Clear Filters
        </button>
      </div>
    </div>
  );
}
