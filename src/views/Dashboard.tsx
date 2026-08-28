import React from 'react';
import SummaryTiles from '../components/dashboard/SummaryTiles';
import OfficeBreakdown from '../components/dashboard/OfficeBreakdown';
import HighPriorityFeed from '../components/dashboard/HighPriorityFeed';

export default function Dashboard() {
  return (
    <div className="page-container">
      {/* Section heading */}
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">
        Dashboard Overview
      </h2>

      {/* KPI summary row */}
      <SummaryTiles />

      {/* Chart + Feed row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <OfficeBreakdown />
        <HighPriorityFeed />
      </div>
    </div>
  );
}
