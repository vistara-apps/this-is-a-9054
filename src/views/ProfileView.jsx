import React, { useState } from 'react'
import { User, Settings, Crown, Globe, MapPin, Shield, CreditCard, AlertCircle } from 'lucide-react'
import InfoCard from '../components/InfoCard'
import CallToActionButton from '../components/CallToActionButton'
import { upgradeToPremium, PRICING_PLANS, hasFeatureAccess } from '../utils/stripe'
import { updateUser } from '../utils/supabase'

const ProfileView = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    preferredLanguage: user.preferredLanguage,
    state: user.state
  })

  const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
  ]

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' }
  ]

  const saveProfile = async () => {
    try {
      // Update user in database if user has an ID
      if (user.userId) {
        const result = await updateUser(user.userId, editForm)
        if (!result.success) {
          console.error('Failed to update user:', result.error)
          alert('Failed to save profile changes')
          return
        }
      }
      
      setUser(prev => ({
        ...prev,
        ...editForm
      }))
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving profile:', error)
      alert('Failed to save profile changes')
    }
  }

  const handleUpgradeToPremium = async () => {
    try {
      const result = await upgradeToPremium(user.userId || 'demo-user')
      if (!result.success) {
        alert('Failed to upgrade to premium. Please try again.')
      }
    } catch (error) {
      console.error('Error upgrading to premium:', error)
      alert('Failed to upgrade to premium. Please try again.')
    }
  }

  const toggleSubscription = () => {
    // For demo purposes - in production this would be handled by Stripe webhooks
    setUser(prev => ({
      ...prev,
      subscriptionStatus: prev.subscriptionStatus === 'premium' ? 'free' : 'premium'
    }))
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <InfoCard
        variant="stateGuide"
        title="Your Profile"
        content={
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-black" />
              </div>
              <div>
                <h3 className="text-white text-xl font-semibold">Guardian User</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.subscriptionStatus === 'premium' 
                      ? 'bg-accent text-black' 
                      : 'bg-white/20 text-white'
                  }`}>
                    {user.subscriptionStatus === 'premium' ? 'Premium' : 'Free'} Account
                  </span>
                  {user.subscriptionStatus === 'premium' && (
                    <Crown className="h-4 w-4 text-accent" />
                  )}
                </div>
              </div>
            </div>
          </div>
        }
        icon={User}
      />

      {/* Account Settings */}
      <InfoCard
        title="Account Settings"
        content={
          <div className="space-y-4">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm mb-2">State</label>
                  <select
                    value={editForm.state}
                    onChange={(e) => setEditForm(prev => ({ ...prev, state: e.target.value }))}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
                  >
                    {states.map(state => (
                      <option key={state} value={state} className="bg-purple-800">
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 text-sm mb-2">Preferred Language</label>
                  <select
                    value={editForm.preferredLanguage}
                    onChange={(e) => setEditForm(prev => ({ ...prev, preferredLanguage: e.target.value }))}
                    className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code} className="bg-purple-800">
                        {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-2">
                  <CallToActionButton
                    variant="accent"
                    onClick={saveProfile}
                    className="flex-1"
                  >
                    Save Changes
                  </CallToActionButton>
                  <CallToActionButton
                    variant="default"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </CallToActionButton>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="text-white">State: {user.state || 'Not set'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Globe className="h-5 w-5 text-accent" />
                    <span className="text-white">
                      Language: {languages.find(l => l.code === user.preferredLanguage)?.name || 'English'}
                    </span>
                  </div>
                </div>
                
                <CallToActionButton
                  variant="default"
                  onClick={() => setIsEditing(true)}
                  className="w-full"
                >
                  <Settings className="h-5 w-5" />
                  <span>Edit Settings</span>
                </CallToActionButton>
              </div>
            )}
          </div>
        }
      />

      {/* Subscription Management */}
      <InfoCard
        variant={user.subscriptionStatus === 'premium' ? 'premium' : 'default'}
        title="Subscription"
        content={
          <div className="space-y-4">
            {user.subscriptionStatus === 'premium' ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-accent" />
                  <span className="text-white font-semibold">Premium Account Active</span>
                </div>
                <ul className="space-y-2 text-white/80">
                  <li>✓ Advanced state-specific guides</li>
                  <li>✓ Unlimited recording storage</li>
                  <li>✓ Offline access</li>
                  <li>✓ Multi-language support</li>
                  <li>✓ Priority customer support</li>
                </ul>
                <CallToActionButton
                  variant="default"
                  onClick={toggleSubscription}
                  className="w-full"
                >
                  Cancel Subscription
                </CallToActionButton>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/80">
                  Upgrade to Premium for unlimited features and advanced protection tools.
                </p>
                <ul className="space-y-2 text-white/60">
                  <li>• Advanced state-specific guides</li>
                  <li>• Unlimited recording storage</li>
                  <li>• Offline access</li>
                  <li>• Multi-language support</li>
                </ul>
                <CallToActionButton
                  variant="premium"
                  onClick={handleUpgradeToPremium}
                  className="w-full"
                >
                  <CreditCard className="h-5 w-5" />
                  <span>Upgrade to Premium - ${PRICING_PLANS.premium.price}/month</span>
                </CallToActionButton>
              </div>
            )}
          </div>
        }
      />

      {/* App Statistics */}
      <InfoCard
        title="Your Activity"
        content={
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent">0</div>
              <div className="text-white/60 text-sm">Recordings</div>
            </div>
            <div className="text-center bg-white/5 rounded-lg p-4">
              <div className="text-2xl font-bold text-accent">{user.emergencyContacts.length}</div>
              <div className="text-white/60 text-sm">Emergency Contacts</div>
            </div>
          </div>
        }
      />

      {/* Legal Notice */}
      <InfoCard
        title="Legal Notice"
        content={
          <div className="space-y-3 text-white/70 text-sm">
            <p>
              Guardian Guide provides general information and should not be considered legal advice. 
              Laws vary by jurisdiction and situation.
            </p>
            <p>
              Always comply with local laws and regulations. When in doubt, consult with a qualified attorney.
            </p>
            <div className="flex items-center space-x-2 text-accent">
              <Shield className="h-4 w-4" />
              <span>Your privacy and safety are our priority</span>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default ProfileView
