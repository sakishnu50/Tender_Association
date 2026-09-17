// src/data/mockAuditLogs.js
// Generated mock audit log entries for the Audit Trail view

export const mockAuditLogs = [
  {
    id: 'audit-001',
    timestamp: '2026-08-20T09:15:23Z',
    user: 'Ravi Kumar',
    action: 'CREATE',
    entity: 'Opportunity',
    recordId: 'OPP-001',
    summary: 'Created new opportunity Urban Infrastructure Development',
    description: 'Opportunity created with initial details and assigned to Ravi Kumar.',
    ipAddress: '192.168.1.10',
    userAgent: 'Chrome/124.0.0.0'
  },
  {
    id: 'audit-002',
    timestamp: '2026-08-21T11:42:07Z',
    user: 'Arun Singh',
    action: 'UPDATE',
    entity: 'Opportunity',
    recordId: 'OPP-002',
    summary: 'Updated status of opportunity Highway Development Project',
    description: 'Status changed to Pursued after review.',
    ipAddress: '192.168.1.11',
    userAgent: 'Firefox/123.0'
  },
  {
    id: 'audit-003',
    timestamp: '2026-08-22T14:08:55Z',
    user: 'Priya Nair',
    action: 'DELETE',
    entity: 'User',
    recordId: 'USR-005',
    summary: 'Deleted user Meena Iyer',
    description: 'User removed due to inactivity.',
    ipAddress: '192.168.1.12',
    userAgent: 'Edge/122.0'
  }
];
