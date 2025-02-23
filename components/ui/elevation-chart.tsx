export const ElevationChart = () => (
  <svg
    viewBox="0 0 400 800"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="elevationGradient" x1="0%" y1="100%" x2="0%" y2="0%">
        <stop offset="0%" stopColor="#df3f8b" />
        <stop offset="50%" stopColor="#00caeb" />
        <stop offset="100%" stopColor="#060885" />
      </linearGradient>
      <pattern id="lines" width="4" height="4" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="4" y2="4" stroke="currentColor" strokeWidth="1" opacity="0.1" />
      </pattern>
    </defs>
    <path
      d="M50,750 
         C100,700 150,680 200,550 
         S300,400 350,250 
         S400,100 450,50"
      fill="none"
      stroke="url(#elevationGradient)"
      strokeWidth="150"
      strokeLinecap="round"
      className="animate-draw opacity-40"
    />
    <path
      d="M50,750 
         C100,700 150,680 200,550 
         S300,400 350,250 
         S400,100 450,50"
      fill="url(#lines)"
      stroke="url(#elevationGradient)"
      strokeWidth="2"
      strokeLinecap="round"
      className="animate-draw"
    />
    <g className="animate-pulse opacity-60">
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <circle
            cx={50 + i * 100}
            cy={750 - i * 175}
            r="4"
            fill="#00caeb"
          />
          <text
            x={50 + i * 100}
            y={750 - i * 175 - 20}
            fill="#00caeb"
            fontSize="12"
            textAnchor="middle"
          >
            {`${i * 15}km`}
          </text>
        </g>
      ))}
    </g>
  </svg>
); 