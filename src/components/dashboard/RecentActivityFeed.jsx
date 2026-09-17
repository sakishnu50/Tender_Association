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
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '22px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: '#EFF6FF',
            color: '#2563EB',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Recent Activity Feed
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time audit log of tender actions & AI notifications
            </p>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {activities.map((item) => {
          return (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                border: '1px solid var(--border-color)',
                gap: '1rem',
                transition: 'background-color 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0 }}>
                {/* Status Dot */}
                <span
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: item.dotColor,
                    boxShadow: `0 0 6px ${item.dotColor}80`,
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
