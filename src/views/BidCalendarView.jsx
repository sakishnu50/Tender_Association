import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Calendar as CalendarIcon, Search, X, ChevronLeft, ChevronRight, XCircle, Filter } from 'lucide-react';
import { mockCalendarEvents } from '../data/mockData';
import { useCalendar, useOpportunities } from '../hooks/useApiQueries';

export default function BidCalendarView({ searchVal: propSearchVal, onSelectOpportunity }) {
  const { data: fetchedEvents } = useCalendar();
  const { data: userOpps = [] } = useOpportunities();
  const calendarEvents = fetchedEvents || mockCalendarEvents;
  const mockOpportunities = userOpps;
  
  const activeSearch = propSearchVal || '';

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [view, setView] = useState('Month'); // 'Year', 'Month', 'Week', 'List'
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const filterDropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target)) {
        setIsFilterDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
          minHeight: isWeekView ? '120px' : '90px',
          padding: '0.5rem',
          borderRadius: '8px',
          border: isToday ? '2px solid var(--primary)' : '1px solid var(--border-color)',
          backgroundColor: isToday ? 'var(--bg-subtle)' : 'transparent',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          cursor: cellEvents.length > 0 ? 'pointer' : 'default',
          transition: 'all 0.2s',
        }}
        className="calendar-cell"
      >
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.4rem'
        }}>
          <span style={{ 
            fontSize: '0.85rem', 
            fontWeight: isToday ? '800' : '600',
            color: isToday ? 'var(--primary)' : 'var(--text-main)',
            backgroundColor: isToday ? 'var(--bg-hover)' : 'transparent',
            padding: isToday ? '0.1rem 0.4rem' : '0',
            borderRadius: '4px'
          }}>
            {cellDate.getDate()}
          </span>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', width: '100%' }}>
          {cellEvents.map((evt, i) => {
            const isDead = evt.type === 'deadline';
            const isMeet = evt.type === 'meeting';
            const isCut = evt.type === 'cutoff';
            const bgColor = isDead ? 'var(--danger-bg)' : isMeet ? 'var(--warning-bg)' : isCut ? 'var(--info-bg)' : 'var(--bg-subtle)';
            const textColor = isDead ? 'var(--danger-text)' : isMeet ? 'var(--warning-text)' : isCut ? 'var(--info-text)' : 'var(--text-main)';
            const borderColor = isDead ? 'var(--danger)' : isMeet ? 'var(--warning)' : isCut ? 'var(--info)' : 'var(--border-color)';
            
            return (
              <div key={i} style={{
                fontSize: '0.7rem',
                padding: '0.3rem 0.4rem',
                borderRadius: '4px',
                backgroundColor: bgColor,
                color: textColor,
                borderLeft: `3px solid ${borderColor}`,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: '600'
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

  const headerPortalElement = document.getElementById('header-actions-portal');

  return (
    <div className="page-container" style={{ position: 'relative', overflowX: 'hidden' }}>
      {headerPortalElement && createPortal(
        <>
          <button 
            className="btn btn-primary" 
            onClick={() => setIsDrawerOpen(true)}
            style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <CalendarIcon size={16} /> View Events
          </button>
          
          <div style={{ position: 'relative' }} ref={filterDropdownRef}>
            <button
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
              className="btn btn-outline"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.4rem 1rem', 
                fontSize: '0.85rem', 
                fontWeight: '700',
                borderRadius: 'var(--radius-md)',
                backgroundColor: isFilterDropdownOpen ? 'var(--bg-subtle)' : 'var(--bg-main)',
                color: 'var(--text-main)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <Filter size={16} /> Filter
            </button>
            
            {isFilterDropdownOpen && (
              <div style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '0.5rem',
                backgroundColor: 'var(--bg-main)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 100,
                minWidth: '150px',
                padding: '0.4rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.2rem'
              }}>
                {['Year', 'Month', 'Week', 'List'].map(v => (
                  <button
                    key={v}
                    onClick={() => {
                      setView(v);
                      setIsFilterDropdownOpen(false);
                    }}
                    style={{
                      padding: '0.6rem 1rem',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      textAlign: 'left',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: view === v ? 'var(--bg-subtle)' : 'transparent',
                      color: view === v ? 'var(--primary)' : 'var(--text-main)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => {
                      if (view !== v) {
                        e.currentTarget.style.backgroundColor = 'var(--bg-hover)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (view !== v) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }
                    }}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}
          </div>
        </>,
        headerPortalElement
      )}

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
          gap: 1.5rem;
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
        }
      `}</style>


      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* Main Calendar View Area */}
        <div className="card" style={{ flex: 1, minHeight: '600px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>{getCalendarTitle()}</h3>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                <button onClick={handlePrev} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={handleToday} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', fontWeight: '700' }}>
                  Today
                </button>
                <button onClick={handleNext} className="btn btn-outline" style={{ padding: '0.4rem', borderRadius: 'var(--radius-md)' }}>
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>

          {view !== 'List' && view !== 'Year' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem', textTransform: 'uppercase', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.5rem' }}>
              {weekDays.map(d => <div key={d}>{d}</div>)}
            </div>
          )}

          {view === 'Month' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {[...Array(firstDayOfMonth)].map((_, i) => (
                <div key={`blank-${i}`} style={{ minHeight: '90px', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', opacity: 0.3 }} />
              ))}
              {daysInMonth.map(day => {
                const cellDate = new Date(currentYear, currentMonth, day);
                return renderCell(cellDate, day);
              })}
            </div>
          )}

          {view === 'Week' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
              {weekDaysArray.map((cellDate, i) => {
                return renderCell(cellDate, `week-day-${i}`, true);
              })}
            </div>
          )}

          {view === 'List' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
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
            <div className="year-grid">
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
                      padding: '1.5rem',
                      borderRadius: 'var(--radius-lg)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      border: count > 0 ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      minHeight: '120px'
                    }}
                  >
                    <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)' }}>
                      {monthName}
                    </span>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      color: count > 0 ? '#FFF' : 'var(--text-muted)', 
                      fontWeight: '700',
                      backgroundColor: count > 0 ? 'var(--primary)' : 'transparent',
                      padding: count > 0 ? '0.2rem 0.8rem' : '0',
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
