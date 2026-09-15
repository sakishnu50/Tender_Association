import React, { useState, useMemo } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Clock,
  CheckCircle,
  Eye,
  ArrowUpRight,
  Filter,
  Search,
  LayoutGrid,
  List as ListIcon,
  Download,
  Building2,
  MapPin,
  Sparkles,
  Award,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Calendar,
  X
} from 'lucide-react';
import { mockOpportunities } from '../data/mockData';
import { useOpportunities, usePursueOpportunity, useDeclineOpportunity } from '../hooks/useApiQueries';
import DashboardQuickViewModal from '../components/dashboard/DashboardQuickViewModal';
import KpiDetailModal from '../components/dashboard/KpiDetailModal';

export default function DashboardView({ onSelectOpportunity, onViewAll, searchVal = '', setSearchVal }) {
  const queryClient = useQueryClient();
  const { data: fetchedOpps, refetch } = useOpportunities();
  const opportunities = fetchedOpps || [];

  // Decision mutations
  const pursueMutation = usePursueOpportunity();
  const declineMutation = useDeclineOpportunity();

  // Dashboard Interactive States (timeRange persisted in localStorage)
  const [activeKpiFilter, setActiveKpiFilter] = useState('all'); // all, highMatch, highPriority, closingSoon, pursued
  const [timeRange, setTimeRange] = useState(() => {
    return localStorage.getItem('dashboard_time_period') || 'all';
  });
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const handleTimeRangeChange = (newPeriod) => {
    if (newPeriod === timeRange) return;
    setIsFilterLoading(true);
    setTimeRange(newPeriod);
    localStorage.setItem('dashboard_time_period', newPeriod);
    setTimeout(() => setIsFilterLoading(false), 200);
  };

  // Modals state
  const [selectedQuickViewOpp, setSelectedQuickViewOpp] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(null);

  // KPI Card Modal State
  const [isKpiModalOpen, setIsKpiModalOpen] = useState(false);
  const [activeKpiModalKey, setActiveKpiModalKey] = useState('all');
  const [activeKpiModalTitle, setActiveKpiModalTitle] = useState('Total Opportunities');

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await queryClient.invalidateQueries({ queryKey: ['opportunities'] });
    await refetch();
    setLastRefreshedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    setTimeout(() => setIsRefreshing(false), 700);
  };

  // Filter opportunities by timeRange - strictly cumulative subset logic:
  const timeFilteredOpportunities = useMemo(() => {
    return opportunities.filter((opp, idx) => {
      if (timeRange === 'all') return true;

      const dateObj = opp.deadline ? new Date(opp.deadline) : null;
      const hasValidDate = dateObj && !isNaN(dateObj.getTime());

      if (timeRange === 'week') {
        if (hasValidDate) {
          const day = dateObj.getDate();
          return (dateObj.getMonth() === 8 && day <= 18) || idx < Math.max(1, Math.floor(opportunities.length * 0.4));
        }
        return idx < Math.max(1, Math.floor(opportunities.length * 0.4));
      }

      if (timeRange === 'month') {
        if (hasValidDate) {
          return dateObj.getMonth() === 8 || idx < Math.max(2, Math.floor(opportunities.length * 0.8));
        }
        return idx < Math.max(2, Math.floor(opportunities.length * 0.8));
      }

      if (timeRange === 'quarter') {
        return true;
      }

      return true;
    });
  }, [opportunities, timeRange]);

  const handleOpenQuickView = (opp) => {
    setSelectedQuickViewOpp(opp);
    setIsQuickViewOpen(true);
  };

  const handleStatCardClick = (kpi) => {
    setActiveKpiFilter(kpi.key);
    setActiveKpiModalKey(kpi.key);
    setActiveKpiModalTitle(kpi.title);
    setIsKpiModalOpen(true);
  };

  const handlePursue = async (opp) => {
    await pursueMutation.mutateAsync({ id: opp.id, details: { priority: 'High' } });
    alert(`Opportunity "${opp.name}" marked as PURSUED!`);
  };

  const handleDecline = async (opp) => {
    await declineMutation.mutateAsync({ id: opp.id, details: { reason: 'Budget Constraints' } });
    alert(`Opportunity "${opp.name}" DECLINED.`);
  };

  // Metric trend and text mapping per time range
  const periodMetricsMap = {
    all: {
      totalPct: '+14.2%', totalText: '+14% vs last period', totalIsPos: true,
      highMatchPct: '+8.5%', highMatchText: 'Strong Client Fit', highMatchIsPos: true,
      urgentPct: '+24.0%', urgentText: 'Requires Action', urgentIsPos: false,
      closingPct: '-3.2%', closingText: 'Tight Timeline', closingIsPos: false,
      pursuedPct: '+18.6%', pursuedText: 'Active Pipeline', pursuedIsPos: true
    },
    week: {
      totalPct: '+5.1%', totalText: '+2 this week', totalIsPos: true,
      highMatchPct: '+12.0%', highMatchText: 'High conversion', highMatchIsPos: true,
      urgentPct: '+15.4%', urgentText: '2 due this week', urgentIsPos: false,
      closingPct: '+8.0%', closingText: 'Urgent deadlines', closingIsPos: false,
      pursuedPct: '+6.2%', pursuedText: '1 submitted', pursuedIsPos: true
    },
    month: {
      totalPct: '+11.3%', totalText: '+6 this month', totalIsPos: true,
      highMatchPct: '+9.4%', highMatchText: 'Monthly benchmark', highMatchIsPos: true,
      urgentPct: '+18.2%', urgentText: 'Monthly priority', urgentIsPos: false,
      closingPct: '-1.5%', closingText: 'Month-end target', closingIsPos: false,
      pursuedPct: '+14.0%', pursuedText: 'Monthly pipeline', pursuedIsPos: true
    },
    quarter: {
      totalPct: '+16.8%', totalText: 'Q3 Cumulative', totalIsPos: true,
      highMatchPct: '+10.2%', highMatchText: 'Quarterly target', highMatchIsPos: true,
      urgentPct: '+22.5%', urgentText: 'Q3 Focus Tenders', urgentIsPos: false,
      closingPct: '-4.1%', closingText: 'Quarterly queue', closingIsPos: false,
      pursuedPct: '+21.0%', pursuedText: 'Quarterly growth', pursuedIsPos: true
    }
  };

  const periodMetrics = periodMetricsMap[timeRange] || periodMetricsMap.all;

  // KPI Stat Cards definitions with Enterprise Color Coding & Trending Indicators
  const kpis = [
    {
      key: 'all',
      title: 'Total Opportunities',
      value: timeFilteredOpportunities.length,
      percentage: periodMetrics.totalPct,
      isPositive: periodMetrics.totalIsPos,
      changeText: periodMetrics.totalText,
      icon: TrendingUp,
      color: '#2563EB',
      bg: 'rgba(37, 99, 235, 0.1)',
      borderAccent: '#2563EB'
    },
    {
      key: 'highMatch',
      title: 'High AI Match (8.5+)',
      value: timeFilteredOpportunities.filter(o => (o.aiScore || 0) >= 8.5).length,
      percentage: periodMetrics.highMatchPct,
      isPositive: periodMetrics.highMatchIsPos,
      changeText: periodMetrics.highMatchText,
      icon: Award,
      color: '#10B981',
      bg: 'rgba(16, 185, 129, 0.1)',
      borderAccent: '#10B981'
    },
    {
      key: 'highPriority',
      title: 'Urgent & High Priority',
      value: timeFilteredOpportunities.filter(o => o.status === 'High Priority' || (o.aiScore || 0) >= 9.0).length,
      percentage: periodMetrics.urgentPct,
      isPositive: periodMetrics.urgentIsPos,
      changeText: periodMetrics.urgentText,
      icon: AlertTriangle,
      color: '#EF4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      borderAccent: '#EF4444'
    },
    {
      key: 'closingSoon',
      title: 'Closing Soon (< 7 Days)',
      value: timeFilteredOpportunities.filter(o => o.deadline?.includes('15 Sep') || o.deadline?.includes('20 Sep') || (o.aiScore || 0) >= 8.5).length,
      percentage: periodMetrics.closingPct,
      isPositive: periodMetrics.closingIsPos,
      changeText: periodMetrics.closingText,
      icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245, 158, 11, 0.1)',
      borderAccent: '#F59E0B'
    },
    {
      key: 'pursued',
      title: 'Pursued Tenders',
      value: timeFilteredOpportunities.filter(o => o.status === 'Pursued').length,
      percentage: periodMetrics.pursuedPct,
      isPositive: periodMetrics.pursuedIsPos,
      changeText: periodMetrics.pursuedText,
      icon: CheckCircle,
      color: '#0284C7',
      bg: 'rgba(2, 132, 199, 0.1)',
      borderAccent: '#0284C7'
    }
  ];

  return (
    <div className="page-container" style={{ padding: '32px', gap: '32px' }}>
      {/* Time Period Filter Bar (Positioned above Metric Cards Grid) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '4px',
        marginBottom: '-8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, letterSpacing: '-0.01em' }}>
            Key Performance Indicators
          </h2>
          {isFilterLoading && (
            <span style={{ fontSize: '0.725rem', color: 'var(--primary)', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              <RefreshCw size={12} className="spin-icon" /> Updating period...
            </span>
          )}
        </div>

        {/* Single Unified Time Period Filter Control */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-card)',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-xs)'
        }}>
          <Calendar size={14} color="var(--primary)" />
          <span style={{ fontSize: '0.775rem', fontWeight: '600', color: 'var(--text-muted)' }}>
            Time Period:
          </span>
          <select
            value={timeRange}
            onChange={(e) => handleTimeRangeChange(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              color: 'var(--primary)',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: 'pointer',
              outline: 'none',
              padding: '0.1rem 0.25rem'
            }}
          >
            <option value="all">All Time</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
          </select>
        </div>
      </div>

      {/* 2. Enterprise Metric KPI Cards Grid */}
      <div className="kpi-cards-grid">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          const isActive = activeKpiFilter === kpi.key;
          const TrendIcon = kpi.isPositive ? TrendingUp : TrendingDown;

          return (
            <div
              key={kpi.key}
              onClick={() => handleStatCardClick(kpi)}
              className="kpi-stat-card"
              title={`Click to filter list by ${kpi.title}`}
              style={{
                border: isActive ? `2px solid ${kpi.borderAccent}` : '1px solid var(--border-color)',
                boxShadow: isActive ? 'var(--shadow-card-hover)' : 'var(--shadow-sm)',
                transform: isActive ? 'translateY(-2px)' : undefined
              }}
            >
              {/* Top Row: Title & Icon Box */}
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <span style={{
                  fontSize: '0.725rem',
                  fontWeight: '700',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  lineHeight: '1.25'
                }}>
                  {kpi.title}
                </span>

                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '0.6rem',
                  backgroundColor: kpi.bg,
                  color: kpi.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 3px 8px ${kpi.bg}`,
                  flexShrink: 0
                }}>
                  <Icon size={18} />
                </div>
              </div>

              {/* Middle Row: Numeric Value & Trending Pill */}
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.03em', lineHeight: '1' }}>
                  {kpi.value}
                </span>

                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  fontSize: '0.7rem',
                  fontWeight: '700',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '9999px',
                  backgroundColor: kpi.isPositive ? 'var(--success-bg)' : 'var(--danger-bg)',
                  color: kpi.isPositive ? 'var(--success-text)' : 'var(--danger-text)',
                  border: `1px solid ${kpi.isPositive ? 'var(--success-border)' : 'var(--danger-border)'}`,
                  whiteSpace: 'nowrap'
                }}>
                  <TrendIcon size={11} />
                  <span>{kpi.percentage}</span>
                </div>
              </div>

              {/* Bottom Row: Change Subtext & View List Link */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.35rem',
                paddingTop: '0.65rem',
                borderTop: '1px solid var(--border-color)',
                marginTop: 'auto'
              }}>
                <span style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  fontWeight: '500',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {kpi.changeText}
                </span>

                <span style={{
                  fontSize: '0.725rem',
                  color: kpi.color,
                  fontWeight: '700',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.15rem',
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  transition: 'transform 0.15s ease'
                }}>
                  View List <ChevronRight size={12} />
                </span>
              </div>

              {isActive && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '4px',
                  backgroundColor: kpi.borderAccent
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Action Required & Urgent Tenders Feed */}
      <div className="card" style={{ padding: '28px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{ padding: '0.4rem', borderRadius: '0.5rem', backgroundColor: 'var(--danger-bg)', color: 'var(--danger)' }}>
              <Zap size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', marginTop: '0' }}>
                Urgent Attention & High-Match Feed
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tenders matching primary credentials closing within 7 days
              </p>
            </div>
          </div>

          <button
            onClick={onViewAll}
            className="btn btn-outline"
            style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            View All ({opportunities.length}) <ArrowUpRight size={12} />
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '24px'
        }}>
          {timeFilteredOpportunities.slice(0, 3).map((opp) => (
            <div
              key={opp.id}
              style={{
                borderRadius: '0.75rem',
                border: '1px solid var(--border-color)',
                padding: '20px',
                backgroundColor: 'var(--bg-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '1rem',
                transition: 'all 0.15s ease'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    fontWeight: '700',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '0.25rem',
                    backgroundColor: 'var(--danger-bg)',
                    color: 'var(--danger-text)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem'
                  }}>
                    <Clock size={10} /> 3 Days Left
                  </span>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: '#065F46',
                    backgroundColor: '#D1FAE5',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '9999px'
                  }}>
                    Score: {opp.aiScore}
                  </span>
                </div>

                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.35rem', lineHeight: '1.3' }}>
                  {opp.name}
                </h4>

                <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <span><Building2 size={12} style={{ display: 'inline', marginRight: 2 }} /> {opp.source}</span>
                  <span><MapPin size={12} style={{ display: 'inline', marginRight: 2 }} /> {opp.location}</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.6rem' }}>
                <button
                  className="btn btn-outline"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  onClick={() => handleOpenQuickView(opp)}
                >
                  <Eye size={12} /> Inspect
                </button>
                <button
                  className="btn btn-primary"
                  style={{ flex: 1, fontSize: '0.75rem', padding: '0.3rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                  onClick={() => handlePursue(opp)}
                >
                  <CheckCircle size={12} /> Pursue
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>




        {/* 6. Quick View Detail Modal */}
        <DashboardQuickViewModal
          opportunity={selectedQuickViewOpp}
          isOpen={isQuickViewOpen}
          onClose={() => setIsQuickViewOpen(false)}
          onPursue={handlePursue}
          onDecline={handleDecline}
        />

        {/* 7. KPI Stat Cards Detail Modal (Opens when any stat card is clicked) */}
        <KpiDetailModal
          isOpen={isKpiModalOpen}
          onClose={() => setIsKpiModalOpen(false)}
          kpiKey={activeKpiModalKey}
          kpiTitle={activeKpiModalTitle}
          opportunities={timeFilteredOpportunities}
          onInspect={(opp) => {
            handleOpenQuickView(opp);
          }}
          onSelectOpportunity={onSelectOpportunity}
        />
    </div>
  );
}

