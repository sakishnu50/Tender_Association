import React, { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';

export default function AddOpportunityModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
    source: 'World Bank',
    sector: 'Infrastructure',
    location: 'Karnataka, India',
    priority: 'High',
    status: 'New',
    office: 'Bangalore',
    deadline: '2026-10-15',
    value: '₹5.00 Crore'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && value.trim()) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project Name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format deadline to readable string like '15 Oct 2026' if it's a date string
      let formattedDeadline = formData.deadline;
      if (formData.deadline && formData.deadline.includes('-')) {
        const d = new Date(formData.deadline);
        if (!isNaN(d.getTime())) {
          formattedDeadline = d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        }
      }

      await onAdd({
        ...formData,
        deadline: formattedDeadline,
        country: formData.location.includes(',') ? formData.location.split(',').pop().trim() : 'India'
      });

      // Reset form on success
      setFormData({
        name: '',
        source: 'World Bank',
        sector: 'Infrastructure',
        location: 'Karnataka, India',
        priority: 'High',
        status: 'New',
        office: 'Bangalore',
        deadline: '2026-10-15',
        value: '₹5.00 Crore'
      });
      setError('');
      onClose();
    } catch (_err) {
      setError('Failed to add opportunity. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Plus size={18} />
            </div>
            <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Add New Opportunity
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            title="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          <div className="modal-body" style={{ overflowY: 'auto', padding: '1.25rem 1.5rem', gap: '0.875rem' }}>
            {error && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                backgroundColor: 'var(--danger-bg)',
                color: 'var(--danger-text)',
                padding: '0.65rem 0.875rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.85rem'
              }}>
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Project Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Project Name <span style={{ color: 'var(--danger)' }}>*</span>
              </label>
              <input
                id="add-opp-name"
                type="text"
                className="filter-select"
                placeholder="e.g. Smart City Infrastructure Expansion"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                autoFocus
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {/* Source */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Source</label>
                <select
                  id="add-opp-source"
                  className="filter-select"
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                >
                  <option value="World Bank">World Bank</option>
                  <option value="ADB">ADB</option>
                  <option value="JICA">JICA</option>
                  <option value="AIIB">AIIB</option>
                  <option value="AfDB">AfDB</option>
                  <option value="GeM">GeM</option>
                  <option value="TendersIndia">TendersIndia</option>
                </select>
              </div>

              {/* Sector */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Sector</label>
                <select
                  id="add-opp-sector"
                  className="filter-select"
                  value={formData.sector}
                  onChange={(e) => handleChange('sector', e.target.value)}
                >
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="Transport">Transport</option>
                  <option value="Water">Water</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Energy">Energy</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {/* Country / Location */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Country / Location</label>
                <input
                  id="add-opp-location"
                  type="text"
                  className="filter-select"
                  placeholder="e.g. Karnataka, India"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                />
              </div>

              {/* Office */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Office</label>
                <select
                  id="add-opp-office"
                  className="filter-select"
                  value={formData.office}
                  onChange={(e) => handleChange('office', e.target.value)}
                >
                  <option value="Bangalore">Bangalore</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Kolkata">Kolkata</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Hyderabad">Hyderabad</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {/* Priority */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Priority</label>
                <select
                  id="add-opp-priority"
                  className="filter-select"
                  value={formData.priority}
                  onChange={(e) => handleChange('priority', e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Status */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Status</label>
                <select
                  id="add-opp-status"
                  className="filter-select"
                  value={formData.status}
                  onChange={(e) => handleChange('status', e.target.value)}
                >
                  <option value="New">New</option>
                  <option value="In Review">In Review</option>
                  <option value="Pursued">Pursued</option>
                  <option value="Declined">Declined</option>
                  <option value="Closed">Closed</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
              {/* Deadline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Deadline</label>
                <input
                  id="add-opp-deadline"
                  type="date"
                  className="filter-select"
                  value={formData.deadline}
                  onChange={(e) => handleChange('deadline', e.target.value)}
                />
              </div>

              {/* Value */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)' }}>Estimated Value</label>
                <input
                  id="add-opp-value"
                  type="text"
                  className="filter-select"
                  placeholder="e.g. ₹5.00 Crore"
                  value={formData.value}
                  onChange={(e) => handleChange('value', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="submit-add-opportunity-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
