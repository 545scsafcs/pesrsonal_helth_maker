import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// Lazy-loaded pages
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Workout = lazy(() => import('./pages/Workout'));
const Time = lazy(() => import('./pages/Time'));
const Exercises = lazy(() => import('./pages/Exercises'));
const ExerciseDetails = lazy(() => import('./pages/ExerciseDetails'));
const Progress = lazy(() => import('./pages/Progress'));
const Attendance = lazy(() => import('./pages/Attendance'));
const Nutrition = lazy(() => import('./pages/Nutrition'));
const MessMenu = lazy(() => import('./pages/MessMenu'));
const Weight = lazy(() => import('./pages/Weight'));
const Water = lazy(() => import('./pages/Water'));
const Music = lazy(() => import('./pages/Music'));
const NoraChatPage = lazy(() => import('./pages/NoraChatPage'));
const Settings = lazy(() => import('./pages/Settings'));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-surface-400 text-sm">Loading...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Suspense fallback={<PageLoader />}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/workout" element={<Workout />} />
                    <Route path="/time" element={<Time />} />
                    <Route path="/exercises" element={<Exercises />} />
                    <Route path="/exercises/:id" element={<ExerciseDetails />} />
                    <Route path="/progress" element={<Progress />} />
                    <Route path="/attendance" element={<Attendance />} />
                    <Route path="/nutrition" element={<Nutrition />} />
                    <Route path="/mess-menu" element={<MessMenu />} />
                    <Route path="/weight" element={<Weight />} />
                    <Route path="/water" element={<Water />} />
                    <Route path="/music" element={<Music />} />
                    <Route path="/nora" element={<NoraChatPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </Suspense>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}

