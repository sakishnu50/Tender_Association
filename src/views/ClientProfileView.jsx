import React, { useState } from 'react';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Globe2,
  Briefcase,
  Cpu,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
  Pencil,
  AlertCircle
} from 'lucide-react';
import { mockClientProfile } from '../data/clientProfileData';

// ── Helpers ────────────────────────────────────────────────────────────────────

function TagBadge({ label, variant = 'info', onRemove }) {
  const styles = {
    info: {
      backgroundColor: 'var(--info-bg)',
      color: 'var(--info-text)',
      border: '1px solid rgba(2, 132, 199, 0.25)'
    },
    success: {
      backgroundColor: 'var(--success-bg)',
      color: 'var(--success-text)',
      border: '1px solid rgba(5, 150, 105, 0.25)'
    },
    primary: {
      backgroundColor: 'var(--primary-light)',
      color: 'var(--primary)',
      border: '1px solid rgba(29, 78, 216, 0.2)'
    },
    warning: {
      backgroundColor: 'var(--warning-bg)',
      color: 'var(--warning-text)',
      border: '1px solid rgba(217, 119, 6, 0.25)'
    }
  };

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding: '0.3rem 0.65rem',
      borderRadius: 'var(--radius-md)',
      fontSize: '0.8rem',
      fontWeight: '600',
      ...styles[variant]
    }}>
      {label}
      {onRemove && (
        <button
          onClick={() => onRemove(label)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            color: 'inherit',
            padding: 0,
            opacity: 0.65,
            lineHeight: 1
          }}
          title={`Remove ${label}`}
        >
          <X size={11} />
        </button>
      )}
    </span>
  );
}

function SectionCard({ icon: Icon, title, badge, children }) {
  return (
    <div style={{
      backgroundColor: 'var(--bg-subtle)',
      borderRadius: 'var(--radius-md)',
      padding: '1rem',
      border: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.75rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Icon size={16} color="var(--primary)" />
          <span style={{
            fontSize: '0.825rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            {title}
          </span>
        </div>
        {badge && (
          <span style={{
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '0.15rem 0.5rem',
            borderRadius: '9999px',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary)'
          }}>
            {badge}
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── Inline Add Tag Input ───────────────────────────────────────────────────────

function AddTagInput({ placeholder, onAdd }) {
  const [val, setVal] = useState('');
  const submit = () => {
    const trimmed = val.trim();
    if (trimmed) { onAdd(trimmed); setVal(''); }
  };
  return (
    <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.25rem' }}>
      <input
        type="text"
        placeholder={placeholder}
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && submit()}
        style={{
          flex: 1,
          padding: '0.4rem 0.65rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-color)',
          backgroundColor: 'var(--bg-card)',
          color: 'var(--text-main)',
          fontSize: '0.8rem',
          outline: 'none'
        }}
      />
      <button
        className="btn btn-primary"
        onClick={submit}
        style={{ padding: '0.4rem 0.65rem', fontSize: '0.8rem' }}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

// ── Project Row (Table Row + Edit / Delete) ────────────────────────────────────

function ProjectRow({ project, isEditing, onEdit, onDelete }) {
  const statusColor = project.status === 'Completed'
    ? { bg: 'var(--success-bg)', text: 'var(--success-text)' }
    : { bg: 'var(--warning-bg)', text: 'var(--warning-text)' };

  return (
    <tr>
      <td style={{ fontWeight: '600', color: 'var(--text-main)' }}>{project.name}</td>
      <td>{project.sector}</td>
      <td>{project.country}</td>
      <td>{project.year}</td>
      <td style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{project.client}</td>
      <td>
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          padding: '0.2rem 0.55rem',
          borderRadius: '9999px',
          fontSize: '0.72rem',
          fontWeight: '700',
          backgroundColor: statusColor.bg,
          color: statusColor.text
        }}>
          {project.status}
        </span>
      </td>
      <td style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.82rem' }}>{project.value}</td>
      {isEditing && (
        <td>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button
              className="btn btn-outline"
              onClick={() => onEdit(project)}
              style={{ padding: '0.25rem 0.5rem', fontSize: '0.72rem' }}
            >
              <Pencil size={13} /> Edit
            </button>
            <button
              onClick={() => onDelete(project.id)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                padding: '0.25rem 0.5rem', fontSize: '0.72rem', border: '1px solid var(--danger)',
                borderRadius: 'var(--radius-md)', backgroundColor: 'transparent',
                color: 'var(--danger)', cursor: 'pointer', fontWeight: '600'
              }}
            >
              <Trash2 size={13} /> Delete
            </button>
          </div>
        </td>
      )}
    </tr>
  );
}

// ── Project Edit Modal ─────────────────────────────────────────────────────────

function ProjectModal({ project, onSave, onClose }) {
  const blank = { id: '', name: '', sector: '', country: '', year: '', client: '', status: 'Ongoing', value: '' };
  const [form, setForm] = useState(project || blank);

  const field = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '560px', width: '95vw' }}>
        <div className="modal-header">
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
            {project ? 'Edit Project' : 'Add New Project'}
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
          {[
            { label: 'Project Name', key: 'name', span: true },
            { label: 'Sector', key: 'sector' },
            { label: 'Country', key: 'country' },
            { label: 'Year', key: 'year' },
            { label: 'Client / Agency', key: 'client' },
            { label: 'Contract Value', key: 'value' }
          ].map(({ label, key, span }) => (
            <div key={key} style={{ gridColumn: span ? '1 / -1' : undefined, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>{label}</label>
              <input
                value={form[key]}
                onChange={field(key)}
                style={{
                  padding: '0.45rem 0.65rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  backgroundColor: 'var(--bg-subtle)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none'
                }}
              />
            </div>
          ))}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-muted)' }}>Status</label>
            <select
              value={form.status}
              onChange={field('status')}
              style={{
                padding: '0.45rem 0.65rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-subtle)',
                color: 'var(--text-main)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option>Completed</option>
              <option>Ongoing</option>
              <option>Upcoming</option>
            </select>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn-primary"
            onClick={() => {
              const id = form.id || `PP-${Date.now()}`;
              onSave({ ...form, id });
            }}
          >
            <Save size={14} /> Save Project
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Completeness Badge ─────────────────────────────────────────────────────────

function CompletenessRing({ pct }) {
  const color = pct >= 90 ? 'var(--success)' : pct >= 70 ? 'var(--primary)' : 'var(--warning)';
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', color: 'var(--text-muted)', fontWeight: '600' }}>
          <span>Profile Completeness</span>
          <strong style={{ color }}>{pct}%</strong>
        </div>
        <div style={{ width: '140px', height: '7px', backgroundColor: 'var(--border-color)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: '9999px' }} />
        </div>
      </div>
    </div>
  );
}

// ── Main View ──────────────────────────────────────────────────────────────────

export default function ClientProfileView() {
  const [profile, setProfile] = useState(mockClientProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);
  const [projectModal, setProjectModal] = useState(null); // null | 'new' | projectObj
  const [saveNotice, setSaveNotice] = useState(false);

  // Enter edit mode: clone profile to draft
  const handleEdit = () => {
    setDraft(JSON.parse(JSON.stringify(profile)));
    setIsEditing(true);
  };

  // Discard draft
  const handleCancel = () => {
    setDraft(null);
    setIsEditing(false);
  };

  // Commit draft to profile
  const handleSave = () => {
    setProfile(draft);
    setDraft(null);
    setIsEditing(false);
    setSaveNotice(true);
    setTimeout(() => setSaveNotice(false), 3000);
  };

  // Helpers for editing the draft
  const d = isEditing ? draft : profile;

  const removeTag = (listKey) => (tag) =>
    setDraft(prev => ({ ...prev, [listKey]: prev[listKey].filter(t => t !== tag) }));

  const addTag = (listKey) => (tag) =>
    setDraft(prev => ({ ...prev, [listKey]: [...prev[listKey], tag] }));

  const removeGeo = (country) =>
    setDraft(prev => ({ ...prev, geographicPresence: prev.geographicPresence.filter(g => g.country !== country) }));

  const addGeo = (country) =>
    setDraft(prev => ({
      ...prev,
      geographicPresence: [...prev.geographicPresence, { country, region: '', active: true }]
    }));

  const removeAgency = (agency) =>
    setDraft(prev => ({ ...prev, agencyExperience: prev.agencyExperience.filter(a => a.agency !== agency) }));

  const addAgency = (agency) =>
    setDraft(prev => ({
      ...prev,
      agencyExperience: [...prev.agencyExperience, { agency, projectCount: 0, since: new Date().getFullYear().toString() }]
    }));

  const handleDeleteProject = (id) =>
    setDraft(prev => ({ ...prev, pastProjects: prev.pastProjects.filter(p => p.id !== id) }));

  const handleSaveProject = (proj) => {
    setDraft(prev => {
      const exists = prev.pastProjects.find(p => p.id === proj.id);
      return {
        ...prev,
        pastProjects: exists
          ? prev.pastProjects.map(p => p.id === proj.id ? proj : p)
          : [...prev.pastProjects, proj]
      };
    });
    setProjectModal(null);
  };

  return (
    <div className="page-container">

      {/* ── Page Header ─────────────────────────────────────────────────────── */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Client Profile Administration</h2>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Manage <strong>{profile.companyName}</strong>'s company profile, capabilities, experience, and geographic presence
            used for AI tender evaluation.
          </span>
        </div>
      </div>

      {/* ── Save Success Notice ──────────────────────────────────────────────── */}
      {saveNotice && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--success-bg)', border: '1px solid var(--success)',
          color: 'var(--success-text)', fontSize: '0.85rem', fontWeight: '600'
        }}>
          <CheckCircle2 size={16} /> Profile changes saved successfully.
        </div>
      )}

      {/* ── Company Profile Assessment Header Card ───────────────────────────── */}
      <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Header Row */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center',
          justifyContent: 'space-between', gap: '1rem',
          paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{
              width: '46px', height: '46px',
              borderRadius: 'var(--radius-lg)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ fontSize: '0.725rem', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Company Profile Administration
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {profile.companyName}
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '0.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <MapPin size={13} /> {profile.headOffice}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Calendar size={13} /> Est. {profile.yearEstablished}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Users size={13} /> {profile.totalEmployees} Employees
                </span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem' }}>
            {/* Profile Status Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.775rem',
                fontWeight: '700',
                backgroundColor: 'var(--success-bg)', color: 'var(--success-text)',
                border: '1px solid var(--success)'
              }}>
                <CheckCircle2 size={13} /> {profile.profileStatus}
              </span>
            </div>

            {/* Completeness Bar */}
            <CompletenessRing pct={profile.profileCompleteness} />

            {/* Last Updated */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.775rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} />
              <span>Updated: <strong>{profile.lastUpdated}</strong></span>
            </div>

            {/* Edit / Save / Cancel Buttons */}
            {isEditing ? (
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-outline" onClick={handleCancel} style={{ fontSize: '0.8rem' }}>
                  <X size={14} /> Cancel
                </button>
                <button className="btn btn-success" onClick={handleSave} style={{ fontSize: '0.8rem', backgroundColor: 'var(--success)' }}>
                  <Save size={14} /> Save Changes
                </button>
              </div>
            ) : (
              <button className="btn btn-primary" onClick={handleEdit} style={{ fontSize: '0.8rem' }}>
                <Edit3 size={14} /> Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* ── Profile Sections Grid ────────────────────────────────────────── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1rem'
        }}>

          {/* 1. Sectors & Expertise */}
          <SectionCard icon={Briefcase} title="Sectors & Expertise" badge={`${d.sectors.length} Sectors`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {d.sectors.map((s, i) => (
                <TagBadge
                  key={i}
                  label={s}
                  variant="info"
                  onRemove={isEditing ? removeTag('sectors') : undefined}
                />
              ))}
            </div>
            {isEditing && (
              <AddTagInput placeholder="Add sector (e.g. Energy)" onAdd={addTag('sectors')} />
            )}
          </SectionCard>

          {/* 2. Geographic Presence */}
          <SectionCard icon={Globe2} title="Geographic Presence" badge={`${d.geographicPresence.length} Countries`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {d.geographicPresence.map((g, i) => (
                <TagBadge
                  key={i}
                  label={g.country}
                  variant={g.active ? 'success' : 'warning'}
                  onRemove={isEditing ? removeGeo : undefined}
                />
              ))}
            </div>
            {isEditing && (
              <AddTagInput placeholder="Add country (e.g. Vietnam)" onAdd={addGeo} />
            )}
          </SectionCard>

          {/* 3. Agency Experience */}
          <SectionCard icon={ShieldCheck} title="Agency Experience" badge={`${d.agencyExperience.length} Agencies`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {d.agencyExperience.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={14} color="var(--success)" />
                    <span style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>{a.agency}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>{a.projectCount} Projects</span>
                    <span>Since {a.since}</span>
                    {isEditing && (
                      <button
                        onClick={() => removeAgency(a.agency)}
                        style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: 'var(--danger)', display: 'flex', alignItems: 'center' }}
                      >
                        <X size={13} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isEditing && (
              <AddTagInput placeholder="Add agency (e.g. JICA)" onAdd={addAgency} />
            )}
          </SectionCard>

          {/* 4. Technical Capabilities */}
          <SectionCard icon={Cpu} title="Technical Capabilities" badge={`${d.technicalCapabilities.length} Capabilities`}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
              {d.technicalCapabilities.map((cap, i) => (
                <TagBadge
                  key={i}
                  label={cap}
                  variant="primary"
                  onRemove={isEditing ? removeTag('technicalCapabilities') : undefined}
                />
              ))}
            </div>
            {isEditing && (
              <AddTagInput placeholder="Add capability (e.g. GIS Mapping)" onAdd={addTag('technicalCapabilities')} />
            )}
          </SectionCard>

        </div>
      </div>

      {/* ── Past Project Experience ──────────────────────────────────────────── */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {/* Projects Card Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '0.75rem',
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border-color)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} color="var(--primary)" />
            <h3 style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)', margin: 0 }}>
              Past Project Experience
            </h3>
            <span style={{
              fontSize: '0.72rem', fontWeight: '700', padding: '0.15rem 0.5rem',
              borderRadius: '9999px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)'
            }}>
              {d.pastProjects.length} Projects
            </span>
          </div>
          {isEditing && (
            <button
              className="btn btn-primary"
              onClick={() => setProjectModal('new')}
              style={{ fontSize: '0.8rem' }}
            >
              <Plus size={14} /> Add Project
            </button>
          )}
        </div>

        {/* Projects Table */}
        <div className="table-container" style={{ border: 'none' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Sector</th>
                <th>Country</th>
                <th>Year</th>
                <th>Client / Agency</th>
                <th>Status</th>
                <th>Value</th>
                {isEditing && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {d.pastProjects.map((proj) => (
                <ProjectRow
                  key={proj.id}
                  project={proj}
                  isEditing={isEditing}
                  onEdit={(p) => setProjectModal(p)}
                  onDelete={handleDeleteProject}
                />
              ))}
              {d.pastProjects.length === 0 && (
                <tr>
                  <td colSpan={isEditing ? 8 : 7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertCircle size={28} color="var(--text-light)" />
                      <span>No past projects added yet. Click "Add Project" to get started.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer summary */}
        <div style={{
          padding: '0.75rem 1.25rem',
          borderTop: '1px solid var(--border-color)',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)',
          flexWrap: 'wrap', gap: '0.5rem'
        }}>
          <span>
            Showing <strong>{d.pastProjects.length}</strong> projects ·{' '}
            <span style={{ color: 'var(--success-text)', fontWeight: '600' }}>
              {d.pastProjects.filter(p => p.status === 'Completed').length} Completed
            </span>
            {' · '}
            <span style={{ color: 'var(--warning-text)', fontWeight: '600' }}>
              {d.pastProjects.filter(p => p.status !== 'Completed').length} Ongoing / Upcoming
            </span>
          </span>
          <span>Profile Completeness: <strong>{profile.profileCompleteness}%</strong></span>
        </div>
      </div>

      {/* ── Edit / Save action bar (sticky bottom reminder) ─────────────────── */}
      {isEditing && (
        <div style={{
          position: 'sticky', bottom: '1rem',
          display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
          padding: '0.875rem 1.25rem',
          backgroundColor: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--primary)',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 10
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>
            You are in edit mode — unsaved changes will be lost if you navigate away.
          </span>
          <button className="btn btn-outline" onClick={handleCancel} style={{ fontSize: '0.8rem' }}>
            <X size={14} /> Cancel
          </button>
          <button
            className="btn btn-success"
            onClick={handleSave}
            style={{ fontSize: '0.8rem', backgroundColor: 'var(--success)' }}
          >
            <Save size={14} /> Save Changes
          </button>
        </div>
      )}

      {/* ── Project Modal ────────────────────────────────────────────────────── */}
      {projectModal !== null && (
        <ProjectModal
          project={projectModal === 'new' ? null : projectModal}
          onSave={handleSaveProject}
          onClose={() => setProjectModal(null)}
        />
      )}
    </div>
  );
}
