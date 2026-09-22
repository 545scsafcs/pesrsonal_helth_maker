# Vineets_Helth

Vineets_Helth is a personal AI health and fitness companion application exclusively built for Vineet. It serves as an intelligent fitness tracker, workout planner, nutrition guide, and personal coach (Nora) designed to help him achieve his goal of gaining healthy weight and building muscle.

## Features

- **Personalized Dashboard**: Track daily weight, water, nutrition, workout streak, and mess menu in a single place.
- **Workout Engine**: Full-body routines, customizable rest days, dynamic timers, and an immersive workout player.
- **Nora AI Companion**: A context-aware fitness assistant powered by Gemini 2.0 Flash to guide workouts and provide motivation.
- **Form Teacher**: Detailed exercise library with step-by-step instructions, SVG visualizations, and safety tips.
- **Progress Tracking**: Track weight trends, workout consistency, and nutrition habits.
- **Simple Nutrition**: Budget-aware milk tracker and daily checklist optimized for hostel mess food.
- **Spotify Integration**: Connect your Spotify Premium account to control your workout music.
- **Vercel Native**: Full-stack application utilizing React/Vite for the frontend and Vercel Serverless Functions for the backend API.

## Tech Stack

- **Frontend**: React (v19), Vite, Tailwind CSS (v4), React Router, Framer Motion, Chart.js
- **Backend**: Vercel Serverless Functions (Node.js/JavaScript)
- **Database**: MongoDB Atlas via Mongoose
- **AI Integration**: Google Gemini API
- **Music**: Spotify API

## Folder Structure

```
Vineets_Helth/
├── api/                  # Vercel Serverless API routes (auth, workouts, ai, etc.)
├── lib/                  # Backend utilities (db connection, auth helpers)
├── models/               # Mongoose database schemas
├── public/               # Static assets (including generated SVG exercises)
├── src/
│   ├── assets/           # Frontend assets
│   ├── components/       # Reusable React components (Navbar, Timer, WorkoutPlayer, etc.)
│   ├── data/             # Static application data (exercises, workout plans, mess menu)
│   ├── hooks/            # Custom React hooks (useAuth, useTheme)
│   ├── pages/            # Application views (Dashboard, Workout, Progress, etc.)
│   ├── services/         # API integration services
│   ├── App.jsx           # Main application routing
│   └── main.jsx          # React entry point
├── .env.example          # Template for environment variables
├── package.json          # Project dependencies
├── vercel.json           # Vercel deployment configuration
└── vite.config.js        # Vite build configuration
```

## Local Setup

### 1. Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas cluster (free tier works perfectly)
- Gemini API key
- Spotify Developer Account (optional, for music controls)

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure it based on `.env.example`:
```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster...
GEMINI_API_KEY=your_gemini_api_key
AUTH_SECRET=a_very_long_secure_random_string_for_jwt
DEFAULT_USER_PASSWORD=vineet123

# Spotify (Optional)
SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5173/api/spotify/callback
```

### 4. Running the Development Server
Start the frontend and backend locally:
```bash
npm run dev
```
The app will be available at `http://localhost:5173`.
*Note: Vite acts as a proxy to local Vercel serverless functions during development, routing `/api/*` calls appropriately.*

## Authentication

This application is built **exclusively for Vineet**.
There is no public registration. Upon the very first login attempt with the username `vineet` and the default password (set in `.env`), the system will automatically seed the database with his profile.
Subsequent logins will use secure JWT-based HTTP-only cookies.

## Deployment to Vercel

This project is configured out-of-the-box for Vercel.

1. Create a new project in Vercel and import this repository.
2. In the Vercel project settings, configure all Environment Variables specified in your `.env` file.
3. Ensure the Build Command is `npm run build` and the Output Directory is `dist`.
4. Update the `SPOTIFY_REDIRECT_URI` to point to your deployed production URL (e.g., `https://your-app.vercel.app/api/spotify/callback`).
5. Deploy! Vercel will automatically host the static frontend and serve the `api/` directory as serverless functions.

## Troubleshooting

- **MongoDB Connection Errors**: Ensure your current IP address is whitelisted in MongoDB Atlas Network Access settings.
- **Nora AI is not responding**: Verify your `GEMINI_API_KEY`. If the key is missing, the app degrades gracefully but Nora won't process intents.
- **Spotify OAuth returning 404**: Verify your `SPOTIFY_CLIENT_ID` and ensure the Redirect URI is registered in the Spotify Developer Dashboard.
