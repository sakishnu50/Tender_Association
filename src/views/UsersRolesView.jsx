import React, { useMemo } from 'react';
import { UserPlus, Edit2, CheckCircle2 } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { useUsers } from '../hooks/useApiQueries';

export default function UsersRolesView({ searchVal = '' }) {
  const { data: fetchedUsers } = useUsers();
  const usersList = fetchedUsers || mockUsers;

  const filteredUsers = useMemo(() => {
    const term = (searchVal || '').trim().toLowerCase();
    if (!term) return usersList;
    return usersList.filter(u =>
      (u.name || '').toLowerCase().includes(term) ||
      (u.office || '').toLowerCase().includes(term) ||
      (u.role || '').toLowerCase().includes(term) ||
      (u.status || '').toLowerCase().includes(term)
    );
  }, [usersList, searchVal]);

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Users &amp; Roles</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {searchVal && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {filteredUsers.length} result{filteredUsers.length !== 1 ? 's' : ''} for &quot;{searchVal}&quot;
            </span>
          )}
          <button className="btn btn-primary">
            <UserPlus size={16} /> Add User
          </button>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Office</th>
                <th>Role</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: '600' }}>{u.name}</td>
                  <td>{u.office}</td>
                  <td><span className="badge badge-info">{u.role}</span></td>
                  <td>
                    <span className="badge badge-new" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <CheckCircle2 size={12} /> {u.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-outline" style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}>
                      <Edit2 size={12} /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
