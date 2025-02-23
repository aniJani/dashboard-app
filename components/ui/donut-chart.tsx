export const DonutChart = () => (
  <svg
    viewBox="0 0 400 400"
    className="w-full h-full"
  >
    <defs>
      <linearGradient id="donutGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#00caeb" />
        <stop offset="50%" stopColor="#df3f8b" />
        <stop offset="100%" stopColor="#060885" />
      </linearGradient>
    </defs>
    <g className="animate-spin-slow origin-center">
      <path
        d="M200,100 A100,100 0 1,1 199.99,100"
        fill="none"
        stroke="url(#donutGradient)"
        strokeWidth="20"
        strokeLinecap="round"
        className="opacity-60"
      />
      <g className="animate-pulse opacity-40">
        {[10, 22, 4, 50, 9, 5].map((value, i) => (
          <g key={i} transform={`rotate(${i * 60} 200 200)`}>
            <line
              x1="200"
              y1="100"
              x2="200"
              y2="80"
              stroke="#00caeb"
              strokeWidth="2"
            />
            <text
              x="200"
              y="60"
              textAnchor="middle"
              fill="#00caeb"
              fontSize="12"
            >
              {value}%
            </text>
          </g>
        ))}
      </g>
    </g>
  </svg>
); 