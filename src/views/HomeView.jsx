import React from 'react'
import { Shield, Book, Video, AlertTriangle, Star, ArrowRight } from 'lucide-react'
import InfoCard from '../components/InfoCard'
import CallToActionButton from '../components/CallToActionButton'

const HomeView = ({ user, setUser, setCurrentView }) => {
  const quickActions = [
    {
      id: 'rights',
      icon: Book,
      title: 'Know Your Rights',
      description: `State-specific rights guide for ${user.state || 'your area'}`,
      color: 'bg-blue-600'
    },
    {
      id: 'record',
      icon: Video,
      title: 'Start Recording',
      description: 'One-tap incident documentation',
      color: 'bg-red-600'
    },
    {
      id: 'emergency',
      icon: AlertTriangle,
      title: 'Emergency Alert',
      description: 'Notify your emergency contacts',
      color: 'bg-orange-600'
    }
  ]

  const handleUpgradeToPremium = () => {
    setUser(prev => ({ ...prev, subscriptionStatus: 'premium' }))
    alert('Welcome to Guardian Guide Premium!')
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <InfoCard
        variant="stateGuide"
        title={`Welcome to Guardian Guide`}
        content={
          <div className="space-y-3">
            <p className="text-white/80">
              Your rights protection app for {user.state || 'your state'}. Access instant guidance, 
              record interactions, and stay protected.
            </p>
            {user.subscriptionStatus === 'free' && (
              <div className="flex items-center space-x-2 text-accent">
                <Star className="h-4 w-4" />
                <span className="text-sm">Upgrade to Premium for advanced features</span>
              </div>
            )}
          </div>
        }
        icon={Shield}
      />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon
          return (
            <InfoCard
              key={action.id}
              title={action.title}
              content={action.description}
              icon={Icon}
              onClick={() => setCurrentView(action.id)}
              className="hover:scale-105 transition-transform duration-200"
            />
          )
        })}
      </div>

      {/* Premium Upgrade */}
      {user.subscriptionStatus === 'free' && (
        <InfoCard
          variant="premium"
          title="Upgrade to Premium"
          content={
            <div className="space-y-4">
              <ul className="space-y-2 text-white/80">
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <span>Advanced state-specific guides</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <span>Unlimited recording storage</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <span>Offline access</span>
                </li>
                <li className="flex items-center space-x-2">
                  <ArrowRight className="h-4 w-4 text-accent" />
                  <span>Multi-language support</span>
                </li>
              </ul>
              <CallToActionButton
                variant="premium"
                onClick={handleUpgradeToPremium}
                className="w-full"
              >
                <Star className="h-5 w-5" />
                <span>Upgrade for $3/month</span>
              </CallToActionButton>
            </div>
          }
          icon={Star}
        />
      )}

      {/* Recent Activity */}
      <InfoCard
        title="Quick Tips"
        content={
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Always remain calm and respectful during interactions</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">You have the right to remain silent</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Recording is legal in public spaces in most states</p>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default HomeView