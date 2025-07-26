import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import Homepage from './components/Homepage'
import ComprehensiveDashboard from './components/ComprehensiveDashboard'
import AnalyticsPage from './components/AnalyticsPage'
import QRCodes from './components/QRCodes'
import Directory from './components/Directory'
import ComprehensiveProfileSettings from './components/ComprehensiveProfileSettings'
import PublicProfile from './components/PublicProfile'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import Header from './components/Header'
import Footer from './components/Footer'
import './App.css'

function App() {
  const { loading, isSignedIn } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const isAuthPage = location.pathname.startsWith('/sign-in') || location.pathname.startsWith('/sign-up')

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header - Show on all pages except auth pages */}
      {!isAuthPage && <Header />}
      
      {/* Main Content */}
      <main className={!isAuthPage ? "pt-0" : ""}>
        <Routes>
          <Route 
            path="/" 
            element={isSignedIn ? <Navigate to="/dashboard" replace /> : <Homepage />} 
          />
          <Route 
            path="/sign-in/*" 
            element={!isSignedIn ? <SignIn /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/sign-up/*" 
            element={!isSignedIn ? <SignUp /> : <Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="/dashboard" 
            element={isSignedIn ? <ComprehensiveDashboard /> : <Navigate to="/sign-in" replace />} 
          />
          <Route 
            path="/analytics" 
            element={isSignedIn ? <AnalyticsPage /> : <Navigate to="/sign-in" replace />} 
          />
          <Route 
            path="/qr-codes" 
            element={isSignedIn ? <QRCodes /> : <Navigate to="/sign-in" replace />} 
          />
          <Route 
            path="/settings" 
            element={isSignedIn ? <ComprehensiveProfileSettings /> : <Navigate to="/sign-in" replace />} 
          />
          <Route 
            path="/directory" 
            element={<Directory />} 
          />
          <Route 
            path="/:username" 
            element={<PublicProfile />} 
          />
        </Routes>
      </main>

      {/* Footer - Show on all pages except auth pages */}
      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
