import React from 'react';
import { AlertCircle, CalendarClock } from 'lucide-react';
import { highPriorityFeed, type HighPriorityItem } from '../../data/mockDashboardData';

const statusStyles: Record<HighPriorityItem['status'], string> = {
  Urgent: 'bg-red-100 text-red-700',
  'Under Review': 'bg-amber-100 text-amber-700',
  New: 'bg-emerald-100 text-emerald-700',
  'Closing Soon': 'bg-sky-100 text-sky-700',
};

export default function HighPriorityFeed() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle size={18} className="text-red-500" />
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          High-Priority Opportunities
        </h3>
      </div>

      {/* Feed list */}
      <ul className="flex flex-col gap-3">
        {highPriorityFeed.map((item) => (
          <li
            key={item.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between
                       gap-2 rounded-lg border border-slate-100 bg-slate-50 px-4 py-3
                       hover:bg-slate-100 transition-colors duration-150"
          >
            {/* Left: Name + deadline */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-800 truncate">
                {item.name}
              </p>
              <p className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
                <CalendarClock size={12} />
                {item.deadline}
              </p>
            </div>

            {/* Right: Score + status badge */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-sm font-bold text-blue-700">
                {item.score.toFixed(1)}
              </span>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5
                            text-xs font-semibold ${statusStyles[item.status]}`}
              >
                {item.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
