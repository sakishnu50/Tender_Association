import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Filter } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';
import { useCalendar, useOpportunities } from '../hooks/useApiQueries';

export default function BidCalendarView({ searchVal: propSearchVal, onSelectOpportunity }) {
  const { data: fetchedEvents } = useCalendar();
  const { data: userOpps = [] } = useOpportunities();
  const calendarEvents = fetchedEvents || mockCalendarEvents;
  const mockOpportunities = userOpps;
  
  const activeSearch = propSearchVal || '';

  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(() => {
    if (location.state && location.state.targetDate) {
      return new Date(location.state.targetDate);
    }
    return new Date();
  });
  const [view, setView] = useState('Month'); // 'Year', 'Month', 'Week', 'List'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const filterMenuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterMenuRef.current && !filterMenuRef.current.contains(event.target)) {
        setIsFilterMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredEvents = calendarEvents.filter(evt => {
    if (!activeSearch) return true;
    const lowerSearch = activeSearch.toLowerCase();
    const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name));
    
    const matchTitle = evt.title.toLowerCase().includes(lowerSearch);
    const matchDesc = evt.desc.toLowerCase().includes(lowerSearch);
    const matchSource = opp && opp.source.toLowerCase().includes(lowerSearch);
    const matchSector = opp && opp.sector.toLowerCase().includes(lowerSearch);
    
    return matchTitle || matchDesc || matchSource || matchSector;
  });

  // When search becomes active and finds results, switch to List view and navigate to the first match's month
  useEffect(() => {
    if (activeSearch && filteredEvents.length > 0) {
      setView('List');
      const firstEventDate = new Date(filteredEvents[0].date);
      setCurrentDate(new Date(firstEventDate.getFullYear(), firstEventDate.getMonth(), 1));
    }
  }, [activeSearch]);

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
    setCurrentDate(new Date(evtDate.getFullYear(), evtDate.getMonth(), evtDate.getDate()));
    
    if (activeSearch) return;

    if (!onSelectOpportunity) return;
    const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name)) || mockOpportunities[0];
    onSelectOpportunity(opp, evt.date);
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
    const today = new Date();
    setCurrentDate(today);
  };
  
  const daysInMonth = Array.from({ length: numDays }, (_, i) => i + 1);
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const currentDayOfWeek = currentDate.getDay();
  const startOfWeek = new Date(currentYear, currentMonth, currentDate.getDate() - currentDayOfWeek);
  const weekDaysArray = Array.from({ length: 7 }, (_, i) => {
    return new Date(startOfWeek.getFullYear(), startOfWeek.getMonth(), startOfWeek.getDate() + i);
  });

  const renderCell = (cellDate, key, isWeekView = false) => {
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

    return (
      <div
        key={key}
        onClick={cellEvents.length > 0 ? () => handleEventClick(cellEvents[0]) : undefined}
        style={{
          height: '100%',
          minHeight: 0,
          padding: '0.35rem 0.45rem',
          borderRadius: '8px',
          border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
          backgroundColor: isToday ? 'var(--bg-subtle)' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          cursor: cellEvents.length > 0 ? 'pointer' : 'default',
          transition: 'all 0.15s ease',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
        className="calendar-cell"
      >
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.2rem',
          flexShrink: 0
        }}>
          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: isToday ? '800' : '600',
            color: isToday ? 'var(--primary)' : 'var(--text-main)',
            backgroundColor: isToday ? 'var(--bg-hover)' : 'transparent',
            padding: isToday ? '0.05rem 0.35rem' : '0',
            borderRadius: '4px',
            lineHeight: 1.2
          }}>
            {cellDate.getDate()}
          </span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '0.2rem', 
          width: '100%', 
          minWidth: 0, 
          flex: 1, 
          minHeight: 0, 
          overflowY: 'auto' 
        }}>
          {cellEvents.map((evt, i) => {
            const isDead = evt.type === 'deadline';
            const isMeet = evt.type === 'meeting';
            const isCut = evt.type === 'cutoff';
            const bgColor = isDead ? 'var(--danger-bg)' : isMeet ? 'var(--warning-bg)' : isCut ? 'var(--info-bg)' : 'var(--bg-subtle)';
            const textColor = isDead ? 'var(--danger-text)' : isMeet ? 'var(--warning-text)' : isCut ? 'var(--info-text)' : 'var(--text-main)';
            const borderColor = isDead ? 'var(--danger)' : isMeet ? 'var(--warning)' : isCut ? 'var(--info)' : 'var(--border-color)';
            
            return (
              <div key={i} className="calendar-cell-event" style={{
                fontSize: '0.675rem',
                padding: '0.2rem 0.35rem',
                borderRadius: '3px',
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `3px solid ${borderColor}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: '600',
                minWidth: 0,
                flexShrink: 0
              }} title={evt.title}>
                {evt.title}
              </div>
            );
          })}
        </div>
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
    <div className="page-container calendar-page-container" style={{ height: 'calc(100vh - 68px)', maxHeight: 'calc(100vh - 68px)', padding: '1rem 1.75rem', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', overflow: 'hidden', gap: 0, position: 'relative' }}>
      <style>{`
        .calendar-cell:hover {
          background-color: var(--bg-hover) !important;
        }
        .event-card {
          transition: all 0.2s ease;
        }
        .event-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .year-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }
        @media (max-width: 900px) {
          .year-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 600px) {
          .year-grid {
            grid-template-columns: 1fr;
          }
        }
        .drawer-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.4);
          z-index: 999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.3s ease;
        }
        .drawer-overlay.open {
          opacity: 1;
          pointer-events: auto;
        }
        .events-drawer {
          position: fixed;
          top: 0; right: 0; bottom: 0;
          width: 420px;
          max-width: 100vw;
          background-color: var(--bg-main);
          z-index: 1000;
          box-shadow: -4px 0 24px rgba(0,0,0,0.1);
          transform: translateX(100%);
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          border-left: 1px solid var(--border-color);
        }
        .events-drawer.open {
          transform: translateX(0);
        }
        .list-grid-view {
          display: grid;
          grid-template-columns: 120px 2fr 1.5fr;
        }
        @media (max-width: 768px) {
          .list-grid-view {
            grid-template-columns: 1fr;
            gap: 0.5rem !important;
          }
          .calendar-cell {
            padding: 0.2rem !important;
          }
          .calendar-cell > div > span {
            font-size: 0.7rem !important;
          }
          .calendar-cell-event {
            font-size: 0.55rem !important;
            padding: 0.1rem 0.2rem !important;
          }
        }
      `}</style>

      <div style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main Calendar View Area */}
        <div className="card" style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.75rem', flexShrink: 0 }}>
            {/* 1. Left Side: Display ONLY the current month and year title */}
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {getCalendarTitle()}
            </h3>
            
            {/* 2. Right Side Controls: Strict Left-to-Right Sequence */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
              {/* First: Filter Icon Button ONLY (view switcher: Month, Week, Year, List) */}
              <div style={{ position: 'relative' }} ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="btn btn-outline"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isFilterMenuOpen ? 'var(--bg-subtle)' : 'var(--bg-card)',
                    borderColor: isFilterMenuOpen ? 'var(--primary)' : 'var(--border-color)',
                    color: isFilterMenuOpen ? 'var(--primary)' : 'var(--text-main)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  title="Switch View"
                  aria-label="Switch calendar view"
                  aria-haspopup="true"
                  aria-expanded={isFilterMenuOpen}
                >
                  <Filter size={17} />
                </button>

                {isFilterMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 6px)',
                      right: 0,
                      backgroundColor: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      boxShadow: 'var(--shadow-xl)',
                      zIndex: 100,
                      minWidth: '145px',
                      padding: '0.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem'
                    }}
                  >
                    {['Year', 'Month', 'Week', 'List'].map((v) => (
                      <button
                        key={v}
                        onClick={() => {
                          setView(v);
                          setIsFilterMenuOpen(false);
                        }}
                        style={{
                          padding: '0.5rem 0.75rem',
                          fontSize: '0.825rem',
                          fontWeight: view === v ? '700' : '500',
                          textAlign: 'left',
                          borderRadius: 'var(--radius-sm)',
                          backgroundColor: view === v ? 'var(--primary-light)' : 'transparent',
                          color: view === v ? 'var(--primary)' : 'var(--text-main)',
                          border: 'none',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (view !== v) e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                        }}
                        onMouseLeave={(e) => {
                          if (view !== v) e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                      >
                        <span>{v}</span>
                        {view === v && <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Second: Calendar Icon Button ONLY (All Events) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="btn btn-outline"
                style={{
                  width: '38px',
                  height: '38px',
                  padding: 0,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-card)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="All Events"
                aria-label="View all events"
              >
                <CalendarIcon size={17} />
              </button>

              {/* Third: Today Navigation Group (<, Today, >) */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <button
                  onClick={handlePrev}
                  className="btn btn-outline"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                  title="Previous Period"
                  aria-label="Previous period"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleToday}
                  className="btn btn-outline"
                  style={{
                    height: '38px',
                    padding: '0 0.95rem',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                >
                  Today
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-outline"
                  style={{
                    width: '38px',
                    height: '38px',
                    padding: 0,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-main)'
                  }}
                  title="Next Period"
                  aria-label="Next period"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {view !== 'List' && view !== 'Year' && view !== 'Week' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.35rem', flexShrink: 0 }}>
              {weekDays.map(d => <div key={d}>{d}</div>)}
            </div>
          )}

          {view === 'Month' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(auto-fit, minmax(0, 1fr))', gridAutoRows: '1fr', gap: '0.35rem', flex: 1, minHeight: 0, height: '100%' }}>
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`blank-${i}`} style={{ minHeight: 0, height: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', opacity: 0.3 }} />
              ))}
              {daysInMonth.map(day => {
                const cellDate = new Date(currentYear, currentMonth, day);
                return renderCell(cellDate, day);
              })}
            </div>
          )}

          {view === 'Week' && (
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.35rem', flexShrink: 0 }}>
                {weekDays.map(d => <div key={d}>{d}</div>)}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridAutoRows: '1fr', gap: '0.35rem', flex: 1, minHeight: 0, height: '100%' }}>
                {weekDaysArray.map((cellDate, i) => {
                  return renderCell(cellDate, `week-day-${i}`, true);
                })}
              </div>
            </div>
          )}

          {view === 'List' && (
            <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
              {filteredEvents.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>
                  No matching events found
                </div>
              ) : (
                filteredEvents.map((evt, idx) => {
                  const evtDate = new Date(evt.date);
                  const isDead = evt.type === 'deadline';
                  const isMeet = evt.type === 'meeting';
                  const isCut = evt.type === 'cutoff';
                  const borderColor = isDead ? 'var(--danger)' : isMeet ? 'var(--warning)' : isCut ? 'var(--info)' : 'var(--border-color)';
                  const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name)) || mockOpportunities[0];

                  return (
                    <div
                      key={`list-${idx}`}
                      className="event-card list-grid-view"
                      onClick={() => handleEventClick(evt)}
                      style={{
                        cursor: 'pointer',
                        gap: '1.5rem',
                        alignItems: 'center',
                        padding: '1.25rem',
                        borderRadius: 'var(--radius-lg)',
                        backgroundColor: 'var(--bg-subtle)',
                        borderLeft: `6px solid ${borderColor}`,
                        borderTop: '1px solid var(--border-color)',
                        borderRight: '1px solid var(--border-color)',
                        borderBottom: '1px solid var(--border-color)',
                      }}
                    >
                      {/* 1. Month/Date */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase' }}>
                          {evtDate.toLocaleString('default', { month: 'short' })} {evtDate.getDate()}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                          {evtDate.getFullYear()}
                        </span>
                      </div>
                      
                      {/* 2. Project */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {opp.name}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          {opp.source} • {opp.sector}
                        </span>
                      </div>

                      {/* 3. Event/Deadline */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--text-main)' }}>
                          {evt.title}
                        </span>
                        <span style={{ 
                          fontSize: '0.75rem', 
                          fontWeight: '700',
                          padding: '0.2rem 0.6rem', 
                          borderRadius: 'var(--radius-full)', 
                          backgroundColor: isDead ? 'var(--danger-bg)' : isMeet ? 'var(--warning-bg)' : isCut ? 'var(--info-bg)' : 'var(--bg-subtle)',
                          color: isDead ? 'var(--danger-text)' : isMeet ? 'var(--warning-text)' : isCut ? 'var(--info-text)' : 'var(--text-main)',
                          display: 'inline-block',
                          width: 'fit-content'
                        }}>
                          {evt.type === 'deadline' ? 'Submission Deadline' : evt.type === 'meeting' ? 'Pre-bid Meeting' : 'Clarification Cut-off'}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {view === 'Year' && (
            <div className="year-grid" style={{ flex: 1, minHeight: 0, overflowY: 'auto', paddingRight: '0.25rem' }}>
              {Array.from({ length: 12 }, (_, i) => {
                const monthDate = new Date(currentYear, i, 1);
                const monthName = monthDate.toLocaleString('default', { month: 'long' });
                const eventsInMonth = filteredEvents.filter(evt => {
                  const d = new Date(evt.date);
                  return d.getFullYear() === currentYear && d.getMonth() === i;
                });
                const count = eventsInMonth.length;
                
                return (
                  <div
                    key={`year-month-${i}`}
                    className="event-card"
                    onClick={() => {
                      setCurrentDate(new Date(currentYear, i, 1));
                      setView('Month');
                    }}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: 'var(--bg-subtle)',
                      padding: '1.25rem',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      border: count > 0 ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      minHeight: '100px'
                    }}
                  >
                    <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {monthName}
                    </span>
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: count > 0 ? '#FFF' : 'var(--text-muted)', 
                      fontWeight: '700',
                      backgroundColor: count > 0 ? 'var(--primary)' : 'transparent',
                      padding: count > 0 ? '0.15rem 0.75rem' : '0',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      {count} {count === 1 ? 'Event' : 'Events'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Events Drawer Overlay */}
      <div 
        className={`drawer-overlay ${isDrawerOpen ? 'open' : ''}`} 
        onClick={() => setIsDrawerOpen(false)}
      />

      {/* Events Drawer */}
      <div className={`events-drawer ${isDrawerOpen ? 'open' : ''}`}>
        <div style={{ 
          padding: '1.5rem', 
          borderBottom: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: 'var(--bg-main)'
        }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', margin: 0, color: 'var(--text-main)' }}>All Events</h3>
          <button 
            onClick={() => setIsDrawerOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
          >
            <X size={24} />
          </button>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {allUpcomingEvents.length === 0 ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: '600' }}>
              No upcoming events found
            </div>
          ) : (
            allUpcomingEvents.map((evt, idx) => {
              const opp = mockOpportunities.find(o => o.name.includes(evt.desc) || evt.desc.includes(o.name)) || mockOpportunities[0];
              const isDead = evt.type === 'deadline';
              const isMeet = evt.type === 'meeting';
              const isCut = evt.type === 'cutoff';
              const borderColor = isDead ? 'var(--danger)' : isMeet ? 'var(--warning)' : isCut ? 'var(--info)' : 'var(--border-color)';
              const typeLabel = isDead ? 'Deadline' : isMeet ? 'Meeting' : 'Cut-off';
              const typeColor = isDead ? 'var(--danger-text)' : isMeet ? 'var(--warning-text)' : isCut ? 'var(--info-text)' : 'var(--text-main)';
              const typeBg = isDead ? 'var(--danger-bg)' : isMeet ? 'var(--warning-bg)' : isCut ? 'var(--info-bg)' : 'var(--bg-subtle)';

              return (
                <div
                  key={`side-${idx}`}
                  className="event-card"
                  onClick={() => {
                    handleEventClick(evt);
                    setIsDrawerOpen(false);
                  }}
                  style={{
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--bg-subtle)',
                    border: '1px solid var(--border-color)',
                    borderLeftWidth: '5px',
                    borderLeftColor: borderColor
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>
                      {new Date(evt.date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      fontWeight: '800', 
                      padding: '0.2rem 0.5rem', 
                      borderRadius: '4px', 
                      backgroundColor: typeBg, 
                      color: typeColor,
                      textTransform: 'uppercase'
                    }}>
                      {typeLabel}
                    </span>
                  </div>
                  
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--text-main)' }}>
                    {evt.title}
                  </span>
                  
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'flex-start', gap: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: '700' }}>Project:</span>
                    <span>{opp.name}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
