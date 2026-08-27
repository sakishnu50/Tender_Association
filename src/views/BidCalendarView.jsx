import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';
import { useCalendar } from '../hooks/useApiQueries';

export default function BidCalendarView() {
  const { data: fetchedEvents } = useCalendar();
  const calendarEvents = fetchedEvents || mockCalendarEvents;
  const daysInMonth = Array.from({ length: 30 }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Bid Calendar</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Calendar Grid */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>September 2028</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>&lt;</button>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>Today</button>
              <button className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>&gt;</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
            {weekDays.map(d => <div key={d}>{d}</div>)}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
            {/* Blank leading offsets for Sep 2028 starting on Friday (5 blank cells) */}
            {[...Array(5)].map((_, i) => (
              <div key={`blank-${i}`} style={{ height: '40px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.4 }} />
            ))}

            {daysInMonth.map((day) => {
              const hasDeadline = day === 16;
              const hasMeeting = day === 18;
              const hasCutoff = day === 20;

              return (
                <div
                  key={day}
                  style={{
                    height: '42px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    backgroundColor: hasDeadline ? 'var(--danger-bg)' : hasMeeting ? 'var(--warning-bg)' : hasCutoff ? 'var(--info-bg)' : '#FFF',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justify: 'center',
                    fontSize: '0.8rem',
                    fontWeight: (hasDeadline || hasMeeting || hasCutoff) ? '700' : '500',
                    color: hasDeadline ? 'var(--danger-text)' : hasMeeting ? 'var(--warning-text)' : hasCutoff ? 'var(--info-text)' : 'var(--text-main)',
                    cursor: 'pointer'
                  }}
                >
                  {day}
                  {(hasDeadline || hasMeeting || hasCutoff) && (
                    <div style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '9999px',
                      backgroundColor: hasDeadline ? 'var(--danger)' : hasMeeting ? 'var(--warning)' : 'var(--info)',
                      marginTop: '2px'
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Events List */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Events Schedule</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {calendarEvents.map((evt, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-subtle)',
                  borderLeft: `4px solid ${
                    evt.type === 'deadline' ? 'var(--danger)' :
                    evt.type === 'meeting' ? 'var(--warning)' : 'var(--info)'
                  }`
                }}
              >
                <CalendarIcon size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)' }}>
                    {evt.date}
                  </span>
                  <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {evt.title}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {evt.desc}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
