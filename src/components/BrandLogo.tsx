import React from 'react';

interface BrandLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  size = 'md',
  showShadow = true
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20'
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center flex-shrink-0 select-none ${sizeMap[size]} ${className}`}
    >
      <svg
        viewBox="0 0 512 512"
        className="w-full h-full drop-shadow-md"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="brandDGradient" x1="160" y1="120" x2="380" y2="380" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#EF4444" />
            <stop offset="45%" stopColor="#DC2626" />
            <stop offset="85%" stopColor="#B91C1C" />
            <stop offset="100%" stopColor="#881337" />
          </linearGradient>

          <linearGradient id="brandShadowGrad" x1="180" y1="360" x2="360" y2="280" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#991B1B" />
            <stop offset="100%" stopColor="#450A0A" />
          </linearGradient>

          <linearGradient id="brandBevel" x1="200" y1="140" x2="360" y2="170" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FCA5A5" />
            <stop offset="100%" stopColor="#DC2626" />
          </linearGradient>

          <linearGradient id="brandNodeCore" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#DC2626" />
            <stop offset="100%" stopColor="#991B1B" />
          </linearGradient>
        </defs>

        <g>
          {/* Main Dimensional D Outer Loop / Ribbon Back Shadow */}
          <path
            d="M 210 145 C 310 140 375 200 365 295 C 355 375 285 400 185 390 C 235 375 270 345 280 290 C 290 235 245 185 190 180 Z"
            fill="url(#brandShadowGrad)"
          />

          {/* Main Dimensional D Outer Loop Front */}
          <path
            d="M 190 140 C 320 135 395 210 380 310 C 365 395 290 415 175 405 C 240 390 290 350 300 285 C 310 215 255 165 175 160 Z"
            fill="url(#brandDGradient)"
          />

          {/* Top Crescent Highlight */}
          <path
            d="M 195 142 C 270 140 335 170 355 220 C 340 180 285 155 210 152 Z"
            fill="url(#brandBevel)"
            opacity="0.8"
          />

          {/* Vertical Left Accent Bar */}
          <path
            d="M 165 195 C 165 185 170 180 175 180 C 180 180 185 185 185 195 L 185 300 C 185 310 180 315 175 315 C 170 315 165 310 165 300 Z"
            fill="#DC2626"
          />

          {/* Network Conduit Lines */}
          <line x1="180" y1="165" x2="180" y2="340" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          <line x1="180" y1="165" x2="180" y2="340" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          <line x1="180" y1="165" x2="270" y2="255" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          <line x1="180" y1="165" x2="270" y2="255" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          <line x1="180" y1="340" x2="270" y2="255" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          <line x1="180" y1="340" x2="270" y2="255" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          <line x1="270" y1="255" x2="350" y2="160" stroke="#DC2626" strokeWidth="16" strokeLinecap="round" />
          <line x1="270" y1="255" x2="350" y2="160" stroke="#FCA5A5" strokeWidth="4" strokeLinecap="round" opacity="0.6" />

          {/* Network Node 1 (Top-Left) */}
          <circle cx="180" cy="165" r="32" fill="#B91C1C" />
          <circle cx="180" cy="165" r="28" fill="#DC2626" />
          <circle cx="180" cy="165" r="21" fill="#FFFFFF" />
          <circle cx="180" cy="165" r="14" fill="url(#brandNodeCore)" />

          {/* Network Node 2 (Bottom-Left) */}
          <circle cx="180" cy="340" r="32" fill="#991B1B" />
          <circle cx="180" cy="340" r="28" fill="#DC2626" />
          <circle cx="180" cy="340" r="21" fill="#FFFFFF" />
          <circle cx="180" cy="340" r="14" fill="url(#brandNodeCore)" />

          {/* Network Node 3 (Center) */}
          <circle cx="270" cy="255" r="28" fill="#991B1B" />
          <circle cx="270" cy="255" r="24" fill="#DC2626" />
          <circle cx="270" cy="255" r="17" fill="#FFFFFF" />
          <circle cx="270" cy="255" r="11" fill="url(#brandNodeCore)" />

          {/* Network Node 4 (Top-Right) */}
          <circle cx="350" cy="160" r="26" fill="#B91C1C" />
          <circle cx="350" cy="160" r="22" fill="#DC2626" />
          <circle cx="350" cy="160" r="15" fill="#FFFFFF" />
          <circle cx="350" cy="160" r="9" fill="url(#brandNodeCore)" />
        </g>
      </svg>
    </div>
  );
};
