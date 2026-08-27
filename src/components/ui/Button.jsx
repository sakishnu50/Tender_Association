import React from 'react';

export function Button({ variant = 'primary', children, style, className = '', ...props }) {
  const variantClass = variant ? `btn-${variant}` : '';
  return (
    <button className={`btn ${variantClass} ${className}`.trim()} style={style} {...props}>
      {children}
    </button>
  );
}
