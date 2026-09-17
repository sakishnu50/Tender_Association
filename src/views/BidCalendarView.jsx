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

  // When search becomes active and finds results, navigate to the first match's month
  useEffect(() => {
    if (activeSearch && filteredEvents.length > 0) {
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
    setView('Month');
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
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          cursor: cellEvents.length > 0 ? 'pointer' : 'default',
          minWidth: 0,
          overflow: 'hidden',
          boxSizing: 'border-box'
        }}
        className={`calendar-cell ${isToday ? 'is-today' : ''}`}
      >
        <div className="calendar-cell-header" style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.2rem',
          flexShrink: 0
        }}>
          {isToday ? (
            <span className="today-badge">
              {cellDate.getDate()}
            </span>
          ) : (
            <span className="calendar-cell-date" style={{ 
              fontSize: '0.8rem', 
              fontWeight: '600',
              color: 'var(--text-main)',
              padding: '0',
              borderRadius: '4px',
              lineHeight: 1.2
            }}>
              {cellDate.getDate()}
            </span>
          )}
        </div>
        
        <div className="calendar-events-container" style={{ 
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
            const dotColor = isDead ? '#EF4444' : isMeet ? '#F59E0B' : isCut ? '#3B82F6' : 'var(--primary)';
            
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
                <span className="calendar-event-text">{evt.title}</span>
                <span className="calendar-event-dot" style={{ backgroundColor: dotColor }} />
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
        .calendar-cell {
          border: 1px solid var(--border-color);
          background-color: transparent;
          transition: all 0.15s ease;
        }
        .calendar-cell:hover {
          background-color: var(--bg-hover) !important;
        }
        .calendar-cell.is-today {
          border: 2px solid #2563EB !important;
          background-color: rgba(37, 99, 235, 0.08) !important;
          box-shadow: 0 0 0 1px rgba(37, 99, 235, 0.25) !important;
        }
        [data-theme="dark"] .calendar-cell.is-today {
          border: 2px solid #3B82F6 !important;
          background-color: rgba(37, 99, 235, 0.18) !important;
          box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.35) !important;
        }
        .today-badge {
          font-size: 0.8rem;
          font-weight: 800;
          color: #FFFFFF;
          background-color: #2563EB;
          padding: 0.1rem 0.45rem;
          border-radius: 4px;
          line-height: 1.2;
          display: inline-block;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
        }
        [data-theme="dark"] .today-badge {
          color: #BFDBFE;
          background-color: rgba(30, 58, 138, 0.7);
          border: 1px solid rgba(59, 130, 246, 0.5);
          font-weight: 800;
        }
        .calendar-event-text {
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100%;
        }
        .calendar-event-dot {
          display: none;
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
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: repeat(3, 1fr);
          gap: 0.65rem;
        }
        @media (max-width: 900px) {
          .year-grid {
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: auto;
            overflow-y: auto;
          }
        }
        @media (max-width: 600px) {
          .year-grid {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            overflow-y: auto;
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
        .calendar-toolbar {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.75rem;
          flex-shrink: 0;
          position: relative;
          z-index: 40;
        }
        .calendar-filter-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          box-shadow: var(--shadow-xl);
          z-index: 50;
          min-width: 130px;
          padding: 0.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          box-sizing: border-box;
        }
        .calendar-filter-item {
          padding: 0.5rem 0.75rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: left;
          border-radius: var(--radius-sm);
          background-color: transparent;
          color: #111827;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          transition: all 0.15s ease;
          width: 100%;
          box-sizing: border-box;
        }
        .calendar-filter-item:hover {
          background-color: var(--bg-subtle);
          color: #111827;
        }
        .calendar-filter-item.active {
          background-color: var(--primary-light);
          color: var(--primary);
          font-weight: 700;
        }
        [data-theme="dark"] .calendar-filter-dropdown {
          background-color: #151D30;
          border-color: #26334D;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.7);
        }
        [data-theme="dark"] .calendar-filter-item {
          color: #F3F4F6;
        }
        [data-theme="dark"] .calendar-filter-item:hover {
          background-color: #1E293B;
          color: #FFFFFF;
        }
        [data-theme="dark"] .calendar-filter-item.active {
          color: #60A5FA;
          background-color: rgba(37, 99, 235, 0.22);
        }
        .calendar-filter-check {
          font-size: 0.85rem;
          font-weight: 800;
          color: var(--primary);
          flex-shrink: 0;
        }
        [data-theme="dark"] .calendar-filter-check {
          color: #60A5FA;
        }
        .calendar-toolbar-title {
          font-size: 1.25rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
          padding: 0.25rem 0;
        }
        .calendar-toolbar-controls {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: nowrap;
          flex-shrink: 0;
        }
        .calendar-ctrl-btn {
          width: 38px;
          height: 38px;
          padding: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }
        .calendar-ctrl-btn:hover {
          background-color: var(--bg-subtle);
          border-color: var(--primary);
          color: var(--primary);
        }
        .calendar-today-group {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          flex-shrink: 0;
        }
        .calendar-today-btn {
          height: 38px;
          padding: 0 0.95rem;
          font-size: 0.85rem;
          font-weight: 700;
          border-radius: var(--radius-md);
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          color: var(--text-main);
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .calendar-today-btn:hover {
          background-color: var(--bg-subtle);
          border-color: var(--primary);
          color: var(--primary);
        }
        .calendar-grid-wrapper {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        .calendar-grid-inner {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
          height: 100%;
          width: 100%;
        }
        @media (max-width: 640px) {
          .calendar-page-container {
            padding: 0.75rem 0.5rem !important;
            height: auto !important;
            max-height: none !important;
            min-height: calc(100vh - 120px);
          }
          .calendar-card {
            padding: 0.65rem 0.5rem !important;
          }
          .calendar-toolbar {
            display: flex !important;
            flex-direction: row !important;
            flex-wrap: wrap !important;
            align-items: center !important;
            justify-content: space-between !important;
            gap: 0.4rem !important;
            margin-top: 0.25rem !important;
            margin-bottom: 0.5rem !important;
          }
          .calendar-toolbar-title {
            margin: 0 !important;
            padding: 0 !important;
            font-size: 1.15rem !important;
            line-height: 1.2;
          }
          .calendar-toolbar-controls {
            display: inline-flex !important;
            align-items: center !important;
            justify-content: flex-end !important;
            gap: 0.35rem !important;
            flex-wrap: nowrap !important;
            flex-shrink: 0 !important;
          }
          .calendar-ctrl-btn {
            width: 32px !important;
            height: 32px !important;
            padding: 0 !important;
          }
          .calendar-today-group {
            gap: 0.25rem !important;
          }
          .calendar-today-btn {
            height: 32px !important;
            padding: 0 0.65rem !important;
            font-size: 0.775rem !important;
          }
          .calendar-grid-wrapper {
            overflow: hidden !important;
            width: 100% !important;
            padding: 0 !important;
          }
          .calendar-grid-inner {
            min-width: 0 !important;
            width: 100% !important;
            min-height: 0 !important;
          }
          .calendar-grid-header {
            gap: 2px !important;
            font-size: 10px !important;
            margin-bottom: 4px !important;
          }
          .calendar-month-grid {
            gap: 2px !important;
          }
          .calendar-cell {
            padding: 2px !important;
            border-radius: 4px !important;
          }
          .calendar-cell-header {
            margin-bottom: 2px !important;
            justify-content: center !important;
          }
          .calendar-cell-date {
            font-size: 10px !important;
            font-weight: 700 !important;
          }
          .today-badge {
            font-size: 9px !important;
            padding: 0px 3px !important;
            border-radius: 3px !important;
          }
          .calendar-events-container {
            flex-direction: row !important;
            flex-wrap: wrap !important;
            gap: 2px !important;
            justify-content: center !important;
            align-items: center !important;
            overflow: hidden !important;
          }
          .calendar-cell-event {
            padding: 0 !important;
            border: none !important;
            background: transparent !important;
            min-width: unset !important;
            width: auto !important;
            height: auto !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            margin: 0 !important;
          }
          .calendar-event-text {
            display: none !important;
          }
          .calendar-event-dot {
            display: block !important;
            width: 5px !important;
            height: 5px !important;
            border-radius: 50% !important;
            box-shadow: 0 0 1px rgba(0,0,0,0.5);
          }
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

      <div style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Main Calendar View Area */}
        <div className="card calendar-card" style={{ flex: 1, minHeight: 0, height: '100%', display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem', overflow: 'hidden', boxSizing: 'border-box' }}>
          <div className="calendar-toolbar">
            {/* 1. Left Side: Display ONLY the current month and year title */}
            <h3 className="calendar-toolbar-title">
              {getCalendarTitle()}
            </h3>
            
            {/* 2. Right Side Controls: Strict Left-to-Right Sequence */}
            <div className="calendar-toolbar-controls">
              {/* First: Filter Icon Button ONLY (view switcher: Month, Week, Year, List) */}
              <div style={{ position: 'relative' }} ref={filterMenuRef}>
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="btn btn-outline calendar-ctrl-btn"
                  style={{
                    backgroundColor: isFilterMenuOpen ? 'var(--bg-subtle)' : 'var(--bg-card)',
                    borderColor: isFilterMenuOpen ? 'var(--primary)' : 'var(--border-color)',
                    color: isFilterMenuOpen ? 'var(--primary)' : 'var(--text-main)'
                  }}
                  title="Switch View"
                  aria-label="Switch calendar view"
                  aria-haspopup="true"
                  aria-expanded={isFilterMenuOpen}
                >
                  <Filter size={16} />
                </button>

                {isFilterMenuOpen && (
                  <div
                    className="calendar-filter-dropdown"
                    role="menu"
                    aria-label="View switcher options"
                  >
                    {['Year', 'Month'].map((v) => (
                      <button
                        key={v}
                        role="menuitem"
                        onClick={() => {
                          setView(v);
                          setIsFilterMenuOpen(false);
                        }}
                        className={`calendar-filter-item ${view === v ? 'active' : ''}`}
                      >
                        <span>{v}</span>
                        {view === v && (
                          <span className="calendar-filter-check" aria-hidden="true">✓</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Second: Calendar Icon Button ONLY (All Events) */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="btn btn-outline calendar-ctrl-btn"
                title="All Events"
                aria-label="View all events"
              >
                <CalendarIcon size={16} />
              </button>

              {/* Third: Today Navigation Group (<, Today, >) */}
              <div className="calendar-today-group">
                <button
                  onClick={handlePrev}
                  className="btn btn-outline calendar-ctrl-btn"
                  title="Previous Period"
                  aria-label="Previous period"
                >
                  <ChevronLeft size={17} />
                </button>
                <button
                  onClick={handleToday}
                  className="btn btn-outline calendar-today-btn"
                >
                  Today
                </button>
                <button
                  onClick={handleNext}
                  className="btn btn-outline calendar-ctrl-btn"
                  title="Next Period"
                  aria-label="Next period"
                >
                  <ChevronRight size={17} />
                </button>
              </div>
            </div>
          </div>

          {view === 'Month' && (
            <div className="calendar-grid-wrapper">
              <div className="calendar-grid-inner">
                <div className="calendar-grid-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.35rem', textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '0.35rem', flexShrink: 0 }}>
                  {weekDays.map(d => <div key={d}>{d}</div>)}
                </div>
                <div className="calendar-month-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gridTemplateRows: 'repeat(auto-fit, minmax(0, 1fr))', gridAutoRows: '1fr', gap: '0.35rem', flex: 1, minHeight: 0, height: '100%' }}>
                  {[...Array(firstDayOfMonth)].map((_, i) => (
                    <div key={`blank-${i}`} style={{ minHeight: 0, height: '100%', backgroundColor: 'var(--bg-subtle)', borderRadius: '8px', opacity: 0.3 }} />
                  ))}
                  {daysInMonth.map(day => {
                    const cellDate = new Date(currentYear, currentMonth, day);
                    return renderCell(cellDate, day);
                  })}
                </div>
              </div>
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
            <div
              className="year-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gridTemplateRows: 'repeat(3, 1fr)',
                gridAutoRows: '1fr',
                gap: '0.65rem',
                flex: 1,
                minHeight: 0,
                height: '100%',
                overflow: 'hidden'
              }}
            >
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
                      padding: '0.75rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.35rem',
                      border: count > 0 ? '1px solid var(--primary)' : '1px solid var(--border-color)',
                      height: '100%',
                      minHeight: 0,
                      boxSizing: 'border-box'
                    }}
                  >
                    <span style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1.2 }}>
                      {monthName}
                    </span>
                    <span style={{ 
                      fontSize: '0.75rem', 
                      color: count > 0 ? '#FFF' : 'var(--text-muted)', 
                      fontWeight: '700',
                      backgroundColor: count > 0 ? 'var(--primary)' : 'transparent',
                      padding: count > 0 ? '0.1rem 0.6rem' : '0',
                      borderRadius: 'var(--radius-full)',
                      lineHeight: 1.2
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
