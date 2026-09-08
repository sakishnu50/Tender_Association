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
  Tooltip
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
        backgroundColor: '#0F172A',
        color: '#FFFFFF',
        padding: '0.65rem 0.95rem',
        borderRadius: '0.6rem',
        fontSize: '0.775rem',
        boxShadow: '0 10px 25px -5px rgba(15, 23, 42, 0.4)',
        border: '1px solid #1E293B',
        zIndex: 1000
      }}>
        <p style={{ fontWeight: '700', marginBottom: '0.4rem', color: '#60A5FA', borderBottom: '1px solid #1E293B', paddingBottom: '0.2rem' }}>
          {label || payload[0].name}
        </p>
        {payload.map((entry, index) => (
          <div key={`item-${index}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.8rem', marginTop: '0.25rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#94A3B8' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: entry.fill || entry.color }} />
              {entry.name}:
            </span>
            <span style={{ fontWeight: '700', color: '#F8FAFC' }}>{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export default function DashboardAnalytics({ timeRange = 'month' }) {
  // Default activeTab to 'all' so ALL charts are displayed together on dashboard
  const [activeTab, setActiveTab] = useState('all');

  // Compute scaled chart data dynamically based on selected timeRange filter
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginTop: '16px', marginBottom: '32px' }}>
      {/* Analytics Navigation Header Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.85rem',
        borderBottom: '1px solid var(--border-color)',
        paddingBottom: '0.85rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '0.5rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <BarChart2 size={18} />
          </div>
          <div>
            <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.01em' }}>
              Performance Analytics & Visualizations
            </span>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Interactive insights aggregated for {timeRange === 'all' ? 'All Time' : `This ${timeRange.charAt(0).toUpperCase() + timeRange.slice(1)}`}
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{
          display: 'flex',
          gap: '0.3rem',
          backgroundColor: 'var(--bg-subtle)',
          padding: '0.3rem',
          borderRadius: '0.6rem',
          border: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => setActiveTab('all')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: '700',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'all' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'all' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'all' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            All Charts
          </button>

          <button
            onClick={() => setActiveTab('pipeline')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: '700',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'pipeline' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'pipeline' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'pipeline' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <TrendingUp size={14} /> Pipeline Trend
          </button>

          <button
            onClick={() => setActiveTab('aiScores')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: '700',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'aiScores' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'aiScores' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'aiScores' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <BarChart2 size={14} /> AI Scores
          </button>

          <button
            onClick={() => setActiveTab('sources')}
            style={{
              padding: '0.4rem 0.85rem',
              fontSize: '0.775rem',
              fontWeight: '700',
              borderRadius: '0.4rem',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: activeTab === 'sources' ? 'var(--bg-card)' : 'transparent',
              color: activeTab === 'sources' ? 'var(--primary)' : 'var(--text-muted)',
              boxShadow: activeTab === 'sources' ? 'var(--shadow-xs)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <PieIcon size={14} /> Sources
          </button>
        </div>
      </div>

      {/* Analytics Grid: 3-column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
        
        {/* Chart 1: Opportunities Trend */}
        {(activeTab === 'pipeline' || activeTab === 'all') && (
          <div className="card" style={{
            gridColumn: activeTab === 'pipeline' ? '1 / -1' : 'span 1',
            borderRadius: '0.85rem',
            border: '1px solid var(--border-color)',
            padding: '24px',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Opportunities Growth Pipeline
                </h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                  Identified vs Pursued trajectory
                </p>
              </div>
              <span style={{
                fontSize: '0.7rem',
                fontWeight: '700',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                padding: '0.15rem 0.55rem',
                borderRadius: '9999px',
                border: '1px solid var(--primary-border)'
              }}>
                Monthly Velocity
              </span>
            </div>

            <div style={{ width: '100%', height: 210 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="pursuedGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="total" stroke="#2563EB" strokeWidth={3} fillOpacity={1} fill="url(#totalGrad)" name="Total Identified" />
                  <Area type="monotone" dataKey="pursued" stroke="#10B981" strokeWidth={3} fillOpacity={1} fill="url(#pursuedGrad)" name="Pursued Tenders" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Chart 2: AI Score Distribution Donut Chart */}
        {(activeTab === 'aiScores' || activeTab === 'all') && (
          <div className="card" style={{ borderRadius: '0.85rem', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                AI Compatibility Breakdown
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Distribution of match scores across opportunity pool
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '190px', gap: '1.25rem' }}>
              {/* Donut Chart Container with Center Text */}
              <div style={{ width: '130px', height: '130px', position: 'relative', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aiScoreData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={60}
                      paddingAngle={4}
                      dataKey="count"
                    >
                      {aiScoreData.map((entry, index) => (
                        <Cell key={`ai-cell-${index}`} fill={entry.color} cornerRadius={4} />
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
                  <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: '1' }}>
                    {totalOppCount}
                  </span>
                  <span style={{ fontSize: '0.675rem', fontWeight: '600', color: 'var(--text-muted)', marginTop: '2px' }}>Total Tenders</span>
                </div>
              </div>

              {/* Side Legend */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.775rem' }}>
                {aiScoreData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)' }}>
                      <strong>{item.range}</strong> ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chart 3: Source Distribution Pie Chart */}
        {(activeTab === 'sources' || activeTab === 'all') && (
          <div className="card" style={{ borderRadius: '0.85rem', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Tender Source Distribution
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Multilateral agency & institutional origin
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '190px', gap: '1.25rem' }}>
              {/* Pie Chart */}
              <div style={{ width: '130px', height: '130px', flexShrink: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={sourceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={0}
                      outerRadius={60}
                      paddingAngle={3}
                      dataKey="value"
                    >
                      {sourceData.map((entry, index) => (
                        <Cell key={`src-cell-${index}`} fill={entry.color} cornerRadius={3} />
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.775rem' }}>
                {sourceData.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: item.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>
                      {item.name} ({item.value})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chart 4: Regional Office Volume Bar Chart */}
        {activeTab === 'sources' && (
          <div className="card" style={{ borderRadius: '0.85rem', border: '1px solid var(--border-color)', padding: '24px', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Building2 size={16} color="var(--primary)" /> Regional Office Allocation
              </h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, marginTop: '2px' }}>
                Active tenders assigned per regional office
              </p>
            </div>

            <div style={{ width: '100%', height: 190 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={officeData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                  <XAxis dataKey="office" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} />
                  <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="tenders" fill="#2563EB" radius={[6, 6, 0, 0]} name="Assigned Tenders" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

