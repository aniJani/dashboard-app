
# Infolaya Visualization Studio

A modern data visualization platform that transforms complex data into compelling visual narratives. Built with Next.js, TypeScript, and Firebase.

![Infolaya Studio](public/preview.png)

## Features

### 🎨 Interactive Visualizations
- Time Series Analysis with interactive line charts
- Comparative Analysis using dynamic bar charts
- Part-to-Whole Analysis through pie charts
- Real-time data visualization generation

### 🤖 AI-Powered Insights
- Natural language data querying
- Automated business insights generation
- Pattern recognition and trend analysis
- Intelligent dataset recommendations

### 🔍 Dataset Management
- Comprehensive dataset search
- Real-time data processing
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
git clone https://github.com/yourusername/infolaya-visualization-studio.git
cd infolaya-visualization-studio
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

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- UI components from [shadcn/ui](https://ui.shadcn.com)
- Icons from [Lucide](https://lucide.dev)
- Authentication powered by [Firebase](https://firebase.google.com)

