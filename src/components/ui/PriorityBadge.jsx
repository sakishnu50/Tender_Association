import React from 'react';
import { AlertTriangle, TrendingUp } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  const map = {
    HIGH:   { cls: 'priority-high',   icon: <AlertTriangle size={11} />, label: 'High Priority' },
    MEDIUM: { cls: 'priority-medium', icon: <TrendingUp    size={11} />, label: 'Medium Priority' },
    LOW:    { cls: 'priority-low',    icon: null,                        label: 'Low Priority' }
  };
  const cfg = map[priority] || map.LOW;
  return (
    <span className={`priority-badge ${cfg.cls}`}>
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
