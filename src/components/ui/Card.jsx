import React from 'react';

export function Card({ title, children, style, className = '', ...props }) {
  return (
    <div className={`card ${className}`.trim()} style={style} {...props}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
}
