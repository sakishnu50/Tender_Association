import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  BellOff,
  ExternalLink,
} from 'lucide-react';

const defaultActivities = [
  {
    id: 1,
    type: 'pursued',
    category: 'update',
    dotColor: '#10B981',
    oppId: 'OPP-003',
    message: 'Opportunity "Water Supply, Kerala" marked as Pursued',
    detail: 'Status changed from Review → Pursued by Rahul M. Bid deadline is Oct 12, 2025.',
    time: '2 hours ago',
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'match',
    category: 'ai',
    dotColor: '#3B82F6',
    oppId: 'OPP-001',
    message: 'New high-match tender identified: Smart Grid TN',
    detail: 'AI match score: 91/100. Sector: Infrastructure. Value: ₹48 Cr. Deadline in 14 days.',
    time: '4 hours ago',
    icon: Sparkles,
  },
  {
    id: 3,
    type: 'alert',
    category: 'alert',
    dotColor: '#F59E0B',
    oppId: 'OPP-002',
    message: 'Deadline alert: Highway Upgrade Karnataka — 6 days left',
    detail: 'Submission deadline: Sep 24, 2025. Required documents: BOQ, Technical Bid, EMD.',
    time: '6 hours ago',
    icon: AlertCircle,
  },
  {
    id: 4,
    type: 'update',
    category: 'ai',
    dotColor: '#3B82F6',
    oppId: 'OPP-001',
    message: 'AI re-scored 3 tenders after profile update',
    detail: 'Urban Housing ↑ 78→85, Metro Rail ↑ 72→80, Smart City ↓ 88→82 (capability mismatch).',
    time: 'Yesterday',
    icon: Clock,
  },
  {
    id: 5,
    type: 'alert',
    category: 'alert',
    dotColor: '#EF4444',
    oppId: 'OPP-004',
    message: 'Critical: Port Development Goa — 2 days left',
    detail: 'Value: ₹120 Cr. Last chance to submit. EMD of ₹12L required via NEFT.',
    time: 'Yesterday',
    icon: AlertCircle,
  },
];

const FILTERS = ['All', 'Alert', 'AI', 'Update'];

const categoryMeta = {
  alert: { bg: '#FEF2F2', color: '#DC2626', label: 'Alert' },
  ai:    { bg: '#EFF6FF', color: '#2563EB', label: 'AI' },
  update: { bg: '#F0FDF4', color: '#059669', label: 'Update' },
};

export default function RecentActivityFeed({ activities: propActivities, onView }) {
  const navigate = useNavigate();
  const [items, setItems]       = useState(propActivities ?? defaultActivities);
  const [expanded, setExpanded] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter]     = useState('All');
  const [read, setRead]         = useState(new Set());

  const handleView = (e, item) => {
    e.stopPropagation();
    if (onView) {
      onView(item);
    } else {
      navigate('/opportunities');
    }
  };

  const filtered = items.filter((item) =>
    filter === 'All' ? true : item.category.toLowerCase() === filter.toLowerCase()
  );

  const unreadCount = items.filter((i) => !read.has(i.id)).length;

  const dismiss = (id, e) => {
    e.stopPropagation();
    setItems((prev) => prev.filter((i) => i.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const markRead    = (id) => setRead((prev) => new Set([...prev, id]));
  const markAllRead = ()   => setRead(new Set(items.map((i) => i.id)));

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    markRead(id);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-color)',
        borderRadius: '12px',
        padding: '22px',
        marginBottom: '24px',
        boxShadow: 'var(--shadow-xs)',
      }}
    >
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px', height: '34px', borderRadius: '8px',
              backgroundColor: '#EFF6FF', color: '#2563EB',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              Recent Activity Feed
              {unreadCount > 0 && (
                <span style={{
                  fontSize: '0.65rem', fontWeight: '700',
                  backgroundColor: '#EF4444', color: '#fff',
                  borderRadius: '9999px', padding: '1px 6px', lineHeight: '1.4',
                }}>
                  {unreadCount} new
                </span>
              )}
            </h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time audit log of tender actions &amp; AI notifications
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            title="Mark all as read"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              fontSize: '0.75rem', fontWeight: '600', color: '#2563EB',
              background: '#EFF6FF', border: '1px solid #BFDBFE',
              borderRadius: '6px', padding: '0.3rem 0.65rem',
              cursor: 'pointer', transition: 'all 0.15s ease', whiteSpace: 'nowrap',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#DBEAFE'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#EFF6FF'; }}
          >
            <BellOff size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* ── Filter Tabs ── */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
        {FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: '0.75rem', fontWeight: '600',
                padding: '0.28rem 0.75rem', borderRadius: '9999px',
                border: active ? '1.5px solid #2563EB' : '1.5px solid var(--border-color)',
                background: active ? '#2563EB' : 'var(--bg-subtle)',
                color: active ? '#fff' : 'var(--text-muted)',
                cursor: 'pointer', transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.borderColor = '#2563EB'; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.borderColor = 'var(--border-color)'; }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {/* ── Activity List ── */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          No activity in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map((item) => {
            const isExpanded = expanded === item.id;
            const isHovered  = hoveredId === item.id;
            const isRead     = read.has(item.id);
            const cat        = categoryMeta[item.category] ?? categoryMeta.update;

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRadius: '8px',
                  border: isExpanded ? '1.5px solid #BFDBFE' : isHovered ? '1px solid #BFDBFE' : '1px solid var(--border-color)',
                  backgroundColor: isExpanded ? '#F0F7FF' : isHovered ? 'var(--bg-subtle)' : isRead ? 'var(--bg-card)' : '#F8FAFC',
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: isHovered || isExpanded ? '0 2px 8px rgba(37,99,235,0.08)' : 'none',
                  overflow: 'hidden',
                }}
              >
                {/* Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.7rem 1rem', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0, flex: 1 }}>
                    {/* Unread pulse dot */}
                    {!isRead && (
                      <span style={{
                        width: '7px', height: '7px', borderRadius: '50%',
                        backgroundColor: item.dotColor,
                        boxShadow: `0 0 5px ${item.dotColor}90`,
                        flexShrink: 0,
                      }} />
                    )}
                    {/* Category pill */}
                    <span style={{
                      fontSize: '0.65rem', fontWeight: '700',
                      padding: '2px 7px', borderRadius: '9999px',
                      backgroundColor: cat.bg, color: cat.color,
                      textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0,
                    }}>
                      {cat.label}
                    </span>
                    {/* Message */}
                    <span
                      style={{
                        fontSize: '0.845rem',
                        color: isRead ? 'var(--text-secondary)' : 'var(--text-main)',
                        fontWeight: isRead ? '400' : '500',
                        lineHeight: '1.4', overflow: 'hidden',
                        textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}
                      title={item.message}
                    >
                      {item.message}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexShrink: 0 }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '500', whiteSpace: 'nowrap' }}>
                      {item.time}
                    </span>
                    {isExpanded ? <ChevronUp size={14} color="var(--text-muted)" /> : <ChevronDown size={14} color="var(--text-muted)" />}
                    <button
                      onClick={(e) => dismiss(item.id, e)}
                      title="Dismiss"
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '22px', height: '22px', borderRadius: '4px',
                        border: 'none', background: 'transparent',
                        color: 'var(--text-light)', cursor: 'pointer',
                        transition: 'all 0.15s ease', padding: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#DC2626'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-light)'; }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail panel */}
                {isExpanded && (
                  <div style={{
                    padding: '0.65rem 1rem 0.85rem 1rem',
                    borderTop: '1px solid #BFDBFE',
                    backgroundColor: '#EFF6FF',
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between', gap: '1rem',
                    animation: 'fadeIn 0.15s ease',
                  }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.55', flex: 1 }}>
                      {item.detail}
                    </p>
                    <button
                      onClick={(e) => handleView(e, item)}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        fontSize: '0.75rem', fontWeight: '600', color: '#2563EB',
                        background: '#DBEAFE', border: '1px solid #BFDBFE',
                        borderRadius: '6px', padding: '0.28rem 0.65rem',
                        cursor: 'pointer', whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease', flexShrink: 0,
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#BFDBFE'; e.currentTarget.style.boxShadow = '0 2px 6px rgba(37,99,235,0.2)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = '#DBEAFE'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      View <ExternalLink size={11} />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
