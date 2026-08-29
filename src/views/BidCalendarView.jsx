import React, { useState } from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import { mockCalendarEvents, mockOpportunities } from '../data/mockData';
import { useCalendar } from '../hooks/useApiQueries';

export default function BidCalendarView({ searchVal, onSelectOpportunity }) {
  const { data: fetchedEvents } = useCalendar();
  const calendarEvents = fetchedEvents || mockCalendarEvents;
  
  const filteredEvents = calendarEvents.filter(evt => {
    if (!searchVal) return true;
    const lowerSearch = searchVal.toLowerCase();
    const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name));
    
    const matchTitle = evt.title.toLowerCase().includes(lowerSearch);
    const matchDesc = evt.desc.toLowerCase().includes(lowerSearch);
    const matchSource = opp && opp.source.toLowerCase().includes(lowerSearch);
    const matchSector = opp && opp.sector.toLowerCase().includes(lowerSearch);
    
    return matchTitle || matchDesc || matchSource || matchSector;
  });
  
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState('Month'); // 'Month', 'Week', 'List', 'Year'

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
  const numDays = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const displayEvents = [];
  filteredEvents.forEach(evt => {
    const evtDate = new Date(evt.date);
    if (evtDate.getFullYear() === currentYear && evtDate.getMonth() === currentMonth) {
      displayEvents.push({ ...evt, isReminder: false });
    }
    
    if (evt.type === 'deadline') {
      const oneMonthBefore = new Date(evtDate.getFullYear(), evtDate.getMonth() - 1, evtDate.getDate());
      if (oneMonthBefore.getFullYear() === currentYear && oneMonthBefore.getMonth() === currentMonth) {
        displayEvents.push({
          ...evt,
          isReminder: true,
          title: `Upcoming Deadline (1 Month): ${evt.title}`
        });
      }
    }
  });

  const currentMonthEvents = [...displayEvents].sort((a, b) => {
    const getActualDate = (e) => e.isReminder ? new Date(new Date(e.date).getFullYear(), new Date(e.date).getMonth() - 1, new Date(e.date).getDate()) : new Date(e.date);
    return getActualDate(a) - getActualDate(b);
  });

  const allUpcomingEvents = [...filteredEvents].sort((a, b) => new Date(a.date) - new Date(b.date));

  const handleEventClick = (evt) => {
    const evtDate = new Date(evt.date);
    // Navigate the calendar to the exact date containing the event
    setCurrentDate(new Date(evtDate.getFullYear(), evtDate.getMonth(), evtDate.getDate()));
    
    // If the user is actively searching, keep them on the calendar to see the highlighted result
    if (searchVal) return;

    if (!onSelectOpportunity) return;
    const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name)) || mockOpportunities[0];
    onSelectOpportunity(opp);
  };

  const handlePrev = () => {
    if (view === 'Month' || view === 'List') {
      setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    } else if (view === 'Week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() - 7));
    } else if (view === 'Year') {
      setCurrentDate(new Date(currentYear - 1, currentMonth, 1));
    }
  };

  const handleNext = () => {
    if (view === 'Month' || view === 'List') {
      setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    } else if (view === 'Week') {
      setCurrentDate(new Date(currentYear, currentMonth, currentDate.getDate() + 7));
    } else if (view === 'Year') {
      setCurrentDate(new Date(currentYear + 1, currentMonth, 1));
    }
  };

  const handleToday = () => {
    // Navigate strictly back to the actual current system date
    setCurrentDate(new Date());
  };
  
  const daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentYear, currentMonth, currentDate.getDate() - currentDayOfWeek);
  const weekDaysArray = Array.from({ length: 7 }, (_, i) => {
    return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
  });

  const renderCell = (cellDate, key) => {
    const actualToday = new Date();
    const isToday = cellDate.getFullYear() === actualToday.getFullYear() &&
                    cellDate.getMonth() === actualToday.getMonth() &&
                    cellDate.getDate() === actualToday.getDate();

    const cellEvents = displayEvents.filter(evt => {
      const evtDate = new Date(evt.date);
      let targetDate = evtDate;
      if (evt.isReminder) {
        targetDate = new Date(evtDate.getFullYear(), evtDate.getMonth() - 1, evtDate.getDate());
      }
      return targetDate.getFullYear() === cellDate.getFullYear() &&
             targetDate.getMonth() === cellDate.getMonth() &&
             targetDate.getDate() === cellDate.getDate();
    });

    const hasDeadline = cellEvents.some(evt => evt.type === 'deadline');
    const hasMeeting = cellEvents.some(evt => evt.type === 'meeting');
    const hasCutoff = cellEvents.some(evt => evt.type === 'cutoff');

    return (
      <div
        key={key}
        onClick={cellEvents.length > 0 ? () => handleEventClick(cellEvents[0]) : undefined}
        style={{
          height: '42px',
          borderRadius: '6px',
          border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
          backgroundColor: isToday ? 'var(--bg-subtle)' : hasDeadline ? 'var(--danger-bg)' : hasMeeting ? 'var(--warning-bg)' : hasCutoff ? 'var(--info-bg)' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justify: 'center',
          fontSize: '0.8rem',
          fontWeight: (hasDeadline || hasMeeting || hasCutoff || isToday) ? '700' : '500',
          color: hasDeadline ? 'var(--danger-text)' : hasMeeting ? 'var(--warning-text)' : hasCutoff ? 'var(--info-text)' : 'var(--text-main)',
          cursor: 'pointer'
        }}
      >
        {cellDate.getDate()}
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
  };

  const getCalendarTitle = () => {
    if (view === 'Year') {
      return `${currentYear}`;
    } else if (view === 'Month' || view === 'List') {
      return `${currentMonthName} ${currentYear}`;
    } else {
      const endOfWeek = new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + 6);
      if (startOfWeek.getMonth() === endOfWeek.getMonth()) {
        return `${startOfWeek.toLocaleString('default', { month: 'short' })} ${startOfWeek.getDate()} - ${endOfWeek.getDate()}, ${currentYear}`;
      } else {
        return `${startOfWeek.toLocaleString('default', { month: 'short' })} ${startOfWeek.getDate()} - ${endOfWeek.toLocaleString('default', { month: 'short' })} ${endOfWeek.getDate()}, ${currentYear}`;
      }
    }
  };

  return (
    <div className="page-container">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="page-title">Bid Calendar</h2>
        <div style={{ display: 'flex', backgroundColor: 'var(--bg-subtle)', padding: '0.2rem', borderRadius: 'var(--radius-md)' }}>
          {['Year', 'Month', 'Week', 'List'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '0.4rem 1rem',
                fontSize: '0.75rem',
                fontWeight: '700',
                borderRadius: 'var(--radius-md)',
                backgroundColor: view === v ? '#FFF' : 'transparent',
                color: view === v ? '#0F172A' : 'var(--text-muted)',
                boxShadow: view === v ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {/* Main Calendar View Area */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '700' }}>{getCalendarTitle()}</h3>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              <button onClick={handlePrev} className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>&lt;</button>
              <button onClick={handleToday} className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>Today</button>
              <button onClick={handleNext} className="btn btn-outline" style={{ padding: '0.2rem 0.6rem', fontSize: '0.75rem' }}>&gt;</button>
            </div>
          </div>

          {view !== 'List' && view !== 'Year' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
              {weekDays.map(d => <div key={d}>{d}</div>)}
            </div>
          )}

          {view === 'Month' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
              {/* Blank leading offsets */}
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`blank-${i}`} style={{ height: '40px', backgroundColor: 'var(--bg-subtle)', borderRadius: '4px', opacity: 0.4 }} />
              ))}
              {daysInMonth.map(day => {
                const cellDate = new Date(currentYear, currentMonth, day);
                return renderCell(cellDate, day);
              })}
            </div>
          )}

          {view === 'Week' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem' }}>
              {weekDaysArray.map((cellDate, i) => {
                return renderCell(cellDate, `week-day-${i}`);
              })}
            </div>
          )}

          {view === 'List' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentMonthEvents.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No events scheduled for this month
                </div>
              ) : (
                currentMonthEvents.map((evt, idx) => (
                  <div
                    key={`list-${idx}`}
                    onClick={() => handleEventClick(evt)}
                    style={{
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--bg-subtle)',
                      borderLeft: `4px solid ${
                        evt.type === 'deadline' ? 'var(--danger)' :
                        evt.type === 'meeting' ? 'var(--warning)' : 'var(--info)'
                      }`
                    }}
                  >
                    <div style={{ minWidth: '100px' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {new Date(evt.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {evt.title}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {evt.desc}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {view === 'Year' && (
            <>
              <style>{`
                .year-grid {
                  display: grid;
                  grid-template-columns: repeat(3, 1fr);
                  gap: 0.5rem;
                }
                @media (max-width: 768px) {
                  .year-grid {
                    grid-template-columns: repeat(2, 1fr);
                  }
                }
                @media (max-width: 480px) {
                  .year-grid {
                    grid-template-columns: 1fr;
                  }
                }
              `}</style>
              <div className="year-grid">
                {Array.from({ length: 12 }, (_, i) => {
                  const monthDate = new Date(currentYear, i, 1);
                  const monthName = monthDate.toLocaleString('default', { month: 'long' });
                  const count = filteredEvents.filter(evt => {
                    const d = new Date(evt.date);
                    return d.getFullYear() === currentYear && d.getMonth() === i;
                  }).length;
                  
                  return (
                    <div
                      key={`year-month-${i}`}
                      onClick={() => {
                        setCurrentDate(new Date(currentYear, i, 1));
                        setView('Month');
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: 'var(--bg-subtle)',
                        padding: '0.5rem',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.2rem',
                        border: '1px solid var(--border-color)',
                        height: '70px'
                      }}
                    >
                      <span style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)' }}>
                        {monthName}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: count > 0 ? 'var(--primary)' : 'var(--text-muted)', fontWeight: count > 0 ? '700' : '500' }}>
                        {count} {count === 1 ? 'Event' : 'Events'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Milestone Events List */}
        <div className="card">
          <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>Events Schedule</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {allUpcomingEvents.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No matching events found
              </div>
            ) : (
              allUpcomingEvents.map((evt, idx) => (
                <div
                  key={`side-${idx}`}
                  onClick={() => handleEventClick(evt)}
                  style={{
                    cursor: 'pointer',
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
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
