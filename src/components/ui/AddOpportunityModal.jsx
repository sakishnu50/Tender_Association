import React, { useState } from 'react';
<<<<<<< HEAD
import { X } from 'lucide-react';

function formatDateDisplay(dateStr) {
  if (!dateStr) return '';
  const dateObj = new Date(dateStr);
  if (isNaN(dateObj.getTime())) return dateStr;
  const day = String(dateObj.getDate()).padStart(2, '0');
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[dateObj.getMonth()];
  const year = dateObj.getFullYear();
  return `${day} ${month} ${year}`;
}

function generateAiScore() {
  const min = 7.8;
  const max = 9.4;
  const rand = Math.random() * (max - min) + min;
  return Number(rand.toFixed(1));
}
=======
import { X, Plus, AlertCircle } from 'lucide-react';
>>>>>>> origin/main

export default function AddOpportunityModal({ isOpen, onClose, onAdd }) {
  const [formData, setFormData] = useState({
    name: '',
<<<<<<< HEAD
    source: '',
    sector: '',
    location: '',
    deadline: ''
  });
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      source: '',
      sector: '',
      location: '',
      deadline: ''
    });
    setErrorMsg('');
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.source.trim() ||
      !formData.sector.trim() ||
      !formData.location.trim() ||
      !formData.deadline.trim()
    ) {
      setErrorMsg('Please fill in all required fields before adding the opportunity.');
      return;
    }

    const calculatedScore = generateAiScore();
    const formattedDeadline = formatDateDisplay(formData.deadline);
    const uniqueId = `OPP-${Date.now().toString().slice(-4)}`;

    const newOpportunity = {
      id: uniqueId,
      name: formData.name.trim(),
      title: formData.name.trim(),
      source: formData.source.trim(),
      sector: formData.sector.trim(),
      location: formData.location.trim(),
      country: formData.location.includes(',') ? formData.location.split(',').pop().trim() : 'India',
      deadline: formattedDeadline,
      aiScore: calculatedScore,
      overallScore: calculatedScore,
      status: 'New',
      priority: calculatedScore >= 8.5 ? 'HIGH' : 'MEDIUM',
      matchLevel: calculatedScore >= 9.0 ? 'Strong Match' : calculatedScore >= 8.0 ? 'High Match' : 'Moderate Match',
      value: '₹5.00 Crore',
      description: `Newly submitted opportunity: ${formData.name.trim()} in ${formData.sector.trim()} sector.`,
      sourceUrl: 'https://projects.worldbank.org/en/projects-operations',
      scoreBreakdown: [
        { label: 'Sector Match', score: Math.min(10, calculatedScore + 0.2), max: 10 },
        { label: 'Country/Market Match', score: calculatedScore, max: 10 },
        { label: 'Past Experience', score: Math.max(7.0, calculatedScore - 0.3), max: 10 },
        { label: 'Capability Match', score: calculatedScore, max: 10 },
        { label: 'Strategic/Priority Fit', score: calculatedScore, max: 10 }
      ],
      aiAnalysis: {
        summary: `Automated analysis for ${formData.name.trim()}: The opportunity strongly matches historical capability in ${formData.sector.trim()}.`,
        strengths: [`Strong alignment with ${formData.sector.trim()}`, `Strategic geographic fit in ${formData.location.trim()}`],
        risks: ['Review bid timeline and documentation requirements'],
        recommendation: calculatedScore >= 8.5 ? 'Highly Recommended – Pursue' : 'Recommended – Evaluate'
      },
      similarProjects: [],
      documents: ['Tender_Brief.pdf'],
      auditTrail: [
        {
          id: `AT-${Date.now().toString().slice(-3)}`,
          action: 'Opportunity Added',
          actor: 'User',
          role: 'Admin',
          date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'create'
        }
      ]
    };

    onAdd(newOpportunity);
    handleCancel();
  };

  return (
    <div
      className="modal-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleCancel();
      }}
    >
      <div className="modal-card" style={{ maxWidth: '500px', width: '90%' }}>
        {/* Header */}
        <div className="modal-header">
          <h3 style={{ fontSize: '1.125rem', fontWeight: '700', color: 'var(--text-main)' }}>
            Add Opportunity
          </h3>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              padding: '0.25rem'
            }}
            aria-label="Close"
=======
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
>>>>>>> origin/main
          >
            <X size={18} />
          </button>
        </div>

<<<<<<< HEAD
        {/* Form Body */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ gap: '0.875rem', padding: '1.25rem 1.5rem' }}>
            {errorMsg && (
              <div
                style={{
                  backgroundColor: 'var(--danger-bg, #fee2e2)',
                  color: 'var(--danger-text, #991b1b)',
                  border: '1px solid var(--danger, #ef4444)',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8125rem'
                }}
              >
                {errorMsg}
              </div>
            )}

            {/* 1. Project Name */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Project Name <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Coastal Highway Widening Project"
                value={formData.name}
                onChange={(e) => handleFieldChange('name', e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* 2. Source */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Source <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleFieldChange('source', e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="">Select Source</option>
                <option value="World Bank">World Bank</option>
                <option value="ADB">ADB</option>
                <option value="JICA">JICA</option>
                <option value="AIIB">AIIB</option>
                <option value="NHAI">NHAI</option>
                <option value="State PWD">State PWD</option>
              </select>
            </div>

            {/* 3. Sector */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Sector <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <select
                value={formData.sector}
                onChange={(e) => handleFieldChange('sector', e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              >
                <option value="">Select Sector</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Transport">Transport</option>
                <option value="Water">Water</option>
                <option value="Energy">Energy</option>
                <option value="Urban Development">Urban Development</option>
              </select>
            </div>

            {/* 4. Location */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Location <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Tamil Nadu, India"
                value={formData.location}
                onChange={(e) => handleFieldChange('location', e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* 5. Deadline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <label style={{ fontSize: '0.8125rem', fontWeight: '600', color: 'var(--text-main)' }}>
                Deadline <span style={{ color: 'var(--danger, #ef4444)' }}>*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => handleFieldChange('deadline', e.target.value)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontSize: '0.875rem',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="modal-footer" style={{ padding: '0.875rem 1.5rem' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={handleCancel}
              style={{ padding: '0.45rem 1rem', fontSize: '0.8125rem' }}
=======
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
>>>>>>> origin/main
            >
              Cancel
            </button>
            <button
<<<<<<< HEAD
              type="submit"
              className="btn btn-primary"
              style={{ padding: '0.45rem 1.25rem', fontSize: '0.8125rem' }}
            >
              Add
=======
              id="submit-add-opportunity-btn"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Add Opportunity'}
>>>>>>> origin/main
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
