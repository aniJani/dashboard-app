
# Infolaya Visualization Studio

A modern data Data Processing and Visualization platform that transforms complex data into compelling visual narratives. Built with Next.js, TypeScript, and Firebase.


## Features

### 🎨 Interactive Visualizations
- Time Series Analysis with interactive charts from Matplotlib
- Real-time data visualization generation based on user's dataset

### 🤖 AI-Powered Insights
- Natural language data querying
- Automated business insights generation
- Pattern recognition and trend analysis
- Intelligent dataset recommendations

### 🔍 Dataset Management
- Comprehensive dataset search
- Real-time data processing and visualization
- Multiple data source integration
- Secure data handling

## Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui
- **Authentication**: Firebase Auth
- **Animation**: Framer Motion
- **Data Visualization**: Custom charting components
- **State Management**: React Hooks

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. Clone the repository
```bash
git clone https://github.com/aniJani/dashboard-app.git
cd dashboard-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Add your Firebase configuration to `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

5. Start the development server
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
infolaya-visualization-studio/
├── app/
│   ├── page.tsx                # Main dashboard
│   ├── visualization/          # Visualization routes
│   └── insights/              # Insights routes
├── components/
│   ├── ui/                    # Reusable UI components
│   ├── chat-interface.tsx     # Chat interface component
│   └── visualization-display.tsx # Visualization display
├── lib/
│   ├── api.ts                 # API functions
│   └── firebase.ts            # Firebase configuration
└── public/
    └── icons/                 # Icon assets
```

