// src/utils/auditLogger.js

import { addLog } from '../services/auditService';

/**
 * Log an audit event.
 * @param {Object} param0 - Event details.
 */
export function logAudit({
  user,
  role,
  action,
  module,
  opportunityId = null,
  opportunityTitle = null,
  details = null,
  previousValue = null,
  newValue = null,
}) {
  const id = crypto.randomUUID?.() || `audit-${Date.now()}`;
  const timestamp = new Date().toISOString();
  const event = {
    id,
    timestamp,
    user,
    role,
    action,
    module,
    opportunityId,
    opportunityTitle,
    details,
    previousValue,
    newValue,
  };
  addLog(event);
}
