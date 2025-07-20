// src/components/Logo.jsx
export default function Logo({ className }) {
  return (
    <svg
      className={className}
      width="120"
      height="120"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 1) Our gradient */}
        <linearGradient id="guardianx-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#EF4444" />
        </linearGradient>

        {/* 2) The full shield shape */}
        <clipPath id="shieldClip">
          <path d="M60 36 L42 44 V60 C42 74 60 84 60 84 C60 84 78 74 78 60 V44 L60 36 Z" />
        </clipPath>

        {/* 3) A simple rectangle covering the right half */}
        <clipPath id="rightClip">
          <rect x="60" y="36" width="18" height="48" />
        </clipPath>
      </defs>

      {/* A) Gradient background rounded square */}
      <rect width="120" height="120" rx="28" fill="url(#guardianx-gradient)" />

      {/* B) White shield base */}
      <path
        d="M60 36 L42 44 V60 C42 74 60 84 60 84 C60 84 78 74 78 60 V44 L60 36 Z"
        fill="white"
      />

      {/* C) Gradient‐filled, white-stroked shield, clipped to right half only */}
      <g clipPath="url(#shieldClip)">
        <g clipPath="url(#rightClip)">
          <path
            d="M60 36 L42 44 V60 C42 74 60 84 60 84 C60 84 78 74 78 60 V44 L60 36 Z"
            fill="url(#guardianx-gradient)"
            stroke="white"
            strokeWidth="6"
            strokeLinejoin="round"
          />
        </g>
      </g>
    </svg>
  );
}
