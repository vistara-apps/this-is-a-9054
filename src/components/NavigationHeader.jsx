import React from 'react'
import { Shield, Home, Book, Video, AlertTriangle, User } from 'lucide-react'

const NavigationHeader = ({ currentView, setCurrentView, user }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'rights', icon: Book, label: 'Rights' },
    { id: 'record', icon: Video, label: 'Record' },
    { id: 'emergency', icon: AlertTriangle, label: 'Emergency' },
    { id: 'profile', icon: User, label: 'Profile' },
  ]

  return (
    <header className="bg-surface/10 backdrop-blur-md rounded-lg p-4 shadow-card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Shield className="h-8 w-8 text-accent" />
          <div>
            <h1 className="text-white text-xl font-bold">Guardian Guide</h1>
            <p className="text-white/70 text-sm">Your Rights, Your Voice</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-white/70 text-sm">{user.state || 'Unknown'}</span>
          {user.subscriptionStatus === 'premium' && (
            <span className="bg-accent text-black px-2 py-1 rounded text-xs font-semibold">
              Premium
            </span>
          )}
        </div>
      </div>
      
      <nav className="flex justify-between">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentView === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-md transition-colors duration-200 ${
                isActive 
                  ? 'bg-accent text-black' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </header>
  )
}

export default NavigationHeader