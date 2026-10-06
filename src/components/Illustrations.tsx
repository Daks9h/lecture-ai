import React from 'react';

/**
 * Original Hacktoberfest-inspired technical editorial vector marks.
 * Minimal, geometric, hand-inked aesthetic. Zero AI cliches, zero emojis.
 */

export const ScoutMark: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 36 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Scout Explorer Cap & Visor */}
    <rect x="10" y="10" width="28" height="28" rx="8" fill="#FFEDE4" stroke="#1C1A17" strokeWidth="2.5" />
    {/* Cap Bill */}
    <path d="M12 20C12 16 16 14 24 14C32 14 36 16 36 20" stroke="#1C1A17" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M22 10V14" stroke="#E85D26" strokeWidth="2.5" strokeLinecap="round" />
    {/* Explorer Goggles / Eyes */}
    <rect x="15" y="22" width="7" height="6" rx="3" fill="#FFFFFF" stroke="#1C1A17" strokeWidth="2" />
    <rect x="26" y="22" width="7" height="6" rx="3" fill="#FFFFFF" stroke="#1C1A17" strokeWidth="2" />
    <circle cx="18.5" cy="25" r="1.5" fill="#1C1A17" />
    <circle cx="29.5" cy="25" r="1.5" fill="#1C1A17" />
    <path d="M22 25H26" stroke="#1C1A17" strokeWidth="2" />
    {/* Determined smile */}
    <path d="M21 32C22.5 33.5 25.5 33.5 27 32" stroke="#1C1A17" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const RadarCompassGraphic: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="84"
    height="84"
    viewBox="0 0 84 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="42" cy="42" r="38" stroke="#1C1A17" strokeWidth="2" strokeDasharray="4 4" fill="#FAF8F5" />
    <circle cx="42" cy="42" r="26" stroke="#1C1A17" strokeWidth="1.5" fill="#FFFDF9" />
    <circle cx="42" cy="42" r="14" stroke="#E85D26" strokeWidth="2" fill="#FFEDE4" />
    <circle cx="42" cy="42" r="3" fill="#1C1A17" />
    <line x1="42" y1="4" x2="42" y2="80" stroke="#1C1A17" strokeWidth="1" strokeOpacity="0.4" />
    <line x1="4" y1="42" x2="80" y2="42" stroke="#1C1A17" strokeWidth="1" strokeOpacity="0.4" />
    {/* Blip 1: High Yield Target */}
    <circle cx="56" cy="28" r="4.5" fill="#DC2626" stroke="#1C1A17" strokeWidth="1.5" />
    {/* Blip 2: Second Target */}
    <circle cx="28" cy="52" r="3.5" fill="#D97706" stroke="#1C1A17" strokeWidth="1.5" />
  </svg>
);

export const LogicCircuitDiagram: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="120"
    height="60"
    viewBox="0 0 120 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* Logic Gate & Input Traces */}
    <path d="M10 20H35" stroke="#1C1A17" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 40H35" stroke="#1C1A17" strokeWidth="2" strokeLinecap="round" />
    {/* AND / ALU block */}
    <rect x="35" y="10" width="40" height="40" rx="6" fill="#FFFDF9" stroke="#1C1A17" strokeWidth="2" />
    <text x="55" y="34" fontFamily="Outfit, sans-serif" fontSize="12" fontWeight="800" textAnchor="middle" fill="#1C1A17">
      ALU
    </text>
    {/* Output trace */}
    <path d="M75 30H105" stroke="#E85D26" strokeWidth="2" strokeLinecap="round" />
    <circle cx="108" cy="30" r="3" fill="#E85D26" stroke="#1C1A17" strokeWidth="1.5" />
  </svg>
);

export const CassetteDeckIllustration: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    width="52"
    height="36"
    viewBox="0 0 52 36"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <rect x="2" y="2" width="48" height="32" rx="4" fill="#FAF8F5" stroke="#1C1A17" strokeWidth="2" />
    <rect x="8" y="7" width="36" height="18" rx="2" fill="#EAE5DC" stroke="#1C1A17" strokeWidth="1.5" />
    {/* Spools */}
    <circle cx="18" cy="16" r="4.5" fill="#FFFDF9" stroke="#1C1A17" strokeWidth="1.5" />
    <circle cx="18" cy="16" r="2" fill="#1C1A17" />
    <circle cx="34" cy="16" r="4.5" fill="#FFFDF9" stroke="#1C1A17" strokeWidth="1.5" />
    <circle cx="34" cy="16" r="2" fill="#1C1A17" />
    <line x1="22.5" y1="16" x2="29.5" y2="16" stroke="#1C1A17" strokeWidth="1" strokeDasharray="1 1" />
  </svg>
);
