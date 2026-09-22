import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';

export default function SearchBar({
  value = '',
  onChange,
  placeholder = 'Search opportunities, projects, sources, or sectors...',
  onClear,
  onSubmit,
  onFilterClick,
  showFilterButton = false,
  filterCount = 0,
  containerStyle = {},
  inputStyle = {},
  className = ''
}) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) {
      onSubmit(value);
    }
  };

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else if (onChange) {
      onChange({ target: { value: '' } });
    }
  };

  return (
    <div
      className={`search-bar-container ${className}`}
      style={{
        padding: '24px',
        marginBottom: '20px',
        backgroundColor: 'var(--bg-card, #FFFFFF)',
        borderRadius: '12px',
        border: '1px solid var(--border-color, #E2E8F0)',
        boxShadow: 'var(--shadow-sm, 0 1px 3px rgba(0,0,0,0.05))',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box',
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
        ...containerStyle
      }}
    >
      <div
        style={{
          position: 'relative',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          width: '100%'
        }}
      >
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '14px',
            color: 'var(--text-muted, #94A3B8)',
            pointerEvents: 'none',
            zIndex: 1
          }}
        />

        <input
          type="text"
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '44px',
            padding: '12px 40px 12px 42px',
            borderRadius: '8px',
            border: '1px solid var(--border-color, #CBD5E1)',
            backgroundColor: 'var(--bg-subtle, #F8FAFC)',
            color: 'var(--text-main, #0F172A)',
            fontSize: '0.9rem',
            fontWeight: '400',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.15s ease-in-out',
            ...inputStyle
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--primary, #2563EB)';
            e.target.style.backgroundColor = 'var(--bg-card, #FFFFFF)';
            e.target.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.12)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color, #CBD5E1)';
            e.target.style.backgroundColor = 'var(--bg-subtle, #F8FAFC)';
            e.target.style.boxShadow = 'none';
          }}
        />

        {value && (
          <button
            type="button"
            onClick={handleClear}
            title="Clear search"
            style={{
              position: 'absolute',
              right: '12px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted, #94A3B8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4px',
              borderRadius: '50%',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--border-color, #E2E8F0)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <X size={16} />
          </button>
        )}
      </div>

      {showFilterButton && (
        <button
          type="button"
          onClick={onFilterClick}
          style={{
            height: '44px',
            padding: '0 16px',
            borderRadius: '8px',
            border: '1px solid var(--border-color, #CBD5E1)',
            backgroundColor: 'var(--bg-card, #FFFFFF)',
            color: 'var(--text-main, #334155)',
            fontSize: '0.875rem',
            fontWeight: '600',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            transition: 'all 0.15s ease'
          }}
        >
          <SlidersHorizontal size={16} />
          <span>Filters</span>
          {filterCount > 0 && (
            <span
              style={{
                backgroundColor: 'var(--primary, #2563EB)',
                color: '#FFFFFF',
                fontSize: '0.75rem',
                fontWeight: '700',
                padding: '2px 6px',
                borderRadius: '9999px',
                lineHeight: 1
              }}
            >
              {filterCount}
            </span>
          )}
        </button>
      )}
    </div>
  );
}
