// src/components/AuditTrail/AuditTimeline.jsx

import React, { useMemo } from 'react';
import styles from './AuditTrail.module.css';

/**
 * Timeline view component - displays audit history for a specific opportunity
 * in a chronological timeline format.
 */
export default function AuditTimeline({ logs, opportunityId, opportunityTitle }) {
  // Filter logs for the specific opportunity
  const timelineEvents = useMemo(() => {
    if (!opportunityId) return [];
    
    return logs
      .filter(log => log.opportunityId === opportunityId || log.recordId === opportunityId)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }, [logs, opportunityId]);

  // Group events by date
  const eventsByDate = useMemo(() => {
    const grouped = {};
    timelineEvents.forEach(event => {
      const date = new Date(event.timestamp);
      const dateKey = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
      
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(event);
    });
    return grouped;
  }, [timelineEvents]);

  const getActionIcon = (action) => {
    if (action.includes('AI') || action.includes('Score') || action.includes('Analysis')) return '🤖';
    if (action.includes('Status') || action.includes('Update')) return '📝';
    if (action.includes('Decision') || action.includes('Pursue') || action.includes('Decline')) return '✅';
    if (action.includes('Assigned') || action.includes('Manager')) return '👤';
    if (action.includes('Opportunity Found')) return '📌';
    if (action.includes('Proposal')) return '📄';
    if (action.includes('Deadline') || action.includes('Alert')) return '⏰';
    if (action.includes('Consortium')) return '👥';
    if (action.includes('Report')) return '📊';
    return '📋';
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return '#DC2626';
      case 'MEDIUM':
        return '#D97706';
      case 'LOW':
        return '#0284C7';
      default:
        return '#64748B';
    }
  };

  if (timelineEvents.length === 0) {
    return (
      <div className={styles.timelineContainer}>
        <div className={styles.timelineEmpty}>
          <p>No timeline data available for this opportunity</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.timelineContainer}>
      <div className={styles.timelineHeader}>
        <h3 className={styles.timelineTitle}>Activity Timeline</h3>
        <p className={styles.timelineSubtitle}>{opportunityTitle}</p>
      </div>

      <div className={styles.timeline}>
        {Object.entries(eventsByDate).map(([date, events]) => (
          <div key={date} className={styles.timelineDate}>
            <div className={styles.dateLabel}>{date}</div>
            
            {events.map((event, idx) => (
              <div key={idx} className={styles.timelineEvent}>
                <div className={styles.timelineMarker} style={{ color: getPriorityColor(event.priority) }}>
                  {getActionIcon(event.action)}
                </div>
                
                <div className={styles.timelineContent}>
                  <div className={styles.eventTime}>
                    {new Date(event.timestamp).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                  
                  <div className={styles.eventAction}>{event.action}</div>
                  
                  {event.userName && (
                    <div className={styles.eventUser}>
                      by <strong>{event.userName}</strong> {event.userRole && `(${event.userRole})`}
                    </div>
                  )}
                  
                  {event.details && (
                    <div className={styles.eventDetails}>{event.details}</div>
                  )}
                  
                  {event.newValue && (
                    <div className={styles.eventChange}>
                      {event.previousValue && (
                        <span className={styles.changeFrom}>{event.previousValue}</span>
                      )}
                      <span className={styles.changeArrow}>→</span>
                      <span className={styles.changeTo}>{event.newValue}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
