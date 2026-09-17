import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

const defaultActivities = [
  {
    id: 1,
    type: 'pursued',
    dotColor: '#10B981', // green
    message: 'Opportunity "Water Supply, Kerala" marked as Pursued',
    time: '2 hours ago',
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'match',
    dotColor: '#3B82F6', // blue
    message: 'New high-match tender identified: Smart Grid TN',
    time: '4 hours ago',
    icon: Sparkles,
  },
  {
    id: 3,
    type: 'alert',
    dotColor: '#F59E0B', // yellow/amber
    message: 'Deadline alert: Highway Upgrade Karnataka — 6 days left',
    time: '6 hours ago',
    icon: AlertCircle,
  },
  {
    id: 4,
    type: 'update',
    dotColor: '#3B82F6', // blue
    message: 'AI re-scored 3 tenders after profile update',
    time: 'Yesterday',
    icon: Clock,
  },
];

export default function RecentActivityFeed({ activities = defaultActivities }) {
  return (
    <div className="card" style={{ padding: '24px', borderRadius: '1rem', border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.5rem',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            color: '#3B82F6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Recent Activity Feed
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
              Real-time audit log of tender actions & AI notifications
            </p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {activities.map((item) => {
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '0.65rem',
                backgroundColor: 'var(--bg-subtle, rgba(255, 255, 255, 0.02))',
                border: '1px solid var(--border-color)',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                {/* Status Dot */}
                <span
                  style={{
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: item.dotColor,
                    boxShadow: `0 0 8px ${item.dotColor}80`,
                    flexShrink: 0
                  }}
                />
                
                <span
                  style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-main)',
                    fontWeight: '500',
                    lineHeight: '1.4',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={item.message}
                >
                  {item.message}
                </span>
              </div>

              <span
                style={{
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  fontWeight: '500'
                }}
              >
                {item.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
