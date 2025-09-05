import React, { useState, useEffect } from 'react'
import NavigationHeader from './components/NavigationHeader'
import HomeView from './views/HomeView'
import RightsGuideView from './views/RightsGuideView'
import RecordingView from './views/RecordingView'
import EmergencyView from './views/EmergencyView'
import ProfileView from './views/ProfileView'
import { getUserLocation, detectState } from './utils/location'

function App() {
  const [currentView, setCurrentView] = useState('home')
  const [user, setUser] = useState({
    subscriptionStatus: 'free', // 'free', 'premium'
    preferredLanguage: 'en',
    emergencyContacts: [],
    state: null,
    location: null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Initialize app and detect user location
  useEffect(() => {
    const initializeApp = async () => {
      try {
        const location = await getUserLocation()
        const detectedState = await detectState(location)
        
        setUser(prev => ({
          ...prev,
          location,
          state: detectedState
        }))
      } catch (error) {
        console.error('Failed to get location:', error)
        // Set default state if location detection fails
        setUser(prev => ({ ...prev, state: 'CA' }))
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const renderCurrentView = () => {
    switch (currentView) {
      case 'rights':
        return <RightsGuideView user={user} setUser={setUser} />
      case 'record':
        return <RecordingView user={user} setUser={setUser} />
      case 'emergency':
        return <EmergencyView user={user} setUser={setUser} />
      case 'profile':
        return <ProfileView user={user} setUser={setUser} />
      default:
        return <HomeView user={user} setUser={setUser} setCurrentView={setCurrentView} />
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 flex items-center justify-center">
        <div className="text-white text-xl">Loading Guardian Guide...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700">
      <div className="container mx-auto max-w-4xl px-4 py-6">
        <NavigationHeader 
          currentView={currentView} 
          setCurrentView={setCurrentView}
          user={user}
        />
        
        <main className="mt-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  )
}

export default App