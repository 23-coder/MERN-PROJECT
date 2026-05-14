import React, { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

const Home = lazy(() => import('./pages/Home'))
const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Upload = lazy(() => import('./pages/Upload'))
const VideoDetail = lazy(() => import('./pages/VideoDetail'))
const Profile = lazy(() => import('./pages/Profile'))
const Channel = lazy(() => import('./pages/Channel'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Playlists = lazy(() => import('./pages/Playlists'))
const LikedVideos = lazy(() => import('./pages/LikedVideos'))

const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingSpinner fullPage />
  if (!user) return <Navigate to="/login" replace />
  return children
}

// Redirects already-logged-in users away from /login and /register
const PublicOnlyRoute = ({ children }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingSpinner fullPage />
  if (user) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className="app">
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      <div className="app-container">
        {user && <Sidebar isOpen={sidebarOpen} />}
        <main className={`main-content ${!user ? 'full-width' : ''}`}>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
              <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
              <Route path="/video/:videoId" element={<VideoDetail />} />
              <Route path="/channel/:username" element={<Channel />} />
              <Route path="/upload" element={<ProtectedRoute><Upload /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/playlists" element={<ProtectedRoute><Playlists /></ProtectedRoute>} />
              <Route path="/liked-videos" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  )
}

export default App
