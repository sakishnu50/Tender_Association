import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowUpRight,
  Search,
  X,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Eye,
  CheckCircle,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { mockOpportunities } from '../../data/mockData';

const initialActivities = [
  {
    id: 'ACT-001',
    type: 'pursued',
    dotColor: '#10B981',
    category: 'pursued',
    message: 'Opportunity "Water Supply Modernization" marked as Pursued',
    tenderName: 'Water Supply Modernization',
    opportunityId: 'OPP-003',
    time: '2 hours ago',
    timestamp: '17 Sep 2026, 11:30 AM',
    actor: 'Admin User (You)',
    summary: 'Status promoted to Pursued. Assigned lead evaluation priority to the Regional Engineering Team.',
    read: false,
    icon: CheckCircle2,
    badgeText: 'Pursued',
    badgeBg: '#DCFCE7',
    badgeColor: '#15803D'
  },
  {
    id: 'ACT-002',
    type: 'match',
    dotColor: '#2563EB',
    category: 'match',
    message: 'New high-match tender identified: Smart Grid Implementation (ADB)',
    tenderName: 'Smart Grid Implementation',
    opportunityId: 'OPP-002',
    time: '4 hours ago',
    timestamp: '17 Sep 2026, 09:15 AM',
    actor: 'AI Tender Watchdog',
    summary: 'AI Engine calculated an 8.8 Match Score based on your corporate power & transmission credentials.',
    read: false,
    icon: Sparkles,
    badgeText: '8.8 Match',
    badgeBg: '#EFF6FF',
    badgeColor: '#2563EB'
  },
  {
    id: 'ACT-003',
    type: 'alert',
    dotColor: '#F59E0B',
    category: 'alert',
    message: 'Deadline alert: Urban Infrastructure Development — 3 days remaining',
    tenderName: 'Urban Infrastructure Development',
    opportunityId: 'OPP-001',
    time: '6 hours ago',
    timestamp: '17 Sep 2026, 07:45 AM',
    actor: 'System Watchdog',
    summary: 'Multilateral procurement bid closes in 72 hours. Consortium documentation pending final signoff.',
    read: true,
    icon: AlertCircle,
    badgeText: 'Closing Soon',
    badgeBg: '#FEF3C7',
    badgeColor: '#B45309'
  },
  {
    id: 'ACT-004',
    type: 'match',
    dotColor: '#10B981',
    category: 'match',
    message: 'Consortium partner shortlisted for Metro Rail Phase II',
    tenderName: 'Metro Rail Phase II',
    opportunityId: 'OPP-006',
    time: '12 hours ago',
    timestamp: '16 Sep 2026, 09:20 PM',
    actor: 'Partner Matching AI',
    summary: 'Tata Projects matched with 94% capability overlap for technical joint venture package.',
    read: true,
    icon: Sparkles,
    badgeText: 'Partner Match',
    badgeBg: '#ECFDF5',
    badgeColor: '#059669'
  },
  {
    id: 'ACT-005',
    type: 'system',
    dotColor: '#6366F1',
    category: 'system',
    message: 'AI re-scored 14 tenders following corporate credential update',
    tenderName: 'Global Pipeline Re-index',
    opportunityId: null,
    time: 'Yesterday',
    timestamp: '16 Sep 2026, 03:00 PM',
    actor: 'Synvolve Semantic AI',
    summary: 'Updated experience profile weighted +12% toward urban drainage and green energy packages.',
    read: true,
    icon: Clock,
    badgeText: 'Re-indexed',
    badgeBg: '#EEF2FF',
    badgeColor: '#4F46E5'
  },
  {
    id: 'ACT-006',
    type: 'alert',
    dotColor: '#EF4444',
    category: 'alert',
    message: 'Addendum released: Highway Expansion Project (NHAI) updated pre-qual criteria',
    tenderName: 'Highway Expansion Project',
    opportunityId: 'OPP-004',
    time: '1 day ago',
    timestamp: '16 Sep 2026, 11:10 AM',
    actor: 'Tender Source Crawler',
    summary: 'Corrigendum #2 uploaded on CPPP portal modifying net worth requirement from ₹50Cr to ₹45Cr.',
    read: true,
    icon: AlertCircle,
    badgeText: 'Corrigendum',
    badgeBg: '#FEE2E2',
    badgeColor: '#DC2626'
  }
];

export default function RecentActivityFeed({
  activities = initialActivities,
  opportunities = mockOpportunities,
  onInspectOpportunity,
  onPursueOpportunity
}) {
  const navigate = useNavigate();

  const [feedItems, setFeedItems] = useState(activities);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [dismissedItem, setDismissedItem] = useState(null);

  // Helper to find opportunity details
  const findOpportunity = (oppId) => {
    if (!oppId) return null;
    const pool = opportunities && opportunities.length > 0 ? opportunities : mockOpportunities;
    return pool.find((o) => o.id === oppId || o.name?.toLowerCase().includes(oppId.toLowerCase()));
  };

  // Toggle read/unread status
  const handleToggleRead = (e, id) => {
    e.stopPropagation();
    setFeedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item))
    );
  };

  // Mark all as read
  const handleMarkAllRead = () => {
    setFeedItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  // Dismiss item
  const handleDismiss = (e, item) => {
    e.stopPropagation();
    setDismissedItem(item);
    setFeedItems((prev) => prev.filter((i) => i.id !== item.id));
    if (expandedId === item.id) {
      setExpandedId(null);
    }
  };

  // Undo dismiss
  const handleUndoDismiss = () => {
    if (dismissedItem) {
      setFeedItems((prev) => [dismissedItem, ...prev]);
      setDismissedItem(null);
    }
  };

  // Refresh feed simulation
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setFeedItems(activities);
    setIsRefreshing(false);
  };

  // Toggle accordion expand
  const handleToggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  // Counts for filter pills
  const counts = useMemo(() => {
    return {
      all: feedItems.length,
      pursued: feedItems.filter((i) => i.category === 'pursued').length,
      match: feedItems.filter((i) => i.category === 'match').length,
      alert: feedItems.filter((i) => i.category === 'alert').length,
      system: feedItems.filter((i) => i.category === 'system').length
    };
  }, [feedItems]);

  const unreadCount = useMemo(() => {
    return feedItems.filter((i) => !i.read).length;
  }, [feedItems]);

  // Filtered & searched items
  const filteredItems = useMemo(() => {
    return feedItems.filter((item) => {
      const matchesFilter = selectedFilter === 'all' || item.category === selectedFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.message.toLowerCase().includes(q) ||
        item.tenderName?.toLowerCase().includes(q) ||
        item.actor?.toLowerCase().includes(q) ||
        item.summary?.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [feedItems, selectedFilter, searchQuery]);

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
      {/* 1. Header Row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.15rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              backgroundColor: '#EFF6FF',
              color: '#2563EB',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <FileText size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
                Recent Activity Feed
              </h3>
              {unreadCount > 0 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    backgroundColor: '#EFF6FF',
                    color: '#2563EB',
                    borderRadius: '9999px',
                    padding: '0.1rem 0.5rem',
                    border: '1px solid #BFDBFE'
                  }}
                >
                  {unreadCount} new
                </span>
              )}
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time interactive audit log of tender milestones, AI notifications & user actions
            </p>
          </div>
        </div>

        {/* Header Right Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="btn btn-ghost"
              style={{
                fontSize: '0.75rem',
                padding: '0.35rem 0.65rem',
                color: 'var(--text-muted)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                borderRadius: '6px'
              }}
              title="Mark all events as read"
            >
              <Check size={13} /> Mark All Read
            </button>
          )}

          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="btn btn-ghost"
            style={{
              fontSize: '0.75rem',
              padding: '0.35rem 0.65rem',
              color: 'var(--text-muted)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              borderRadius: '6px'
            }}
            title="Refresh activity feed"
          >
            <RefreshCw size={13} className={isRefreshing ? 'spin-icon' : ''} />
            {isRefreshing ? 'Updating...' : 'Refresh'}
          </button>

          <button
            onClick={() => navigate('/audit')}
            style={{
              border: '1px solid var(--border-color)',
              backgroundColor: '#FFFFFF',
              borderRadius: '6px',
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              color: 'var(--text-main)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            title="Navigate to comprehensive audit logs"
          >
            Audit Trail <ArrowUpRight size={13} />
          </button>
        </div>
      </div>

      {/* 2. Interactive Filter Tabs & Quick Search Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}
      >
        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All', count: counts.all },
            { id: 'pursued', label: 'Pursued', count: counts.pursued },
            { id: 'match', label: 'AI Matches', count: counts.match },
            { id: 'alert', label: 'Alerts', count: counts.alert },
            { id: 'system', label: 'System', count: counts.system }
          ].map((tab) => {
            const isActive = selectedFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedFilter(tab.id)}
                type="button"
                style={{
                  border: isActive ? '1px solid #2563EB' : '1px solid var(--border-color)',
                  backgroundColor: isActive ? '#EFF6FF' : '#FFFFFF',
                  color: isActive ? '#2563EB' : 'var(--text-muted)',
                  borderRadius: '6px',
                  padding: '0.3rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: isActive ? '700' : '500',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{tab.label}</span>
                <span
                  style={{
                    fontSize: '0.675rem',
                    padding: '0.05rem 0.35rem',
                    borderRadius: '9999px',
                    backgroundColor: isActive ? '#2563EB' : '#F1F5F9',
                    color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                    fontWeight: '700'
                  }}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* In-feed Search Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid var(--border-color)',
            borderRadius: '6px',
            padding: '0.25rem 0.65rem',
            width: '240px',
            maxWidth: '100%'
          }}
        >
          <Search size={14} color="var(--text-muted)" style={{ flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search feed activities..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              fontSize: '0.75rem',
              color: 'var(--text-main)',
              width: '100%'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                padding: 0,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 3. Undo Dismiss Notice Bar */}
      {dismissedItem && (
        <div
          style={{
            backgroundColor: '#F1F5F9',
            border: '1px dashed #CBD5E1',
            borderRadius: '6px',
            padding: '0.5rem 0.85rem',
            marginBottom: '0.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-main)'
          }}
        >
          <span>
            Activity dismissed: <strong>{dismissedItem.message.slice(0, 45)}...</strong>
          </span>
          <button
            onClick={handleUndoDismiss}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#2563EB',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <RotateCcw size={12} /> Undo
          </button>
        </div>
      )}

      {/* 4. Activity List Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filteredItems.length === 0 ? (
          <div
            style={{
              padding: '2rem 1rem',
              textAlign: 'center',
              borderRadius: '8px',
              backgroundColor: '#F8FAFC',
              border: '1px dashed var(--border-color)'
            }}
          >
            <FileText size={28} color="#94A3B8" style={{ margin: '0 auto 0.5rem auto' }} />
            <p style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', margin: '0 0 4px 0' }}>
              No activities found
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
              {searchQuery ? `No results matching "${searchQuery}"` : 'No events in this category'}
            </p>
            {(selectedFilter !== 'all' || searchQuery) && (
              <button
                onClick={() => {
                  setSelectedFilter('all');
                  setSearchQuery('');
                }}
                className="btn btn-outline"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          filteredItems.map((item) => {
            const isExpanded = expandedId === item.id;
            const opp = findOpportunity(item.opportunityId);

            return (
              <div
                key={item.id}
                style={{
                  borderRadius: '8px',
                  backgroundColor: item.read ? '#F8FAFC' : '#FFFFFF',
                  border: isExpanded
                    ? '1px solid #93C5FD'
                    : item.read
                    ? '1px solid var(--border-color)'
                    : '1px solid #BFDBFE',
                  boxShadow: isExpanded
                    ? '0 4px 12px rgba(37, 99, 235, 0.08)'
                    : item.read
                    ? 'none'
                    : '0 1px 3px rgba(37, 99, 235, 0.06)',
                  transition: 'all 0.15s ease',
                  overflow: 'hidden'
                }}
              >
                {/* Main Interactive Summary Row */}
                <div
                  onClick={() => handleToggleExpand(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem 1rem',
                    gap: '0.75rem',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    {/* Read/Unread Status Indicator Dot with Quick Click */}
                    <button
                      onClick={(e) => handleToggleRead(e, item.id)}
                      title={item.read ? 'Mark as unread' : 'Mark as read'}
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
                          boxShadow: item.read ? 'none' : `0 0 6px ${item.dotColor}B3`,
                          opacity: item.read ? 0.6 : 1,
                          display: 'inline-block'
                        }}
                      />
                    </button>

                    {/* Category Pill Badge */}
                    <span
                      style={{
                        fontSize: '0.675rem',
                        fontWeight: '700',
                        color: item.badgeColor,
                        backgroundColor: item.badgeBg,
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        flexShrink: 0,
                        textTransform: 'uppercase',
                        letterSpacing: '0.02em'
                      }}
                    >
                      {item.badgeText}
                    </span>

                    {/* Message Text */}
                    <span
                      style={{
                        fontSize: '0.85rem',
                        color: 'var(--text-main)',
                        fontWeight: item.read ? '500' : '600',
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

                  {/* Right Side Controls & Timestamps */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: '0.725rem',
                        color: 'var(--text-muted)',
                        whiteSpace: 'nowrap',
                        fontWeight: '500'
                      }}
                    >
                      {item.time}
                    </span>

                    {/* Action: Quick Inspect Button if linked to Opportunity */}
                    {opp && onInspectOpportunity && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onInspectOpportunity(opp);
                        }}
                        style={{
                          border: '1px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          borderRadius: '4px',
                          padding: '0.2rem 0.5rem',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          color: '#0F172A',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          cursor: 'pointer'
                        }}
                        title="Open Quick Inspect"
                      >
                        <Eye size={12} /> Inspect
                      </button>
                    )}

                    {/* Action: Dismiss Button */}
                    <button
                      onClick={(e) => handleDismiss(e, item)}
                      title="Dismiss from feed"
                      style={{
                        border: 'none',
                        background: 'transparent',
                        color: '#94A3B8',
                        cursor: 'pointer',
                        padding: '2px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <X size={13} />
                    </button>

                    {/* Accordion Chevron */}
                    <span style={{ color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </span>
                  </div>
                </div>

                {/* Expanded Detail Panel */}
                {isExpanded && (
                  <div
                    style={{
                      padding: '0.85rem 1rem 1rem 1rem',
                      borderTop: '1px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.75rem'
                    }}
                  >
                    {/* Event Metadata Bar */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        flexWrap: 'wrap',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span>
                          <strong>Event ID:</strong> {item.id}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Actor:</strong> {item.actor}
                        </span>
                        <span>•</span>
                        <span>
                          <strong>Logged:</strong> {item.timestamp}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={(e) => handleToggleRead(e, item.id)}
                          style={{
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#F8FAFC',
                            borderRadius: '4px',
                            padding: '0.2rem 0.5rem',
                            fontSize: '0.7rem',
                            fontWeight: '600',
                            color: 'var(--text-main)',
                            cursor: 'pointer'
                          }}
                        >
                          {item.read ? 'Mark Unread' : 'Mark as Read'}
                        </button>
                      </div>
                    </div>

                    {/* Summary Context */}
                    <div
                      style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '6px',
                        padding: '0.65rem 0.85rem',
                        fontSize: '0.8rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.45',
                        border: '1px solid #E2E8F0'
                      }}
                    >
                      {item.summary}
                    </div>

                    {/* Linked Tender Card & Primary Action Buttons */}
                    {opp ? (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '1rem',
                          backgroundColor: '#EFF6FF',
                          border: '1px solid #BFDBFE',
                          borderRadius: '8px',
                          padding: '0.65rem 0.85rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#1E3A8A' }}>
                              {opp.name}
                            </span>
                            {opp.aiScore && (
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  fontWeight: '700',
                                  color: '#15803D',
                                  backgroundColor: '#DCFCE7',
                                  padding: '0.1rem 0.4rem',
                                  borderRadius: '4px'
                                }}
                              >
                                Score: {opp.aiScore}
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '0.725rem', color: '#3B82F6', marginTop: '2px' }}>
                            {opp.source} • {opp.location} • Value: {opp.value || '₹2.5 Cr'}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {onInspectOpportunity && (
                            <button
                              className="btn btn-primary"
                              onClick={() => onInspectOpportunity(opp)}
                              style={{
                                fontSize: '0.75rem',
                                padding: '0.35rem 0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                borderRadius: '6px'
                              }}
                            >
                              <Eye size={13} /> Inspect Tender
                            </button>
                          )}

                          {onPursueOpportunity && (
                            <button
                              onClick={() => onPursueOpportunity(opp)}
                              style={{
                                border: '1px solid #10B981',
                                backgroundColor: '#FFFFFF',
                                color: '#047857',
                                fontSize: '0.75rem',
                                fontWeight: '600',
                                padding: '0.35rem 0.75rem',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.35rem',
                                borderRadius: '6px',
                                cursor: 'pointer'
                              }}
                            >
                              <CheckCircle size={13} /> Pursue
                            </button>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                          onClick={() => navigate('/audit')}
                          style={{
                            border: '1px solid var(--border-color)',
                            backgroundColor: '#FFFFFF',
                            color: 'var(--text-main)',
                            fontSize: '0.75rem',
                            fontWeight: '600',
                            padding: '0.35rem 0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <ExternalLink size={13} /> Open Audit Trail Records
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
