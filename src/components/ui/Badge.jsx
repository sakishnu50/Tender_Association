import React from 'react';

export function Badge({ variant = 'info', children, style, className = '', ...props }) {
  const variantClass = variant ? `badge-${variant}` : '';
  return (
    <span className={`badge ${variantClass} ${className}`.trim()} style={style} {...props}>
      {children}
    </span>
  );
}
