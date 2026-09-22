// src/types/audit.ts

export type PriorityLevel = 'High' | 'Medium' | 'Low' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface AuditRecord {
  id: string;
  timestamp: string;
  date?: string;
  user: string;
  userName?: string;
  userRole?: string;
  action: string;
  opportunityId?: string;
  recordId?: string;
  opportunity?: string;
  opportunityTitle?: string;
  recordName?: string;
  office?: string;
  details?: string;
  previousValue?: string | null;
  newValue?: string | null;
  previousPriority?: string | null;
  newPriority?: string | null;
  change?: string;
  priority?: PriorityLevel;
  currentPriority?: 'High' | 'Medium' | 'Low';
  aiScore?: number | string;
  score?: number | string;
  source?: string;
  createdAt?: string;
}

export interface AuditTableProps {
  logs: AuditRecord[];
  onRowClick?: (log: AuditRecord) => void;
  onEdit?: (log: AuditRecord) => void;
  currentPage?: number;
  totalPages?: number;
  totalRecords?: number;
  rowsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export interface AuditFiltersProps {
  users: string[];
  actions: string[];
  priorities: string[];
  dateOptions: string[];
  selectedUser: string;
  setSelectedUser: (user: string) => void;
  selectedAction: string;
  setSelectedAction: (action: string) => void;
  selectedPriority: string;
  setSelectedPriority: (priority: string) => void;
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
  clearAllFilters: () => void;
  hasActiveFilters: boolean;
  searchVal: string;
  setSearchVal: (search: string) => void;
}
