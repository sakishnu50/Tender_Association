// src/utils/auditLoggerIntegration.js
// Helper utilities to integrate audit logging throughout the application

import { logAuditEvent } from '../services/auditService';

/**
 * Log an opportunity found event
 */
export const logOpportunityFound = (opportunityId, opportunityTitle, office = 'System', source = 'External Feed') => {
  logAuditEvent({
    user: 'System',
    userName: 'System',
    userRole: 'System',
    action: 'Opportunity Found',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: `New opportunity collected from ${source}`,
    previousValue: null,
    newValue: null,
    priority: 'MEDIUM',
    source,
  });
};

/**
 * Log an AI analysis completed event
 */
export const logAIAnalysisCompleted = (opportunityId, opportunityTitle, office = 'System') => {
  logAuditEvent({
    user: 'AI Engine',
    userName: 'AI Engine',
    userRole: 'System',
    action: 'AI Analysis Completed',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Tender requirements analyzed',
    previousValue: 'Pending',
    newValue: 'Completed',
    priority: 'MEDIUM',
    source: 'AI Scoring Engine',
  });
};

/**
 * Log a score generated event
 */
export const logScoreGenerated = (opportunityId, opportunityTitle, score, priority = 'MEDIUM', office = 'System') => {
  logAuditEvent({
    user: 'AI Engine',
    userName: 'AI Engine',
    userRole: 'System',
    action: 'Score Generated',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Relevance score calculated',
    previousValue: null,
    newValue: `${score} / 10`,
    priority,
    source: 'AI Scoring Engine',
  });
};

/**
 * Log a priority assigned event
 */
export const logPriorityAssigned = (opportunityId, opportunityTitle, priority = 'MEDIUM', office = 'System') => {
  logAuditEvent({
    user: 'AI Engine',
    userName: 'AI Engine',
    userRole: 'System',
    action: 'Priority Assigned',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: `${priority} priority assigned based on analysis`,
    previousValue: null,
    newValue: priority,
    priority,
    source: 'AI Scoring Engine',
  });
};

/**
 * Log an opportunity assigned event
 */
export const logOpportunityAssigned = (opportunityId, opportunityTitle, assignedTo, priority = 'MEDIUM', office = 'System') => {
  logAuditEvent({
    user: 'Admin',
    userName: 'Admin',
    userRole: 'Admin',
    action: 'Opportunity Assigned',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: `Opportunity assigned to ${assignedTo}`,
    previousValue: 'Unassigned',
    newValue: assignedTo,
    priority,
    source: 'Manual Assignment',
  });
};

/**
 * Log a status updated event
 */
export const logStatusUpdated = (opportunityId, opportunityTitle, previousStatus, newStatus, userName = 'Admin', userRole = 'Admin', office = 'System') => {
  const statusPriorityMap = {
    'New': 'MEDIUM',
    'Under Review': 'MEDIUM',
    'Pursue': 'HIGH',
    'Decline': 'LOW',
    'In Progress': 'HIGH',
  };

  logAuditEvent({
    user: userName,
    userName,
    userRole,
    action: 'Status Updated',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: `Opportunity status moved to ${newStatus}`,
    previousValue: previousStatus,
    newValue: newStatus,
    priority: statusPriorityMap[newStatus] || 'MEDIUM',
    source: 'Manual Update',
  });
};

/**
 * Log a decision updated event
 */
export const logDecisionUpdated = (opportunityId, opportunityTitle, decision, userName = 'Management', userRole = 'Manager', office = 'System') => {
  logAuditEvent({
    user: userName,
    userName,
    userRole,
    action: 'Decision Updated',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: `Management decision - ${decision}`,
    previousValue: 'Pending',
    newValue: decision,
    priority: decision === 'Pursue' ? 'HIGH' : 'LOW',
    source: 'Decision Module',
  });
};

/**
 * Log a bid manager assigned event
 */
export const logBidManagerAssigned = (opportunityId, opportunityTitle, bidManager, priority = 'HIGH', office = 'System') => {
  logAuditEvent({
    user: 'Admin',
    userName: 'Admin',
    userRole: 'Admin',
    action: 'Bid Manager Assigned',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Bid manager assigned to opportunity',
    previousValue: 'Unassigned',
    newValue: bidManager,
    priority,
    source: 'Manual Assignment',
  });
};

/**
 * Log a proposal preparation started event
 */
export const logProposalPreparationStarted = (opportunityId, opportunityTitle, userName = 'Bid Manager', userRole = 'Manager', priority = 'HIGH', office = 'System') => {
  logAuditEvent({
    user: userName,
    userName,
    userRole,
    action: 'Proposal Preparation Started',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Initial proposal work initiated',
    previousValue: 'Not Started',
    newValue: 'In Progress',
    priority,
    source: 'Work Tracking',
  });
};

/**
 * Log a consortium recommendation event
 */
export const logConsortiumRecommendation = (opportunityId, opportunityTitle, recommended = true, priority = 'HIGH', office = 'System') => {
  logAuditEvent({
    user: 'AI Engine',
    userName: 'AI Engine',
    userRole: 'System',
    action: 'Consortium Recommendation',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Potential partner organizations recommended',
    previousValue: 'Not Recommended',
    newValue: recommended ? 'Recommended' : 'Not Recommended',
    priority,
    source: 'Consortium Engine',
  });
};

/**
 * Log a deadline alert sent event
 */
export const logDeadlineAlertSent = (opportunityId, opportunityTitle, priority = 'HIGH', office = 'System') => {
  logAuditEvent({
    user: 'System',
    userName: 'System',
    userRole: 'System',
    action: 'Deadline Alert Sent',
    opportunityId,
    recordId: opportunityId,
    recordName: opportunityTitle,
    opportunityTitle,
    office,
    details: 'Deadline approaching notification sent',
    previousValue: null,
    newValue: 'Notification Sent',
    priority,
    source: 'Alert System',
  });
};

/**
 * Log a report generated event
 */
export const logReportGenerated = (reportName, opportunityId = null, office = 'System') => {
  logAuditEvent({
    user: 'System',
    userName: 'System',
    userRole: 'System',
    action: 'Report Generated',
    opportunityId,
    recordId: opportunityId,
    recordName: reportName,
    opportunityTitle: reportName,
    office,
    details: 'Report generated for analysis',
    previousValue: null,
    newValue: 'Generated',
    priority: 'MEDIUM',
    source: 'Reporting Engine',
  });
};

/**
 * Log a generic custom audit event
 */
export const logCustomEvent = (eventData) => {
  const defaults = {
    user: 'System',
    userRole: 'System',
    priority: 'MEDIUM',
    source: 'Custom Event',
  };

  logAuditEvent({
    ...defaults,
    ...eventData,
    userName: eventData.user,
  });
};
