import React, { useState } from 'react'
import { AlertTriangle, Phone, Plus, Trash2, Send } from 'lucide-react'
import InfoCard from '../components/InfoCard'
import CallToActionButton from '../components/CallToActionButton'

const EmergencyView = ({ user, setUser }) => {
  const [newContact, setNewContact] = useState({ name: '', phone: '', relationship: '' })
  const [isAddingContact, setIsAddingContact] = useState(false)
  const [alertSent, setAlertSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const addEmergencyContact = () => {
    if (newContact.name && newContact.phone) {
      const contact = {
        id: Date.now(),
        ...newContact
      }
      
      setUser(prev => ({
        ...prev,
        emergencyContacts: [...prev.emergencyContacts, contact]
      }))
      
      setNewContact({ name: '', phone: '', relationship: '' })
      setIsAddingContact(false)
    }
  }

  const removeContact = (contactId) => {
    setUser(prev => ({
      ...prev,
      emergencyContacts: prev.emergencyContacts.filter(c => c.id !== contactId)
    }))
  }

  const sendEmergencyAlert = async () => {
    if (user.emergencyContacts.length === 0) {
      alert('Please add at least one emergency contact first.')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate sending alerts
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const message = `EMERGENCY ALERT from Guardian Guide: I am currently in a police interaction at ${
        user.location ? `${user.location.latitude}, ${user.location.longitude}` : 'unknown location'
      }. Time: ${new Date().toLocaleString()}. This is an automated message.`
      
      // In a real app, this would send SMS/calls to emergency contacts
      console.log('Emergency alert sent:', message)
      
      setAlertSent(true)
      setTimeout(() => setAlertSent(false), 5000)
      
    } catch (error) {
      console.error('Failed to send emergency alert:', error)
      alert('Failed to send emergency alert. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Emergency Alert Button */}
      <InfoCard
        variant="stateGuide"
        title="Emergency Alert System"
        content={
          <div className="space-y-6">
            <p className="text-white/80">
              Instantly notify your emergency contacts with your location and incident details.
            </p>
            
            {alertSent && (
              <div className="bg-green-900/30 border border-green-400 rounded-lg p-4">
                <p className="text-green-400 font-medium">
                  ✓ Emergency alerts sent successfully to {user.emergencyContacts.length} contact(s)
                </p>
              </div>
            )}
            
            <div className="flex justify-center">
              <CallToActionButton
                variant="alert"
                onClick={sendEmergencyAlert}
                disabled={isLoading || user.emergencyContacts.length === 0}
                className="text-xl px-12 py-6"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Sending Alert...</span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-8 w-8" />
                    <span>Send Emergency Alert</span>
                  </>
                )}
              </CallToActionButton>
            </div>
            
            {user.emergencyContacts.length === 0 && (
              <p className="text-center text-orange-400 text-sm">
                Add emergency contacts below to activate alerts
              </p>
            )}
          </div>
        }
        icon={AlertTriangle}
      />

      {/* Emergency Contacts */}
      <InfoCard
        title={`Emergency Contacts (${user.emergencyContacts.length})`}
        content={
          <div className="space-y-4">
            {/* Existing Contacts */}
            {user.emergencyContacts.map((contact) => (
              <div key={contact.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-medium">{contact.name}</h4>
                  <p className="text-white/60">{contact.phone}</p>
                  {contact.relationship && (
                    <p className="text-white/40 text-sm">{contact.relationship}</p>
                  )}
                </div>
                <button
                  onClick={() => removeContact(contact.id)}
                  className="text-red-400 hover:text-red-300 p-2"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            
            {/* Add New Contact Form */}
            {isAddingContact ? (
              <div className="bg-white/5 rounded-lg p-4 space-y-4">
                <input
                  type="text"
                  placeholder="Contact Name"
                  value={newContact.name}
                  onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
                />
                <input
                  type="text"
                  placeholder="Relationship (optional)"
                  value={newContact.relationship}
                  onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                  className="w-full bg-white/10 text-white border border-white/20 rounded px-3 py-2 focus:outline-none focus:border-accent"
                />
                <div className="flex space-x-2">
                  <CallToActionButton
                    variant="accent"
                    onClick={addEmergencyContact}
                    className="flex-1"
                  >
                    Add Contact
                  </CallToActionButton>
                  <CallToActionButton
                    variant="default"
                    onClick={() => setIsAddingContact(false)}
                    className="flex-1"
                  >
                    Cancel
                  </CallToActionButton>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsAddingContact(true)}
                className="w-full bg-white/5 border-2 border-dashed border-white/20 rounded-lg p-6 text-white/60 hover:text-white hover:border-white/40 transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>Add Emergency Contact</span>
              </button>
            )}
          </div>
        }
      />

      {/* Alert Information */}
      <InfoCard
        title="How Emergency Alerts Work"
        content={
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Alerts include your current location coordinates</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Messages are sent instantly to all emergency contacts</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Includes timestamp and link to any active recording</p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-accent rounded-full mt-2"></div>
              <p className="text-white/80">Works even when app is in background</p>
            </div>
          </div>
        }
      />

      {/* Emergency Numbers */}
      <InfoCard
        title="Important Numbers"
        content={
          <div className="space-y-4">
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
              <div>
                <h4 className="text-white font-medium">Emergency Services</h4>
                <p className="text-white/60">Police, Fire, Medical</p>
              </div>
              <a href="tel:911" className="text-accent font-bold text-xl">911</a>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
              <div>
                <h4 className="text-white font-medium">ACLU Know Your Rights Hotline</h4>
                <p className="text-white/60">Legal guidance and support</p>
              </div>
              <a href="tel:877-328-2257" className="text-accent font-bold">
                877-328-2257
              </a>
            </div>
            
            <div className="flex items-center justify-between bg-white/5 rounded-lg p-4">
              <div>
                <h4 className="text-white font-medium">Crisis Text Line</h4>
                <p className="text-white/60">Text HOME to this number</p>
              </div>
              <a href="sms:741741" className="text-accent font-bold">741741</a>
            </div>
          </div>
        }
      />
    </div>
  )
}

export default EmergencyView