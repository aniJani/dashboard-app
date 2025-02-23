import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
  	extend: {
  		colors: {
  			background: "#000000",
  			foreground: "#ffffff",
  			card: {
  				DEFAULT: "hsl(var(--card))",
  				foreground: "hsl(var(--card-foreground))"
  			},
  			popover: {
  				DEFAULT: "hsl(var(--popover))",
  				foreground: "hsl(var(--popover-foreground))"
  			},
  			primary: {
  				DEFAULT: "#00caeb",
  				foreground: "#ffffff"
  			},
  			secondary: {
  				DEFAULT: "#df3f8b",
  				foreground: "#ffffff"
  			},
  			accent: {
  				DEFAULT: "#060885",
  				foreground: "#ffffff"
  			},
  			muted: {
  				DEFAULT: "rgba(255, 255, 255, 0.1)",
  				foreground: "rgba(255, 255, 255, 0.5)"
  			},
  			destructive: {
  				DEFAULT: "#df3f8b",
  				foreground: "#ffffff"
  			},
  			border: "rgba(255, 255, 255, 0.1)",
  			input: "rgba(255, 255, 255, 0.1)",
  			ring: "#00caeb",
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'tilt': {
  				'0%, 50%, 100%': {
  					transform: 'rotate(0deg)',
  				},
  				'25%': {
  					transform: 'rotate(0.5deg)',
  				},
  				'75%': {
  					transform: 'rotate(-0.5deg)',
  				},
  			},
  			'tilt-slow': {
  				'0%, 50%, 100%': {
  					transform: 'rotate(0deg) scale(1)',
  				},
  				'25%': {
  					transform: 'rotate(0.5deg) scale(1.05)',
  				},
  				'75%': {
  					transform: 'rotate(-0.5deg) scale(0.95)',
  				},
  			},
  			'floating': {
  				'0%, 100%': {
  					transform: 'translateY(0)',
  				},
  				'50%': {
  					transform: 'translateY(-10px)',
  				},
  			},
  			'spin-slow': {
  				'0%': { transform: 'rotate(0deg)' },
  				'100%': { transform: 'rotate(360deg)' }
  			},
  			'draw': {
  				'0%': {
  					strokeDashoffset: '1000',
  					opacity: '0',
  				},
  				'100%': {
  					strokeDashoffset: '0',
  					opacity: '1',
  				},
  			},
  			'ping': {
  				'75%, 100%': {
  					transform: 'scale(2)',
  					opacity: '0',
  				},
  			},
  			'glow': {
  				'0%, 100%': {
  					filter: 'brightness(1)',
  				},
  				'50%': {
  					filter: 'brightness(1.2)',
  				},
  			},
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'tilt': 'tilt 10s infinite linear',
  			'tilt-slow': 'tilt-slow 15s infinite linear',
  			'floating': 'floating 3s ease-in-out infinite',
  			'spin-slow': 'spin-slow 30s linear infinite',
  			'draw': 'draw 2s ease-out forwards',
  			'ping': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
  			'glow': 'glow 2s ease-in-out infinite',
  		},
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
  			'gradient-palm': "url('/palm-bg.jpg')"
  		},
  		fontFamily: {
  			'space-grotesk': ['Space Grotesk', 'sans-serif'],
  		},
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
