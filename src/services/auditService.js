// src/services/auditService.js
import { mockOpportunities, mockAuditTrail } from '../data/mockData';

const STORAGE_KEY = 'auditLogs';
const eventTarget = new EventTarget();

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'AUD-001',
    opportunityId: 'OPP-001',
    opportunity: 'Highway Connectivity Improvement Project',
    user: 'Admin',
    userRole: 'Admin',
    action: 'Priority Assigned',
    timestamp: '12:30 PM',
    date: '01-Sep-2026',
    change: 'HIGH',
    priority: 'HIGH',
    aiScore: 8.5,
    details: 'Opportunity detected and classified as HIGH priority.'
  },
  {
    id: 'AUD-002',
    opportunityId: 'OPP-001',
    opportunity: 'Highway Connectivity Improvement Project',
    user: 'Arun Kumar',
    userRole: 'Manager',
    action: 'Proposal Preparation Started',
    timestamp: '11:35 AM',
    date: '01-Sep-2026',
    change: 'HIGH',
    priority: 'HIGH',
    aiScore: 7.2,
    details: 'Initial proposal work initiated.'
  },
  {
    id: 'AUD-003',
    opportunityId: 'MA-26-0102',
    opportunity: 'Urban Water Resilience Program',
    user: 'AI Engine',
    userRole: 'System',
    action: 'Score Generated',
    timestamp: '10:45 AM',
    date: '01-Sep-2026',
    change: 'HIGH',
    priority: 'HIGH',
    aiScore: 9.1,
    details: 'High relevance tender scored 9.1 / 10.'
  },
  {
    id: 'AUD-004',
    opportunityId: 'OPP-003',
    opportunity: 'Rail Network Modernization',
    user: 'Rajesh Kumar',
    userRole: 'Manager',
    action: 'Decision Updated',
    timestamp: '10:15 AM',
    date: '01-Sep-2026',
    change: 'HIGH',
    priority: 'HIGH',
    aiScore: 6.8,
    details: 'Management decision recorded - PURSUE.'
  },
  {
    id: 'AUD-005',
    opportunityId: 'OPP-001',
    opportunity: 'Highway Connectivity Improvement Project',
    user: 'Priya Sharma',
    userRole: 'Researcher',
    action: 'Status Updated',
    timestamp: '09:42 AM',
    date: '01-Sep-2026',
    change: 'HIGH',
    priority: 'HIGH',
    aiScore: 8.0,
    details: 'Opportunity status moved to Under Review.'
  }
];

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
  const aiScore = record.aiScore !== undefined && record.aiScore !== null
    ? record.aiScore
    : (record.score !== undefined && record.score !== null ? record.score : null);

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
    aiScore,
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
    const rawAll = localStorage.getItem('iot_all_opportunities');
    if (rawAll) {
      const parsed = JSON.parse(rawAll);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
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
      aiScore: opp.aiScore || opp.overallScore || 8.5,
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
    const iotRaw = localStorage.getItem('iot_audit_trail');
    if (iotRaw) {
      try {
        const parsed = JSON.parse(iotRaw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          saveLogs(parsed.map(normalizeAuditRecord));
          return;
        }
      } catch {}
    }
    saveLogs(mockAuditTrail.map(normalizeAuditRecord));
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
  aiScore,
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

  const opps = getStoredOpportunities();
  const targetOpp = opps.find(
    (o) => o.id === opportunityId || o.name === opportunityName || o.title === opportunityName
  );

  let resolvedAiScore = aiScore !== undefined && aiScore !== null
    ? Number(aiScore)
    : (targetOpp?.aiScore ?? targetOpp?.overallScore);

  if (resolvedAiScore === undefined || resolvedAiScore === null || isNaN(resolvedAiScore)) {
    if (opportunityId === 'MA-26-0102') resolvedAiScore = 9.1;
    else if (opportunityId === 'OPP-003') resolvedAiScore = 6.8;
    else if (opportunityId === 'OPP-001') resolvedAiScore = 8.5;
    else if (opportunityId === 'OPP-002') resolvedAiScore = 7.8;
    else if (opportunityId === 'OPP-004') resolvedAiScore = 5.2;
    else resolvedAiScore = 8.5;
  }

  const resolvedName = opportunityName || targetOpp?.name || targetOpp?.title || opportunityId;

  const newLog = normalizeAuditRecord({
    id: `AUD-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    opportunityId,
    opportunity: resolvedName,
    opportunityTitle: resolvedName,
    recordName: resolvedName,
    recordId: opportunityId,
    user: user || 'Admin',
    userName: user || 'Admin',
    userRole: userRole || 'Admin',
    action: 'Priority Changed',
    previousPriority: prevNorm,
    newPriority: newNorm,
    previousValue: prevNorm,
    newValue: newNorm,
    change: `${prevNorm.toUpperCase()} → ${newNorm.toUpperCase()}`,
    priority: newNorm.toUpperCase(),
    currentPriority: newNorm,
    aiScore: resolvedAiScore,
    date: dateStr,
    timestamp: timeStr,
    createdAt: now.toISOString(),
    details: `Priority changed: ${prevNorm} → ${newNorm}`
  });

  const logs = parseLogs();
  const updatedLogs = [newLog, ...logs];
  saveLogs(updatedLogs);

  // Sync to iot_audit_trail in localStorage so apiFacade and useAuditTrail always see it
  try {
    localStorage.setItem('iot_audit_trail', JSON.stringify(updatedLogs));
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('iot_audit_trail_')) {
        try {
          const userLogs = JSON.parse(localStorage.getItem(key) || '[]');
          if (Array.isArray(userLogs)) {
            localStorage.setItem(key, JSON.stringify([newLog, ...userLogs.filter((l) => l.id !== newLog.id)]));
          }
        } catch {}
      }
    }
  } catch (e) {
    console.warn('Failed to sync to iot_audit_trail:', e);
  }

  return newLog;
}

export function getAuditLogs() {
  ensureSeedData();
  const logs = parseLogs();
  return [...logs];
}

export function getAuditLogById(id) {
  const logs = getAuditLogs();
  return (
    logs.find((log) => log.id === id) ||
    INITIAL_AUDIT_LOGS.find((l) => l.id === id) ||
    (mockAuditTrail && mockAuditTrail.find((l) => l.id === id)) ||
    null
  );
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
  const header = ['Opportunity ID', 'Opportunity', 'User', 'Timestamp', 'Date', 'AI Score', 'Priority', 'Action', 'Details'];
  const rows = data.map((entry) => [
    entry.opportunityId || '',
    entry.opportunity || '',
    entry.user || '',
    entry.timestamp || '',
    entry.date || '',
    entry.aiScore ? `${Number(entry.aiScore).toFixed(1)} / 10` : '',
    entry.change || entry.priority || '',
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
