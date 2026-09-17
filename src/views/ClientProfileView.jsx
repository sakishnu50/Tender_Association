import React, { useState, useMemo, useEffect } from 'react';
import {
  TrendingUp,
  Eye,
  X,
  Building2,
  Calendar,
  Globe2,
  MapPin,
  CheckCircle2,
  Clock,
  DollarSign,
  Briefcase,
  Layers,
  Target,
  Activity,
  Award,
  ShieldCheck,
  Users,
  Download,
  Search,
  Filter
} from 'lucide-react';
import { mockClientProfile } from '../data/clientProfileData';
import { exportService } from '../services/exportService';

export default function ClientProfileView({ activeProject, setActiveProject }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sectorFilter, setSectorFilter] = useState('ALL');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const pastProjects = useMemo(() => mockClientProfile.pastProjects || [], []);

  // Filter dynamic lists
  const sectorOptions = useMemo(() => {
    const list = new Set();
    pastProjects.forEach((p) => {
      if (p.sector) list.add(p.sector);
    });
    return Array.from(list);
  }, [pastProjects]);

  // Filtered past projects based on search and filters
  const filteredProjects = useMemo(() => {
    return pastProjects.filter((project) => {
      if (statusFilter !== 'ALL' && project.status !== statusFilter) {
        return false;
      }
      if (sectorFilter !== 'ALL' && project.sector !== sectorFilter) {
        return false;
      }
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const name = (project.name || '').toLowerCase();
        const sector = (project.sector || '').toLowerCase();
        const country = (project.country || '').toLowerCase();
        const client = (project.client || '').toLowerCase();
        const value = (project.value || '').toLowerCase();
        if (!name.includes(query) && !sector.includes(query) && !country.includes(query) && !client.includes(query) && !value.includes(query)) {
          return false;
        }
      }
      return true;
    });
  }, [pastProjects, searchTerm, statusFilter, sectorFilter]);

  // Reset to page 1 on filter or page size changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter, sectorFilter, pageSize]);

  // Pagination calculations
  const totalProjects = filteredProjects.length;
  const totalPages = Math.min(2, Math.max(1, Math.ceil(totalProjects / pageSize)));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalProjects);
  const displayedProjects = filteredProjects.slice(startIndex, endIndex);

  const handleOpenProject = (project) => {
    setSelectedProject(project);
    if (setActiveProject) {
      setActiveProject(project);
    }
  };

  return (
    <div className="page-container" style={{ padding: '1rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
      {/* Single Control Row: Heading on Left, Search + Filters on Right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          gap: '1rem',
          flexWrap: 'wrap'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(37, 99, 235, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary, #2563EB)'
            }}
          >
            <TrendingUp size={18} />
          </div>
          <h1
            style={{
              fontSize: '1.25rem',
              fontWeight: 700,
              color: 'var(--text-main, #0F172A)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '0.625rem',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap'
            }}
          >
            Past Project Experience
          </h1>
        </div>

        {/* Grouped Right Controls: Search + Sector Filter + Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', flexShrink: 0 }}>
          {/* Search Input */}
          <div style={{ position: 'relative', width: '260px', maxWidth: '100%' }}>
            <Search
              size={15}
              color="var(--text-muted, #64748B)"
              style={{
                position: 'absolute',
                left: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none'
              }}
            />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                height: '36px',
                padding: '0 0.75rem 0 2.2rem',
                borderRadius: 'var(--radius-md, 6px)',
                border: '1px solid var(--border-color, #CBD5E1)',
                backgroundColor: 'var(--bg-card, #FFFFFF)',
                color: 'var(--text-main, #0F172A)',
                fontSize: '0.875rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Sector Filter */}
          <select
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
            style={{
              height: '36px',
              padding: '0 0.75rem',
              borderRadius: 'var(--radius-md, 6px)',
              border: '1px solid var(--border-color, #CBD5E1)',
              backgroundColor: 'var(--bg-card, #FFFFFF)',
              color: 'var(--text-main, #0F172A)',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All Sectors</option>
            {sectorOptions.map((sec) => (
              <option key={sec} value={sec}>
                {sec}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{
              height: '36px',
              padding: '0 0.75rem',
              borderRadius: 'var(--radius-md, 6px)',
              border: '1px solid var(--border-color, #CBD5E1)',
              backgroundColor: 'var(--bg-card, #FFFFFF)',
              color: 'var(--text-main, #0F172A)',
              fontSize: '0.875rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            <option value="ALL">All States</option>
            <option value="Completed">Completed</option>
            <option value="Ongoing">Ongoing</option>
          </select>
        </div>
      </div>

      {/* Projects Table Card */}
      <div
        className="card"
        style={{
          backgroundColor: 'var(--bg-card, #FFFFFF)',
          borderRadius: '0.75rem',
          border: '1px solid var(--border-color, #E2E8F0)',
          overflow: 'hidden',
          boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.04)',
          padding: 0
        }}
      >
        <div className="table-container" style={{ border: 'none', overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color, #E2E8F0)', backgroundColor: 'transparent' }}>
                <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>PROJECT NAME</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>SECTOR</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>COUNTRY</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>YEAR</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>CLIENT / AGENCY</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>STATUS</th>
                <th style={{ textAlign: 'left', padding: '0.85rem 1.25rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>VALUE</th>
                <th style={{ textAlign: 'center', padding: '0.85rem 1rem', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>VIEW</th>
              </tr>
            </thead>
            <tbody>
              {displayedProjects.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted, #64748B)', fontSize: '0.9rem' }}
                  >
                    No projects found matching your criteria.
                  </td>
                </tr>
              ) : (
                displayedProjects.map((project, idx) => {
                  const isCompleted = project.status === 'Completed';
                  return (
                    <tr
                      key={project.id || idx}
                      style={{
                        borderBottom: '1px solid var(--border-color, #E2E8F0)',
                        transition: 'background-color 0.15s'
                      }}
                    >
                      <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: 'var(--text-main, #0F172A)', fontSize: '0.875rem' }}>
                        {project.name}
                      </td>
                      <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary, #334155)', fontSize: '0.875rem' }}>
                        {project.sector}
                      </td>
                      <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary, #334155)', fontSize: '0.875rem' }}>
                        {project.country}
                      </td>
                      <td style={{ padding: '1rem 1rem', color: 'var(--text-secondary, #334155)', fontSize: '0.875rem' }}>
                        {project.year}
                      </td>
                      <td style={{ padding: '1rem 1rem', color: 'var(--text-muted, #64748B)', fontSize: '0.875rem' }}>
                        {project.client}
                      </td>
                      <td style={{ padding: '1rem 1rem' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            padding: '0.25rem 0.65rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            backgroundColor: isCompleted ? '#DCFCE7' : '#FEF3C7',
                            color: isCompleted ? '#166534' : '#92400E'
                          }}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.25rem', fontWeight: '700', color: 'var(--primary, #1D4ED8)', fontSize: '0.875rem' }}>
                        {project.value}
                      </td>
                      <td style={{ padding: '1rem 1rem', textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenProject(project)}
                          title="View Complete Project Details"
                          aria-label={`View details for ${project.name}`}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            border: '1px solid var(--border-color, #E2E8F0)',
                            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                            color: 'var(--primary, #2563EB)',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'rgba(37, 99, 235, 0.12)';
                            e.currentTarget.style.borderColor = 'var(--primary, #2563EB)';
                            e.currentTarget.style.transform = 'scale(1.06)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--bg-subtle, #F8FAFC)';
                            e.currentTarget.style.borderColor = 'var(--border-color, #E2E8F0)';
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>


        {/* ── Page Navigation Footer ────────────────────────────────────────── */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid var(--border-color)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            flexWrap: 'wrap',
            gap: '0.75rem'
          }}
        >
          <div>
            Showing {totalProjects === 0 ? 0 : startIndex + 1} to {endIndex} of {totalProjects} entries
          </div>

          <div style={{ display: 'flex', gap: '0.25rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                opacity: currentPage <= 1 ? 0.4 : 1,
                cursor: currentPage <= 1 ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              aria-label="Previous Page"
            >
              &lt;
            </button>

            <button
              type="button"
              className="btn btn-primary"
              style={{ padding: '0.2rem 0.55rem', fontSize: '0.75rem', minWidth: '1.75rem' }}
              aria-label={`Page ${currentPage}`}
              aria-current="page"
            >
              {currentPage}
            </button>

            <button
              type="button"
              className="btn btn-outline"
              style={{
                padding: '0.2rem 0.5rem',
                fontSize: '0.75rem',
                opacity: currentPage >= totalPages ? 0.4 : 1,
                cursor: currentPage >= totalPages ? 'not-allowed' : 'pointer'
              }}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              aria-label="Next Page"
            >
              &gt;
            </button>
          </div>
        </div>

      </div >

      {/* ── Project Details Modal ────────────────────────────────────────── */}
      {
        selectedProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.65)',
              backdropFilter: 'blur(5px)',
              WebkitBackdropFilter: 'blur(5px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '1.25rem',
              animation: 'fadeIn 0.2s ease-out'
            }}
            onClick={() => setSelectedProject(null)}
          >
            <div
              style={{
                width: '100%',
                maxWidth: '860px',
                maxHeight: '90vh',
                backgroundColor: 'var(--bg-card, #FFFFFF)',
                borderRadius: '1rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px var(--border-color, #E2E8F0)',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                animation: 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div
                style={{
                  padding: '1.25rem 1.75rem',
                  borderBottom: '1px solid var(--border-color, #E2E8F0)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  backgroundColor: 'var(--bg-subtle, #F8FAFC)'
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.5rem' }}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        backgroundColor: selectedProject.status === 'Completed' ? '#DCFCE7' : '#FEF3C7',
                        color: selectedProject.status === 'Completed' ? '#166534' : '#92400E'
                      }}
                    >
                      {selectedProject.status === 'Completed' ? (
                        <CheckCircle2 size={13} style={{ marginRight: '4px' }} />
                      ) : (
                        <Clock size={13} style={{ marginRight: '4px' }} />
                      )}
                      {selectedProject.status}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'rgba(37, 99, 235, 0.1)',
                        color: 'var(--primary, #2563EB)'
                      }}
                    >
                      <Briefcase size={12} style={{ marginRight: '4px' }} />
                      {selectedProject.sector}
                    </span>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: 'var(--bg-card, #FFFFFF)',
                        border: '1px solid var(--border-color, #E2E8F0)',
                        color: 'var(--text-secondary, #475569)'
                      }}
                    >
                      <Globe2 size={12} style={{ marginRight: '4px' }} />
                      {selectedProject.country}
                    </span>
                  </div>
                  <h2
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '800',
                      color: 'var(--text-main, #0F172A)',
                      margin: 0,
                      lineHeight: '1.3'
                    }}
                  >
                    {selectedProject.name}
                  </h2>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedProject(null)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: 'var(--text-muted, #64748B)',
                      cursor: 'pointer',
                      padding: '0.4rem',
                      borderRadius: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.06)')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    title="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Modal Body (Scrollable) */}
              <div
                style={{
                  padding: '1.5rem 1.75rem',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.35rem'
                }}
              >
                {/* Quick Key Facts Matrix */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '0.85rem',
                    padding: '1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                    border: '1px solid var(--border-color, #E2E8F0)'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Contract Value
                    </span>
                    <strong style={{ fontSize: '1.15rem', color: 'var(--primary, #1D4ED8)', fontWeight: '800' }}>
                      {selectedProject.value}
                    </strong>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Client / Agency
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main, #0F172A)' }}>
                      {selectedProject.client}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Execution Timeline
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main, #0F172A)' }}>
                      {selectedProject.duration || `${selectedProject.year} (Completed)`}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted, #64748B)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Location / Corridors
                    </span>
                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--text-main, #0F172A)' }}>
                      {selectedProject.location || `${selectedProject.country}`}
                    </span>
                  </div>
                </div>

                {/* 1. Project Overview */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main, #0F172A)' }}>
                    <Building2 size={16} color="var(--primary, #2563EB)" />
                    Project Overview & Background
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #334155)', lineHeight: '1.65', margin: 0 }}>
                    {selectedProject.overview}
                  </p>
                </div>

                {/* 2. Project Scope */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main, #0F172A)' }}>
                    <Layers size={16} color="var(--primary, #2563EB)" />
                    Scope of Work & Engineering Details
                  </div>
                  <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #334155)', lineHeight: '1.65', margin: 0 }}>
                    {selectedProject.scope}
                  </p>
                </div>

                {/* 3. Strategic Objectives & Key Activities (2 Columns) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
                  {/* Objectives */}
                  <div
                    style={{
                      padding: '1.1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                      border: '1px solid var(--border-color, #E2E8F0)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0F172A)' }}>
                      <Target size={15} color="var(--primary, #2563EB)" />
                      Key Project Objectives
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-secondary, #334155)' }}>
                      {selectedProject.objectives?.map((obj, i) => (
                        <li key={i} style={{ lineHeight: '1.5' }}>{obj}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Activities */}
                  <div
                    style={{
                      padding: '1.1rem',
                      borderRadius: '0.75rem',
                      backgroundColor: 'var(--bg-subtle, #F8FAFC)',
                      border: '1px solid var(--border-color, #E2E8F0)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.65rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main, #0F172A)' }}>
                      <Activity size={15} color="#10B981" />
                      Key Activities & Execution Phases
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: 'var(--text-secondary, #334155)' }}>
                      {selectedProject.keyActivities?.map((act, i) => (
                        <li key={i} style={{ lineHeight: '1.5' }}>{act}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 4. Outcomes & Measurable Impact */}
                <div
                  style={{
                    padding: '1.1rem',
                    borderRadius: '0.75rem',
                    backgroundColor: 'rgba(16, 185, 129, 0.05)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.65rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.85rem', fontWeight: '800', color: '#065F46' }}>
                    <Award size={16} color="#059669" />
                    Key Outcomes & Delivered Impact
                  </div>
                  <ul style={{ margin: 0, paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.825rem', color: '#047857' }}>
                    {selectedProject.outcomes?.map((outc, i) => (
                      <li key={i} style={{ lineHeight: '1.5', fontWeight: '600' }}>{outc}</li>
                    ))}
                  </ul>
                </div>

                {/* 5. Team, Reference & Standards */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                    gap: '0.85rem',
                    fontSize: '0.8rem',
                    color: 'var(--text-muted, #64748B)',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid var(--border-color, #E2E8F0)'
                  }}
                >
                  {selectedProject.projectLead && (
                    <div>
                      <strong style={{ color: 'var(--text-main, #334155)', display: 'block' }}>Project Lead:</strong>
                      <span>{selectedProject.projectLead}</span>
                    </div>
                  )}
                  {selectedProject.teamSize && (
                    <div>
                      <strong style={{ color: 'var(--text-main, #334155)', display: 'block' }}>Team Deployment:</strong>
                      <span>{selectedProject.teamSize}</span>
                    </div>
                  )}
                  {selectedProject.contractRef && (
                    <div>
                      <strong style={{ color: 'var(--text-main, #334155)', display: 'block' }}>Contract Reference:</strong>
                      <span>{selectedProject.contractRef}</span>
                    </div>
                  )}
                  {selectedProject.standards && (
                    <div>
                      <strong style={{ color: 'var(--text-main, #334155)', display: 'block' }}>Standards Followed:</strong>
                      <span>{selectedProject.standards}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div
                style={{
                  padding: '1rem 1.75rem',
                  borderTop: '1px solid var(--border-color, #E2E8F0)',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-subtle, #F8FAFC)'
                }}
              >
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => exportService.exportSingleProjectPDF(selectedProject)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    padding: '0.55rem 1.15rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: 'var(--primary, #2563EB)',
                    borderColor: 'var(--primary, #2563EB)'
                  }}
                >
                  <Download size={15} />
                  <span>Download Project PDF</span>
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setSelectedProject(null)}
                  style={{ padding: '0.55rem 1.35rem', fontSize: '0.85rem', fontWeight: '700' }}
                >
                  Close Details
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
}
