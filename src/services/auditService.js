// src/services/auditService.js

const STORAGE_KEY = 'auditLogs';
const eventTarget = new EventTarget();

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    timestamp: '25 Aug · 08:15',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Consultancy Services for Highway Development',
    opportunityId: 'MA-26-0101',
    change: 'HIGH'
  },
  {
    id: 'AUD-002',
    timestamp: '25 Aug · 09:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Urban Water Resilience Program',
    opportunityId: 'MA-26-0102',
    change: 'HIGH'
  },
  {
    id: 'AUD-003',
    timestamp: '25 Aug · 10:30',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Nairobi Metropolitan Transport Study',
    opportunityId: 'MA-26-0103',
    change: 'HIGH'
  },
  {
    id: 'AUD-004',
    timestamp: '25 Aug · 11:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Smart City Digital Command Centre',
    opportunityId: 'MA-26-0104',
    change: 'MEDIUM'
  },
  {
    id: 'AUD-005',
    timestamp: '25 Aug · 12:30',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Kuala Lumpur Bridge Engineering Services',
    opportunityId: 'MA-26-0105',
    change: 'MEDIUM'
  },
  {
    id: 'AUD-006',
    timestamp: '25 Aug · 13:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Abu Dhabi Municipal Buildings Program',
    opportunityId: 'MA-26-0106',
    change: 'MEDIUM'
  },
  {
    id: 'AUD-007',
    timestamp: '25 Aug · 14:30',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Coastal Flood Protection Advisory',
    opportunityId: 'MA-26-0107',
    change: 'HIGH'
  },
  {
    id: 'AUD-008',
    timestamp: '25 Aug · 15:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Kathmandu Ring Road Expansion',
    opportunityId: 'MA-26-0108',
    change: 'HIGH'
  },
  {
    id: 'AUD-009',
    timestamp: '25 Aug · 16:30',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Bengaluru Transit Oriented Development',
    opportunityId: 'MA-26-0109',
    change: 'HIGH'
  },
  {
    id: 'AUD-010',
    timestamp: '25 Aug · 17:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Penang Water Treatment Upgrade',
    opportunityId: 'MA-26-0110',
    change: 'MEDIUM'
  },
  {
    id: 'AUD-011',
    timestamp: '25 Aug · 18:30',
    user: 'Arjun Rao',
    action: 'Opportunity detected',
    opportunity: 'Mombasa Port Access Road',
    opportunityId: 'MA-26-0111',
    change: 'HIGH'
  },
  {
    id: 'AUD-012',
    timestamp: '25 Aug · 19:30',
    user: 'Arjun Rao',
    action: 'AI score generated',
    opportunity: 'Dubai Green Buildings Audit',
    opportunityId: 'MA-26-0112',
    change: 'LOW'
  }
];

function parseAuditDate(value) {
  if (!value) return 0;

  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.getTime();
  }

  if (typeof value === 'string') {
    const isoMatch = value.match(/(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
    if (isoMatch) {
      const date = new Date(`${isoMatch[1]}T${isoMatch[2]}:00`);
      if (!Number.isNaN(date.getTime())) return date.getTime();
    }

    const compactMatch = value.match(/(\d{1,2})\s+(\w{3})\s+·\s*(\d{2}:\d{2})/);
    if (compactMatch) {
      const [, day, month, time] = compactMatch;
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
      const date = new Date(new Date().getFullYear(), monthIndex, Number(day), Number(time.split(':')[0]), Number(time.split(':')[1]));
      return date.getTime();
    }
  }

  return 0;
}

function normalizeAuditRecord(record) {
  return {
    id: record.id || `AUD-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    timestamp: record.timestamp || '25 Aug · 00:00',
    user: record.user || record.userName || 'Arjun Rao',
    action: record.action || 'Opportunity detected',
    opportunity: record.opportunity || record.opportunityTitle || record.recordName || 'Untitled opportunity',
    opportunityId: record.opportunityId || record.recordId || 'Unknown',
    change: record.change || record.priority || 'MEDIUM'
  };
}

function parseLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...INITIAL_AUDIT_LOGS];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(normalizeAuditRecord) : [...INITIAL_AUDIT_LOGS];
  } catch (e) {
    console.warn('Failed to parse audit logs:', e);
    return [...INITIAL_AUDIT_LOGS];
  }
}

function saveLogs(logs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
  eventTarget.dispatchEvent(new CustomEvent('auditChange', { detail: logs }));
}

function ensureSeedData() {
  const existing = parseLogs();
  const matchesSeed = existing.length === INITIAL_AUDIT_LOGS.length && existing.every((log, index) => {
    const expected = INITIAL_AUDIT_LOGS[index];
    return log.timestamp === expected.timestamp &&
      log.user === expected.user &&
      log.action === expected.action &&
      log.opportunity === expected.opportunity &&
      log.opportunityId === expected.opportunityId &&
      log.change === expected.change;
  });

  if (!matchesSeed) {
    saveLogs(INITIAL_AUDIT_LOGS.map(normalizeAuditRecord));
  }
}

export function logAuditEvent(event) {
  const logs = parseLogs();
  const newEvent = normalizeAuditRecord({
    ...event,
    timestamp: event.timestamp || new Date().toISOString(),
  });
  logs.unshift(newEvent);
  saveLogs(logs);
  return newEvent;
}

export function getAuditLogs() {
  const logs = parseLogs();
  return [...logs].sort((a, b) => parseAuditDate(a.timestamp) - parseAuditDate(b.timestamp));
}

export function getAuditLogById(id) {
  const logs = parseLogs();
  return logs.find((log) => log.id === id) || null;
}

export function deleteAuditLog(id) {
  const logs = parseLogs().filter((log) => log.id !== id);
  saveLogs(logs);
  return true;
}

export function clearAuditLogs() {
  localStorage.removeItem(STORAGE_KEY);
  saveLogs([...INITIAL_AUDIT_LOGS]);
  eventTarget.dispatchEvent(new CustomEvent('auditClear'));
}

export function subscribe(listener) {
  const handler = (e) => listener(e.detail);
  eventTarget.addEventListener('auditChange', handler);
  return () => eventTarget.removeEventListener('auditChange', handler);
}

export function exportAuditLogs(logs = null) {
  const data = Array.isArray(logs) ? logs : getAuditLogs();
  const header = ['Timestamp', 'User', 'Action', 'Opportunity', 'Opportunity ID', 'Change'];
  const rows = data.map((entry) => [
    entry.timestamp || '',
    entry.user || '',
    entry.action || '',
    entry.opportunity || '',
    entry.opportunityId || '',
    entry.change || ''
  ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`));

  const csvContent = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'audit-trail.csv';
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function seedIfEmpty() {
  ensureSeedData();
}

seedIfEmpty();
