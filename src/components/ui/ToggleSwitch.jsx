import React from 'react';

export function ToggleSwitch({ checked, onChange, disabled = false }) {
  return (
    <label className="toggle-switch">
      <input
        type="checkbox"
        checked={!!checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="toggle-slider" />
    </label>
  );
}
