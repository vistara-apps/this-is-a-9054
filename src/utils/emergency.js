// Emergency contact notification utilities

// Send emergency alert to contacts
export const sendEmergencyAlert = async (emergencyContacts, location, incidentDetails) => {
  const results = []
  
  for (const contact of emergencyContacts) {
    try {
      const result = await notifyContact(contact, location, incidentDetails)
      results.push({ contact, success: result.success, error: result.error })
    } catch (error) {
      results.push({ contact, success: false, error: error.message })
    }
  }
  
  return results
}

// Notify individual contact
const notifyContact = async (contact, location, incidentDetails) => {
  try {
    const message = createEmergencyMessage(contact, location, incidentDetails)
    
    switch (contact.method) {
      case 'sms':
        return await sendSMS(contact.phone, message)
      case 'email':
        return await sendEmail(contact.email, 'Guardian Guide Emergency Alert', message)
      case 'push':
        return await sendPushNotification(contact.deviceId, message)
      default:
        throw new Error(`Unsupported notification method: ${contact.method}`)
    }
  } catch (error) {
    console.error('Error notifying contact:', error)
    return { success: false, error: error.message }
  }
}

// Create emergency message
const createEmergencyMessage = (contact, location, incidentDetails) => {
  const timestamp = new Date().toLocaleString()
  const locationStr = location ? 
    `Location: https://maps.google.com/?q=${location.latitude},${location.longitude}` : 
    'Location: Unknown'
  
  const message = `
🚨 GUARDIAN GUIDE EMERGENCY ALERT 🚨

${contact.name}, this is an automated emergency alert from Guardian Guide.

Incident Type: ${incidentDetails.type || 'General'}
Time: ${timestamp}
${locationStr}

${incidentDetails.recordingUrl ? `Recording: ${incidentDetails.recordingUrl}` : ''}

This alert was triggered by ${incidentDetails.userName || 'a Guardian Guide user'}.

If this is a real emergency, please contact local authorities immediately.

- Guardian Guide Emergency System
  `.trim()
  
  return message
}

// SMS notification (would integrate with service like Twilio)
const sendSMS = async (phoneNumber, message) => {
  try {
    // In production, integrate with SMS service like Twilio
    const response = await fetch('/api/send-sms', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: phoneNumber,
        message: message
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send SMS')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending SMS:', error)
    return { success: false, error: error.message }
  }
}

// Email notification
const sendEmail = async (email, subject, message) => {
  try {
    // In production, integrate with email service like SendGrid or AWS SES
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: email,
        subject: subject,
        message: message
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send email')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: error.message }
  }
}

// Push notification
const sendPushNotification = async (deviceId, message) => {
  try {
    // In production, integrate with push notification service
    const response = await fetch('/api/send-push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        deviceId: deviceId,
        title: 'Guardian Guide Emergency Alert',
        body: message
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to send push notification')
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending push notification:', error)
    return { success: false, error: error.message }
  }
}

// Validate emergency contact
export const validateEmergencyContact = (contact) => {
  const errors = []
  
  if (!contact.name || contact.name.trim().length === 0) {
    errors.push('Name is required')
  }
  
  if (!contact.method) {
    errors.push('Notification method is required')
  }
  
  switch (contact.method) {
    case 'sms':
      if (!contact.phone || !isValidPhoneNumber(contact.phone)) {
        errors.push('Valid phone number is required for SMS')
      }
      break
    case 'email':
      if (!contact.email || !isValidEmail(contact.email)) {
        errors.push('Valid email address is required')
      }
      break
    case 'push':
      if (!contact.deviceId) {
        errors.push('Device ID is required for push notifications')
      }
      break
    default:
      errors.push('Invalid notification method')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

// Phone number validation
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

// Email validation
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Create shareable emergency card
export const createEmergencyCard = (incidentDetails, location) => {
  const timestamp = new Date().toLocaleString()
  const locationStr = location ? 
    `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 
    'Unknown'
  
  return {
    title: '🚨 Guardian Guide Emergency Alert',
    summary: `Emergency incident documented on ${timestamp}`,
    details: {
      type: incidentDetails.type || 'General Incident',
      time: timestamp,
      location: locationStr,
      recordingAvailable: !!incidentDetails.recordingUrl
    },
    shareText: `🚨 Emergency Alert - Guardian Guide incident documented at ${timestamp}. Location: ${locationStr}. ${incidentDetails.recordingUrl ? 'Recording available.' : ''}`,
    mapUrl: location ? `https://maps.google.com/?q=${location.latitude},${location.longitude}` : null
  }
}

// Share emergency card via Web Share API or fallback
export const shareEmergencyCard = async (card) => {
  try {
    if (navigator.share) {
      await navigator.share({
        title: card.title,
        text: card.shareText,
        url: card.mapUrl || window.location.href
      })
      return { success: true }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(card.shareText)
      return { success: true, method: 'clipboard' }
    }
  } catch (error) {
    console.error('Error sharing emergency card:', error)
    return { success: false, error: error.message }
  }
}

// Emergency contact templates
export const EMERGENCY_CONTACT_TEMPLATES = [
  {
    name: 'Family Member',
    method: 'sms',
    priority: 'high'
  },
  {
    name: 'Close Friend',
    method: 'sms',
    priority: 'medium'
  },
  {
    name: 'Legal Representative',
    method: 'email',
    priority: 'high'
  },
  {
    name: 'Emergency Contact',
    method: 'sms',
    priority: 'high'
  }
]

// Get emergency contact by ID
export const getEmergencyContactById = (contacts, id) => {
  return contacts.find(contact => contact.id === id)
}

// Sort contacts by priority
export const sortContactsByPriority = (contacts) => {
  const priorityOrder = { high: 0, medium: 1, low: 2 }
  return [...contacts].sort((a, b) => {
    return priorityOrder[a.priority] - priorityOrder[b.priority]
  })
}
