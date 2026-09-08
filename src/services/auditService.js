// src/services/auditService.js
import { mockOpportunities } from '../data/mockData';

const STORAGE_KEY = 'auditLogs';
const eventTarget = new EventTarget();

export const INITIAL_AUDIT_LOGS = [];

export function normalizePriorityCase(val) {
  if (!val) return 'Medium';
  const str = String(val).trim().toUpperCase();
  if (str === 'HIGH') return 'High';
  if (str === 'MEDIUM') return 'Medium';
  if (str === 'LOW') return 'Low';
  return val.charAt(0).toUpperCase() + val.slice(1).toLowerCase();
}

export function formatAuditTime(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '10:30 AM';
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

export function formatAuditDate(dateInput = new Date()) {
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (Number.isNaN(d.getTime())) return '08-Sep-2026';
  const day = String(d.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function parseAuditDate(value, record = {}) {
  if (record && record.createdAt) {
    const time = new Date(record.createdAt).getTime();
    if (!Number.isNaN(time)) return time;
  }

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

    // Format: 08-Sep-2026
    const dmyMatch = value.match(/(\d{1,2})-(\w{3})-(\d{4})/);
    if (dmyMatch) {
      const [, day, month, year] = dmyMatch;
      const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
      return new Date(Number(year), monthIndex, Number(day)).getTime();
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

export function normalizeAuditRecord(record) {
  const id = record.id || `AUD-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`;
  const date = record.date || formatAuditDate(record.createdAt || new Date());
  const timestamp = record.timestamp || formatAuditTime(record.createdAt || new Date());
  const user = record.user || record.userName || 'Admin';
  const action = record.action || 'Priority Assigned';
  const opportunity = record.opportunity || record.opportunityTitle || record.recordName || 'Untitled opportunity';
  const opportunityId = record.opportunityId || record.recordId || 'OPP-001';
  
  let change = record.change;
  if (!change) {
    if (record.previousPriority && record.newPriority && record.previousPriority !== record.newPriority) {
      change = `${normalizePriorityCase(record.previousPriority)} → ${normalizePriorityCase(record.newPriority)}`;
    } else if (record.newPriority) {
      change = normalizePriorityCase(record.newPriority);
    } else if (record.priority) {
      change = normalizePriorityCase(record.priority);
    } else {
      change = 'Medium';
    }
  }

  const priority = (record.priority || record.newPriority || (change.includes('→') ? change.split('→')[1] : change) || 'MEDIUM').toString().trim().toUpperCase();

  return {
    ...record,
    id,
    timestamp,
    date,
    user,
    userName: user,
    action,
    opportunity,
    opportunityTitle: opportunity,
    recordName: opportunity,
    opportunityId,
    recordId: opportunityId,
    change,
    priority,
    previousPriority: record.previousPriority || record.previousValue || null,
    newPriority: record.newPriority || record.newValue || (change.includes('→') ? change.split('→')[1].trim() : change),
    previousValue: record.previousValue || record.previousPriority || null,
    newValue: record.newValue || record.newPriority || (change.includes('→') ? change.split('→')[1].trim() : change),
    details: record.details || (change.includes('→') ? `Priority changed: ${change}` : `Priority: ${change}`),
    createdAt: record.createdAt || new Date().toISOString()
  };
}

function getStoredOpportunities() {
  try {
    const raw = localStorage.getItem('iot_opportunities');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    // fallback
  }
  return mockOpportunities;
}

function generateInitialOpportunityLogs() {
  const opps = getStoredOpportunities();
  const times = ['10:30 AM', '11:15 AM', '11:45 AM', '12:30 PM', '02:00 PM', '02:45 PM', '03:15 PM', '04:00 PM'];
  
  return opps.map((opp, index) => {
    const p = normalizePriorityCase(opp.priority || 'Medium');
    const time = times[index % times.length];
    return normalizeAuditRecord({
      id: `AUD-${opp.id}-INIT`,
      opportunityId: opp.id,
      opportunity: opp.name || opp.title || `Opportunity ${opp.id}`,
      user: opp.auditTrail?.[0]?.actor || 'Admin',
      userRole: opp.auditTrail?.[0]?.role || 'Admin',
      action: 'Opportunity Registered',
      timestamp: time,
      date: '08-Sep-2026',
      change: p,
      priority: p.toUpperCase(),
      previousPriority: null,
      newPriority: p,
      details: `Initial system prediction: ${p}`,
      createdAt: new Date(2026, 8, 8, 10, 30 + index * 15).toISOString()
    });
  });
}

function parseLogs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.map(normalizeAuditRecord) : [];
  } catch (e) {
    console.warn('Failed to parse audit logs:', e);
    return [];
  }
}

function saveLogs(logs) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
    eventTarget.dispatchEvent(new CustomEvent('auditChange', { detail: logs }));
  } catch (e) {
    console.error('Failed to save audit logs:', e);
  }
}

function ensureSeedData() {
  const existingRaw = localStorage.getItem(STORAGE_KEY);
  if (!existingRaw) {
    const initial = generateInitialOpportunityLogs();
    saveLogs(initial);
  } else {
    // Make sure all existing opportunities are represented in auditLogs
    const existing = parseLogs();
    const opps = getStoredOpportunities();
    const missingOpps = opps.filter(opp => !existing.some(log => log.opportunityId === opp.id));
    if (missingOpps.length > 0) {
      const newSeed = missingOpps.map((opp, index) => {
        const p = normalizePriorityCase(opp.priority || 'Medium');
        return normalizeAuditRecord({
          id: `AUD-${opp.id}-INIT`,
          opportunityId: opp.id,
          opportunity: opp.name || opp.title,
          user: 'Admin',
          userRole: 'Admin',
          action: 'Opportunity Registered',
          timestamp: '10:30 AM',
          date: '08-Sep-2026',
          change: p,
          priority: p.toUpperCase(),
          previousPriority: null,
          newPriority: p,
          details: `Initial system prediction: ${p}`,
          createdAt: new Date().toISOString()
        });
      });
      saveLogs([...existing, ...newSeed]);
    }
  }
}

export function logAuditEvent(event) {
  const logs = parseLogs();
  const newEvent = normalizeAuditRecord({
    ...event,
    timestamp: event.timestamp || formatAuditTime(),
    date: event.date || formatAuditDate(),
    createdAt: event.createdAt || new Date().toISOString()
  });
  logs.unshift(newEvent);
  saveLogs(logs);
  return newEvent;
}

export function addAuditLog(record) {
  return logAuditEvent(record);
}

export function recordPriorityChange({
  opportunityId,
  opportunityName,
  previousPriority,
  newPriority,
  user = 'Admin',
  userRole = 'Admin'
}) {
  const prevNorm = normalizePriorityCase(previousPriority);
  const newNorm = normalizePriorityCase(newPriority);

  // If priority has not changed, do not create an unnecessary audit record (Req 6)
  if (prevNorm.toLowerCase() === newNorm.toLowerCase()) {
    return null;
  }

  const now = new Date();
  const dateStr = formatAuditDate(now);
  const timeStr = formatAuditTime(now);

  const newLog = normalizeAuditRecord({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    opportunityId,
    opportunity: opportunityName,
    opportunityTitle: opportunityName,
    recordName: opportunityName,
    recordId: opportunityId,
    user: user || 'Admin',
    userName: user || 'Admin',
    userRole: userRole || 'Admin',
    action: 'Priority Changed',
    previousPriority: prevNorm,
    newPriority: newNorm,
    previousValue: prevNorm,
    newValue: newNorm,
    change: `${prevNorm} → ${newNorm}`,
    priority: newNorm.toUpperCase(),
    date: dateStr,
    timestamp: timeStr,
    createdAt: now.toISOString(),
    details: `Priority changed: ${prevNorm} → ${newNorm}`
  });

  const logs = parseLogs();
  logs.unshift(newLog);
  saveLogs(logs);
  return newLog;
}

export function getAuditLogs() {
  ensureSeedData();
  const logs = parseLogs();
  return [...logs];
}

export function getAuditLogById(id) {
  const logs = getAuditLogs();
  return logs.find((log) => log.id === id) || null;
}

export function deleteAuditLog(id) {
  const logs = parseLogs().filter((log) => log.id !== id);
  saveLogs(logs);
  return true;
}

export function clearAuditLogs() {
  localStorage.removeItem(STORAGE_KEY);
  const fresh = generateInitialOpportunityLogs();
  saveLogs(fresh);
  eventTarget.dispatchEvent(new CustomEvent('auditClear'));
}

export function subscribe(listener) {
  const handler = (e) => listener(e.detail);
  eventTarget.addEventListener('auditChange', handler);
  return () => eventTarget.removeEventListener('auditChange', handler);
}

export function exportAuditLogs(logs = null) {
  const data = Array.isArray(logs) ? logs : getAuditLogs();
  const header = ['Opportunity ID', 'Opportunity', 'User', 'Timestamp', 'Date', 'Change', 'Action', 'Details'];
  const rows = data.map((entry) => [
    entry.opportunityId || '',
    entry.opportunity || '',
    entry.user || '',
    entry.timestamp || '',
    entry.date || '',
    entry.change || '',
    entry.action || '',
    entry.details || ''
  ].map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`));

  const csvContent = [header.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `audit-trail-${formatAuditDate()}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Initial check
ensureSeedData();
