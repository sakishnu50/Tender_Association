import React from 'react';

/**
 * Animated SVG circular ring showing a score (e.g. 8 out of 10).
 * Circumference of r=40 circle = 2π×40 ≈ 251.2
 */
export default function ScoreRing({ score, max = 10 }) {
  const circumference = 251.2;
  const pct = Math.min(score / max, 1);
  const offset = circumference - pct * circumference;

  return (
    <div className="score-ring-wrap">
      <svg
        className="score-ring-svg"
        width="110"
        height="110"
        viewBox="0 0 110 110"
      >
        <circle className="score-ring-track" cx="55" cy="55" r="40" />
        <circle
          className="score-ring-fill"
          cx="55"
          cy="55"
          r="40"
          style={{ '--ring-offset': offset }}
        />
      </svg>
      <div className="score-ring-label">
        <span className="score-ring-value">{score}</span>
        <span className="score-ring-denom">/ {max}</span>
      </div>
    </div>
  );
}
