import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { officeBreakdownData } from '../../data/mockDashboardData';

const BAR_COLORS = ['#1D4ED8', '#2563EB', '#3B82F6', '#60A5FA'];

export default function OfficeBreakdown() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-4">
        Opportunities by Office
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart
          data={officeBreakdownData}
          margin={{ top: 4, right: 12, left: -8, bottom: 4 }}
          barCategoryGap="25%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis
            dataKey="office"
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 12, fill: '#64748B' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '0.5rem',
              border: '1px solid #E2E8F0',
              fontSize: '0.8125rem',
            }}
            cursor={{ fill: 'rgba(241,245,249,0.6)' }}
          />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={48}>
            {officeBreakdownData.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
