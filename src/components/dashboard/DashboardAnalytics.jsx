import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import { TrendingUp, BarChart2, PieChart as PieIcon, Building2 } from 'lucide-react';

const baseMonthlyTrendData = [
  { month: 'Apr', total: 18, highMatch: 8, pursued: 4 },
  { month: 'May', total: 24, highMatch: 11, pursued: 6 },
  { month: 'Jun', total: 32, highMatch: 15, pursued: 9 },
  { month: 'Jul', total: 28, highMatch: 14, pursued: 7 },
  { month: 'Aug', total: 42, highMatch: 21, pursued: 12 },
  { month: 'Sep', total: 35, highMatch: 18, pursued: 10 },
  { month: 'Oct', total: 48, highMatch: 26, pursued: 15 },
];

const baseAiScoreData = [
  { name: '9-10 (Excellent)', range: '9.0 - 10', count: 42, percentage: 40, color: '#10B981' },
  { name: '7-8 (High)', range: '8.0 - 8.9', count: 56, percentage: 28, color: '#0284C7' },
  { name: '5-6 (Moderate)', range: '7.0 - 7.9', count: 34, percentage: 18, color: '#F59E0B' },
  { name: '1-4 (Low)', range: '< 7.0', count: 18, percentage: 14, color: '#94A3B8' },
];

const baseSourceDistributionData = [
  { name: 'World Bank', value: 35, color: '#2563EB' },
  { name: 'ADB', value: 25, color: '#F59E0B' },
  { name: 'JICA', value: 20, color: '#10B981' },
  { name: 'AIIB / Others', value: 20, color: '#0284C7' },
];

const baseRegionalOfficeData = [
  { office: 'Chennai', tenders: 14, budgetCr: 12.5 },
  { office: 'Bangalore', tenders: 12, budgetCr: 15.2 },
  { office: 'Coimbatore', tenders: 8, budgetCr: 6.8 },
  { office: 'Mumbai', tenders: 8, budgetCr: 11.4 },
];

// Custom Tooltip component for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        backgroundColor: 'var(--sidebar-bg)',
        color: '#FFFFFF',
        padding: '0.6rem 0.85rem',
        borderRadius: '0.5rem',
        fontSize: '0.75rem',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <p style={{ fontWeight: '700', marginBottom: '0.35rem', color: '#93C5FD' }}>{label || payload[0].name}</p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.fill || entry.color }} />
            <span style={{ color: '#E2E8F0' }}>{entry.name}:</span>
            <span style={{ fontWeight: '700', color: '#FFFFFF' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardAnalytics({ timeRange = 'month' }) {
  // Default activeTab to 'all' so ALL charts (Pipeline, AI Score Donut, Source Pie) are displayed together on dashboard
  const [activeTab, setActiveTab] = useState('all');

  // Compute scaled chart data dynamically based on selected timeRange filter ('week', 'month', 'quarter', 'all')
  const { trendData, aiScoreData, sourceData, officeData, totalOppCount } = useMemo(() => {
    let multiplier = 1;
    let trendSliced = baseMonthlyTrendData;

    if (timeRange === 'week') {
      multiplier = 0.4;
      trendSliced = [
        { month: 'Mon', total: 6, highMatch: 3, pursued: 1 },
        { month: 'Tue', total: 8, highMatch: 4, pursued: 2 },
        { month: 'Wed', total: 12, highMatch: 6, pursued: 3 },
        { month: 'Thu', total: 9, highMatch: 5, pursued: 2 },
        { month: 'Fri', total: 15, highMatch: 8, pursued: 4 },
        { month: 'Sat', total: 7, highMatch: 4, pursued: 2 },
        { month: 'Sun', total: 5, highMatch: 2, pursued: 1 },
      ];
    } else if (timeRange === 'month') {
      multiplier = 1;
      trendSliced = baseMonthlyTrendData.slice(-4);
    } else if (timeRange === 'quarter') {
      multiplier = 2.4;
      trendSliced = baseMonthlyTrendData;
    } else {
      multiplier = 3.5;
      trendSliced = baseMonthlyTrendData;
    }

    const aiScaled = baseAiScoreData.map(item => ({
      ...item,
      count: Math.round(item.count * multiplier)
    }));

    const totalCount = aiScaled.reduce((acc, curr) => acc + curr.count, 0);

    return {
      trendData: trendSliced,
      aiScoreData: aiScaled,
      sourceData: baseSourceDistributionData.map(item => ({ ...item, value: Math.round(item.value * multiplier) })),
      officeData: baseRegionalOfficeData.map(item => ({ ...item, tenders: Math.round(item.tenders * multiplier) })),
      totalOppCount: totalCount || 150
    };
  }, [timeRange]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '24px', marginBottom: '32px' }}>
      {/* Analytics Navigation Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--text-main)' }}>
            Interactive Performance Analytics
          </span>
          <span style={{
            fontSize: '0.7rem',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            fontWeight: '600',
            textTransform: 'capitalize'
          }}>
            Filter: {timeRange === 'all' ? 'All Time' : `This ${timeRange}`}
          </span>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '0.4rem', backgroundColor: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'all' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.15s'
            }}
          >
            All Charts
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'pipeline' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'pipeline' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.15s'
            }}
          >
            <TrendingUp size={14} /> Growth Pipeline
          </button>

          <button
            onClick={() => setActiveTab('aiScores')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'aiScores' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'aiScores' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.15s'
            }}
          >
            <BarChart2 size={14} /> AI Score Match
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            style={{
              padding: '0.35rem 0.75rem',
              fontSize: '0.75rem',
              fontWeight: '600',
              borderRadius: '0.375rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'sources' ? 'var(--primary)' : 'transparent',
              color: activeTab === 'sources' ? '#FFFFFF' : 'var(--text-muted)',
              transition: 'all 0.15s'
            }}
          >
            <PieIcon size={14} /> Sources & Offices
          </button>
        </div>
      </div>

      {/* Analytics Grid: 3-column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        
        {/* Chart 1: Opportunities Trend */}
        {(activeTab === 'pipeline' || activeTab === 'all') && (
          <div className="card" style={{ gridColumn: activeTab === 'pipeline' ? '1 / -1' : 'span 1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                  Opportunities Trend
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Volume trajectory ({timeRange === 'all' ? 'All Time' : `This ${timeRange}`})
                </p>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>2028</span>
            </div>

            <div style={{ width: '100%', height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284C7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284C7" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pursuedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#0284C7" strokeWidth={3} fillOpacity={1} fill="url(#totalGrad)" name="Total Identified" />
                  <Area type="monotone" dataKey="pursued" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#pursuedGrad)" name="Pursued Tenders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: AI Score Distribution Donut Chart (Restored) */}
        {(activeTab === 'aiScores' || activeTab === 'all') && (
          <div className="card">
            <div style={{ marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                AI Score Distribution
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Compatibility index breakdown
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', gap: '1.25rem' }}>
              {/* Donut Chart Container with Center Text */}
              <div style={{ width: '120px', height: '120px', position: 'relative' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiScoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={38}
                      outerRadius={56}
                      paddingAngle={3}
                      dataKey="count"
                    >
                      {aiScoreData.map((entry, index) => (
                        <Cell key={`ai-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      position={{ y: -45 }}
                      wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                      allowEscapeViewBox={{ x: true, y: true }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                
                {/* Center Label inside Donut Hole */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: 'none'
                }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                    {totalOppCount}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Total</span>
                </div>
              </div>

              {/* Side Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                {aiScoreData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color }} />
                    <span style={{ color: 'var(--text-main)' }}>
                      <strong>{item.range}</strong> ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chart 3: Source Distribution Pie Chart (Restored) */}
        {(activeTab === 'sources' || activeTab === 'all') && (
          <div className="card">
            <div style={{ marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                Source Distribution
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Origin agency proportions
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '170px', gap: '1.25rem' }}>
              {/* Pie Chart */}
              <div style={{ width: '120px', height: '120px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={56}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`src-cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={<CustomTooltip />}
                      position={{ y: -45 }}
                      wrapperStyle={{ zIndex: 1000, pointerEvents: 'none' }}
                      allowEscapeViewBox={{ x: true, y: true }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Side Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.75rem' }}>
                {sourceData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '2px', backgroundColor: item.color }} />
                    <span style={{ color: 'var(--text-main)' }}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chart 4: Regional Office Volume Bar Chart (when Sources tab active) */}
        {activeTab === 'sources' && (
          <div className="card">
            <div style={{ marginBottom: '0.5rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={16} color="var(--primary)" /> Regional Office Volume
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Tenders allocated per local office
              </p>
            </div>

            <div style={{ width: '100%', height: 170 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={officeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="office" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tenders" fill="#0284C7" radius={[4, 4, 0, 0]} name="Assigned Tenders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
