import React from 'react';
import { Briefcase, Clock, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { summaryData } from '../../data/mockDashboardData';

interface TileConfig {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentColor: string;   // Tailwind text colour class
  bgColor: string;       // Tailwind bg colour class for icon badge
}

const tiles: TileConfig[] = [
  {
    label: 'Total Opportunities',
    value: summaryData.totalOpportunities,
    icon: <Briefcase size={20} />,
    accentColor: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  {
    label: 'Pending Review',
    value: summaryData.pendingReview,
    icon: <Clock size={20} />,
    accentColor: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    label: 'High Priority',
    value: summaryData.highPriority,
    icon: <AlertTriangle size={20} />,
    accentColor: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    label: 'Pursued',
    value: summaryData.pursued,
    icon: <CheckCircle2 size={20} />,
    accentColor: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
];

export default function SummaryTiles() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {tiles.map((tile) => (
        <div
          key={tile.label}
          className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm
                     hover:shadow-md transition-shadow duration-200"
        >
          {/* Icon badge + label */}
          <div className="flex items-center gap-3 mb-3">
            <span className={`${tile.bgColor} ${tile.accentColor} rounded-lg p-2`}>
              {tile.icon}
            </span>
            <span className="text-sm font-medium text-slate-500">{tile.label}</span>
          </div>

          {/* Value */}
          <p className={`text-3xl font-extrabold tracking-tight ${tile.accentColor}`}>
            {tile.value}
          </p>
        </div>
      ))}
    </div>
  );
}
