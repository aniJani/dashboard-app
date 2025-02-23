export const CircuitBrain = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full"
  >
    <defs>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>
    </defs>
    <g filter="url(#glow)">
      {/* Brain outline made of circuit paths */}
      <path
        d="M100,200 Q150,100 200,150 T300,200 Q250,300 200,250 T100,200"
        fill="none"
        stroke="#00caeb"
        strokeWidth="2"
        className="animate-draw opacity-60"
      />
      {/* Circuit nodes */}
      {[
        [150, 150], [200, 120], [250, 150],
        [280, 200], [250, 250], [200, 280],
        [150, 250], [120, 200], [180, 180],
        [220, 220], [200, 200]
      ].map(([x, y], i) => (
        <g key={i}>
          <circle
            cx={x}
            cy={y}
            r="4"
            fill="#00caeb"
            className="animate-pulse"
          />
          {/* Circuit connections */}
          {i < 10 && (
            <line
              x1={x}
              y1={y}
              x2={[150, 150][i % 2]}
              y2={[200, 250][i % 2]}
              stroke="#00caeb"
              strokeWidth="1"
              className="animate-draw opacity-40"
            />
          )}
        </g>
      ))}
    </g>
  </svg>
); 