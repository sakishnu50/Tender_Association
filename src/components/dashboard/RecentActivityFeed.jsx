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
  Eye,
  CheckCircle,
  RotateCcw
} from 'lucide-react';

const defaultActivities = [
  {
    id: 1,
    type: 'pursued',
    category: 'update',
    dotColor: '#10B981',
    oppId: 'OPP-003',
    message: 'Opportunity "Water Supply, Kerala" marked as Pursued',
    detail: 'Status promoted to Pursued by Regional Lead. Assigned priority evaluation to the Technical Engineering Team. Bid closing in 24 days.',
    time: '2 hours ago',
    actor: 'Admin User',
    icon: CheckCircle2,
  },
  {
    id: 2,
    type: 'match',
    category: 'ai',
    dotColor: '#3B82F6',
    oppId: 'OPP-001',
    message: 'New high-match tender identified: Smart Grid TN',
    detail: 'AI Match Score: 9.1/10 (High Confidence). Sector: Power & Infrastructure. Value: ₹48.0 Cr. Strong credentials alignment across electrical & civil packages.',
    time: '4 hours ago',
    actor: 'AI Watchdog',
    icon: Sparkles,
  },
  {
    id: 3,
    type: 'alert',
    category: 'alert',
    dotColor: '#F59E0B',
    oppId: 'OPP-002',
    message: 'Deadline alert: Highway Upgrade Karnataka — 6 days left',
    detail: 'Multilateral procurement bid closes in under 6 days. Mandatory submission documents pending: Technical Joint Venture Agreement & Bank Guarantee.',
    time: '6 hours ago',
    actor: 'System Watchdog',
    icon: AlertCircle,
  },
  {
    id: 4,
    type: 'update',
    category: 'ai',
    dotColor: '#3B82F6',
    oppId: 'OPP-001',
    message: 'AI re-scored 3 tenders after profile update',
    detail: 'Automated re-indexing completed following qualification certificate uploads: Urban Housing ↑ 78→85, Metro Rail ↑ 72→80, Smart City ↓ 88→82.',
    time: 'Yesterday',
    actor: 'Semantic Engine',
    icon: Clock,
  },
  {
    id: 5,
    type: 'alert',
    category: 'alert',
    dotColor: '#EF4444',
    oppId: 'OPP-004',
    message: 'Critical: Port Development Goa — 2 days left',
    detail: 'Critical bid submission deadline. EMD deposit confirmation required via portal gateway before 5:00 PM IST.',
    time: 'Yesterday',
    actor: 'Tender Source Crawler',
    icon: AlertCircle,
  },
];

const FILTERS = ['All', 'Alert', 'AI', 'Update'];

const categoryMeta = {
  alert: {
    bg: 'var(--danger-bg)',
    color: 'var(--danger-text)',
    border: 'var(--danger-border)',
    label: 'Alert'
  },
  ai: {
    bg: 'var(--primary-light)',
    color: 'var(--primary)',
    border: 'var(--primary-border)',
    label: 'AI'
  },
  update: {
    bg: 'var(--success-bg)',
    color: 'var(--success-text)',
    border: 'var(--success-border)',
    label: 'Update'
  }
};

export default function RecentActivityFeed({
  activities: propActivities,
  opportunities = [],
  onInspectOpportunity,
  onPursueOpportunity,
  onView,
  searchVal = ''
}) {
  const navigate = useNavigate();
  const [items, setItems] = useState(propActivities ?? defaultActivities);
  const [expanded, setExpanded] = useState(null);
  const [hoveredId, setHoveredId] = useState(null);
  const [filter, setFilter] = useState('All');
  const [read, setRead] = useState(new Set());
  const [dismissedItem, setDismissedItem] = useState(null);

  // Find linked opportunity if available
  const findOpportunity = (oppId) => {
    if (!oppId || !opportunities || opportunities.length === 0) return null;
    return opportunities.find((o) => o.id === oppId || o.name?.toLowerCase().includes(oppId.toLowerCase()));
  };

  const handleView = (e, item) => {
    e.stopPropagation();
    if (onView) {
      onView(item);
    } else if (onInspectOpportunity) {
      const opp = findOpportunity(item.oppId);
      if (opp) {
        onInspectOpportunity(opp);
      } else {
        navigate('/opportunities');
      }
    } else {
      navigate('/opportunities');
    }
  };

  const filtered = React.useMemo(() => {
    return items.filter((item) => {
      const matchesCategory =
        filter === 'All' ? true : item.category.toLowerCase() === filter.toLowerCase();
      if (!matchesCategory) return false;
      if (!searchVal || !searchVal.trim()) return true;
      const q = searchVal.trim().toLowerCase();
      return (
        item.message?.toLowerCase().includes(q) ||
        item.detail?.toLowerCase().includes(q) ||
        item.actor?.toLowerCase().includes(q) ||
        item.oppId?.toLowerCase().includes(q)
      );
    });
  }, [items, filter, searchVal]);

  const unreadCount = items.filter((i) => !read.has(i.id)).length;

  const dismiss = (item, e) => {
    e.stopPropagation();
    setDismissedItem(item);
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    if (expanded === item.id) setExpanded(null);
  };

  const undoDismiss = () => {
    if (dismissedItem) {
      setItems((prev) => [dismissedItem, ...prev]);
      setDismissedItem(null);
    }
  };

  const markRead = (id) => setRead((prev) => new Set([...prev, id]));
  const markAllRead = () => setRead(new Set(items.map((i) => i.id)));

  const toggleExpand = (id) => {
    setExpanded((prev) => (prev === id ? null : id));
    markRead(id);
  };

  const toggleRead = (e, id) => {
    e.stopPropagation();
    setRead((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
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
        position: 'relative',
        transition: 'background-color 0.2s ease, border-color 0.2s ease'
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.1rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '9px',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 8px rgba(37, 99, 235, 0.15)'
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3
                style={{
                  fontSize: '0.975rem',
                  fontWeight: '700',
                  color: 'var(--text-main)',
                  margin: 0,
                  letterSpacing: '-0.01em'
                }}
              >
                Recent Activity Feed
              </h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.675rem',
                    fontWeight: '700',
                    backgroundColor: 'var(--danger)',
                    color: '#FFFFFF',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.5rem',
                    lineHeight: '1.3',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.45)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}
                >
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      backgroundColor: '#FFFFFF',
                      display: 'inline-block'
                    }}
                  />
                  {unreadCount} new
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                margin: '3px 0 0 0',
                lineHeight: '1.4'
              }}
            >
              Real-time audit log of tender actions &amp; AI notifications
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            type="button"
            title="Mark all as read"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--primary)',
              backgroundColor: 'var(--primary-light)',
              border: '1px solid var(--primary-border)',
              borderRadius: '7px',
              padding: '0.35rem 0.75rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.filter = 'brightness(1.15)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.filter = 'none';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <BellOff size={13} />
            Mark all read
          </button>
        )}
      </div>

      {/* ── Undo Dismiss Toast Bar ── */}
      {dismissedItem && (
        <div
          style={{
            backgroundColor: 'var(--bg-subtle)',
            border: '1px dashed var(--border-color)',
            borderRadius: '8px',
            padding: '0.45rem 0.85rem',
            marginBottom: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-main)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            Dismissed: <strong>{dismissedItem.message.slice(0, 42)}...</strong>
          </span>
          <button
            onClick={undoDismiss}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--primary)',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px'
            }}
          >
            <RotateCcw size={12} /> Undo
          </button>
        </div>
      )}

      {/* ── Filter Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: '0.45rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {FILTERS.map((f) => {
          const active = filter === f;
          const count = items.filter(
            (i) => f === 'All' || i.category.toLowerCase() === f.toLowerCase()
          ).length;

          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              type="button"
              style={{
                fontSize: '0.75rem',
                fontWeight: active ? '700' : '500',
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                border: active ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: active ? 'var(--primary)' : 'var(--bg-subtle)',
                color: active ? '#FFFFFF' : 'var(--text-muted)',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                boxShadow: active ? '0 2px 8px rgba(37, 99, 235, 0.3)' : 'none'
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--primary)';
                  e.currentTarget.style.color = 'var(--text-main)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-muted)';
                }
              }}
            >
              <span>{f}</span>
              <span
                style={{
                  fontSize: '0.675rem',
                  padding: '0.05rem 0.35rem',
                  borderRadius: '9999px',
                  backgroundColor: active ? 'rgba(255, 255, 255, 0.25)' : 'rgba(0, 0, 0, 0.08)',
                  color: active ? '#FFFFFF' : 'var(--text-muted)',
                  fontWeight: '700'
                }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Activity List ── */}
      {filtered.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '2.5rem 1rem',
            color: 'var(--text-muted)',
            fontSize: '0.85rem',
            borderRadius: '8px',
            border: '1px dashed var(--border-color)',
            backgroundColor: 'var(--bg-card-nested)'
          }}
        >
          <FileText size={24} style={{ opacity: 0.5, margin: '0 auto 0.5rem auto' }} />
          <p style={{ margin: 0, fontWeight: '600', color: 'var(--text-main)' }}>
            No activity in this category
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem' }}>
            New tender milestones and audit logs will automatically stream here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {filtered.map((item) => {
            const isExpanded = expanded === item.id;
            const isHovered = hoveredId === item.id;
            const isRead = read.has(item.id);
            const cat = categoryMeta[item.category] ?? categoryMeta.update;
            const opp = findOpportunity(item.oppId);

            // Determine card background and border styling based on read and expanded state
            let cardBg = isRead ? 'var(--bg-card-nested)' : 'var(--bg-card)';
            let cardBorder = isRead ? 'var(--border-color)' : 'var(--primary-border)';
            let cardShadow = 'none';

            if (isExpanded) {
              cardBorder = 'var(--primary)';
              cardShadow = '0 4px 16px rgba(37, 99, 235, 0.15)';
            } else if (isHovered) {
              cardBorder = 'var(--primary-border)';
              cardShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
            }

            return (
              <div
                key={item.id}
                onClick={() => toggleExpand(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{
                  borderRadius: '9px',
                  border: `1px solid ${cardBorder}`,
                  backgroundColor: cardBg,
                  cursor: 'pointer',
                  transition: 'all 0.18s ease',
                  boxShadow: cardShadow,
                  overflow: 'hidden',
                  position: 'relative'
                }}
              >
                {/* Left glowing accent line for unread items */}
                {!isRead && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: '3px',
                      backgroundColor: item.dotColor || 'var(--primary)',
                      boxShadow: `0 0 8px ${item.dotColor || 'var(--primary)'}`
                    }}
                  />
                )}

                {/* Main Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem 0.75rem 1.15rem',
                    gap: '0.75rem'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.65rem',
                      minWidth: 0,
                      flex: 1
                    }}
                  >
                    {/* Glowing status dot (interactive toggle) */}
                    <button
                      type="button"
                      onClick={(e) => toggleRead(e, item.id)}
                      title={isRead ? 'Mark as unread' : 'Mark as read'}
                      style={{
                        border: 'none',
                        background: 'transparent',
                        padding: '2px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: item.dotColor,
                          boxShadow: !isRead
                            ? `0 0 8px ${item.dotColor}, 0 0 2px ${item.dotColor}`
                            : 'none',
                          opacity: isRead ? 0.45 : 1,
                          flexShrink: 0,
                          display: 'inline-block',
                          transition: 'all 0.2s ease'
                        }}
                      />
                    </button>

                    {/* Category pill */}
                    <span
                      style={{
                        fontSize: '0.675rem',
                        fontWeight: '700',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '6px',
                        backgroundColor: cat.bg,
                        color: cat.color,
                        border: `1px solid ${cat.border}`,
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                        flexShrink: 0
                      }}
                    >
                      {cat.label}
                    </span>

                    {/* Message Text */}
                    <span
                      style={{
                        fontSize: '0.845rem',
                        color: isRead ? 'var(--text-secondary)' : 'var(--text-main)',
                        fontWeight: isRead ? '500' : '650',
                        lineHeight: '1.4',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        flex: 1
                      }}
                      title={item.message}
                    >
                      {item.message}
                    </span>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      flexShrink: 0
                    }}
                  >
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--text-muted)',
                        fontWeight: '500',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {item.time}
                    </span>

                    {/* Accordion toggle chevron */}
                    <span
                      style={{
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>

                    {/* Dismiss Button */}
                    <button
                      type="button"
                      onClick={(e) => dismiss(item, e)}
                      title="Dismiss activity"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '24px',
                        height: '24px',
                        borderRadius: '5px',
                        border: 'none',
                        background: 'transparent',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        padding: 0
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'var(--danger-bg)';
                        e.currentTarget.style.color = 'var(--danger-text)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = 'var(--text-muted)';
                      }}
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '0.85rem 1.15rem 1rem 1.15rem',
                      borderTop: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem',
                      animation: 'fadeIn 0.15s ease'
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                        fontSize: '0.725rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>Actor: <strong style={{ color: 'var(--text-main)' }}>{item.actor || 'System'}</strong></span>
                        {item.oppId && (
                          <>
                            <span>•</span>
                            <span>Ref ID: <strong style={{ color: 'var(--primary)' }}>{item.oppId}</strong></span>
                          </>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={(e) => toggleRead(e, item.id)}
                        style={{
                          border: '1px solid var(--border-color)',
                          backgroundColor: 'var(--bg-card)',
                          color: 'var(--text-main)',
                          borderRadius: '4px',
                          padding: '0.15rem 0.45rem',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        {isRead ? 'Mark as Unread' : 'Mark as Read'}
                      </button>
                    </div>

                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--text-secondary)',
                        margin: 0,
                        lineHeight: '1.55',
                        backgroundColor: 'var(--bg-card)',
                        padding: '0.65rem 0.85rem',
                        borderRadius: '6px',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {item.detail}
                    </p>

                    {/* Bottom Action Row */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '0.5rem',
                        marginTop: '0.2rem'
                      }}
                    >
                      {opp && onInspectOpportunity && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onInspectOpportunity(opp);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            backgroundColor: 'var(--bg-card)',
                            border: '1px solid var(--border-color)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <Eye size={12} /> Inspect Tender
                        </button>
                      )}

                      {opp && onPursueOpportunity && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onPursueOpportunity(opp);
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.3rem',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            color: 'var(--success-text)',
                            backgroundColor: 'var(--success-bg)',
                            border: '1px solid var(--success-border)',
                            borderRadius: '6px',
                            padding: '0.35rem 0.75rem',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <CheckCircle size={12} /> Pursue
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={(e) => handleView(e, item)}
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          color: '#FFFFFF',
                          backgroundColor: 'var(--primary)',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '0.35rem 0.85rem',
                          cursor: 'pointer',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.15s ease',
                          boxShadow: '0 2px 6px rgba(37, 99, 235, 0.25)'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'var(--primary)';
                        }}
                      >
                        <span>View Tender</span>
                        <ExternalLink size={12} />
                      </button>
                    </div>
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
