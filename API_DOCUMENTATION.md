# Guardian Guide API Documentation

This document provides comprehensive API documentation for the Guardian Guide application, including all backend integrations and data models.

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [Data Models](#data-models)
4. [Supabase APIs](#supabase-apis)
5. [OpenAI Integration](#openai-integration)
6. [Stripe Integration](#stripe-integration)
7. [Emergency Services](#emergency-services)
8. [Error Handling](#error-handling)

## Overview

Guardian Guide uses a modern tech stack with the following APIs:

- **Supabase**: Backend-as-a-Service (Database, Auth, Storage)
- **OpenAI**: AI content generation for legal guides and scripts
- **Stripe**: Payment processing for premium subscriptions
- **Web APIs**: Geolocation, MediaRecorder, Web Share

## Authentication

### Supabase Authentication

Guardian Guide uses Supabase Auth for user management.

#### Sign Up
```javascript
import { signUp } from './utils/supabase'

const result = await signUp(email, password)
if (result.success) {
  console.log('User created:', result.data.user)
}
```

#### Sign In
```javascript
import { signIn } from './utils/supabase'

const result = await signIn(email, password)
if (result.success) {
  console.log('User signed in:', result.data.user)
}
```

#### Get Current User
```javascript
import { getCurrentUser } from './utils/supabase'

const result = await getCurrentUser()
if (result.success) {
  console.log('Current user:', result.data)
}
```

## Data Models

### User Model
```typescript
interface User {
  user_id: string (UUID)
  email: string
  subscription_status: 'free' | 'premium'
  preferred_language: 'en' | 'es'
  emergency_contacts: EmergencyContact[]
  state: string (2-letter state code)
  stripe_customer_id?: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Incident Model
```typescript
interface Incident {
  incident_id: string (UUID)
  user_id: string (UUID, foreign key)
  timestamp: timestamp
  location?: {
    latitude: number
    longitude: number
    accuracy: number
  }
  recording_url?: string
  notes: string
  contacts_notified: string[]
  incident_type: string
  created_at: timestamp
  updated_at: timestamp
}
```

### Legal Guide Model
```typescript
interface LegalGuide {
  guide_id: string (UUID)
  state: string (2-letter code)
  content: {
    coreRights: Array<{
      title: string
      description: string
    }>
    scenarios: Array<{
      title: string
      description: string
      actions: string[]
    }>
    recordingLaws: string
    stateSpecificNotes: string
  }
  language: 'en' | 'es'
  created_at: timestamp
  updated_at: timestamp
}
```

### Emergency Contact Model
```typescript
interface EmergencyContact {
  id: string
  name: string
  phone?: string
  email?: string
  method: 'sms' | 'email' | 'push'
  relationship: string
  priority: 'high' | 'medium' | 'low'
}
```

## Supabase APIs

### User Management

#### Create User
```javascript
import { createUser } from './utils/supabase'

const userData = {
  email: 'user@example.com',
  subscriptionStatus: 'free',
  preferredLanguage: 'en',
  emergencyContacts: [],
  state: 'CA'
}

const result = await createUser(userData)
```

#### Update User
```javascript
import { updateUser } from './utils/supabase'

const updates = {
  preferred_language: 'es',
  state: 'NY'
}

const result = await updateUser(userId, updates)
```

#### Get User
```javascript
import { getUser } from './utils/supabase'

const result = await getUser(userId)
if (result.success) {
  console.log('User data:', result.data)
}
```

### Incident Management

#### Create Incident
```javascript
import { createIncident } from './utils/supabase'

const incidentData = {
  userId: 'user-uuid',
  timestamp: new Date().toISOString(),
  location: { latitude: 37.7749, longitude: -122.4194, accuracy: 10 },
  recordingUrl: 'https://storage.url/recording.webm',
  notes: 'Traffic stop incident',
  contactsNotified: ['contact1', 'contact2'],
  incidentType: 'traffic_stop'
}

const result = await createIncident(incidentData)
```

#### Get User Incidents
```javascript
import { getUserIncidents } from './utils/supabase'

const result = await getUserIncidents(userId)
if (result.success) {
  console.log('User incidents:', result.data)
}
```

### Legal Guides

#### Get Legal Guide
```javascript
import { getLegalGuide } from './utils/supabase'

const result = await getLegalGuide('CA', 'en')
if (result.success) {
  console.log('Legal guide:', result.data.content)
}
```

### File Storage

#### Upload Recording
```javascript
import { uploadRecording } from './utils/supabase'

const file = new Blob([recordingData], { type: 'video/webm' })
const fileName = `user-id/recording-${Date.now()}.webm`

const result = await uploadRecording(file, fileName)
if (result.success) {
  console.log('Recording URL:', result.data.publicUrl)
}
```

## OpenAI Integration

### Generate State-Specific Guide
```javascript
import { generateStateSpecificGuide } from './utils/contentGeneration'

const guide = await generateStateSpecificGuide('CA', 'en')
console.log('Generated guide:', guide)
```

### Generate Multilingual Scripts
```javascript
import { generateMultilingualScript } from './utils/contentGeneration'

const scripts = await generateMultilingualScript('es', 'traffic_stop')
console.log('Generated scripts:', scripts)
```

### Generate Shareable Card
```javascript
import { generateShareableCard } from './utils/contentGeneration'

const card = await generateShareableCard('traffic_stop', location, 'CA')
console.log('Shareable card:', card)
```

## Stripe Integration

### Pricing Plans
```javascript
import { PRICING_PLANS } from './utils/stripe'

console.log('Available plans:', PRICING_PLANS)
// {
//   free: { name: 'Free', price: 0, features: [...] },
//   premium: { name: 'Premium', price: 3, features: [...] }
// }
```

### Upgrade to Premium
```javascript
import { upgradeToPremium } from './utils/stripe'

const result = await upgradeToPremium(userId)
if (result.success) {
  // User will be redirected to Stripe Checkout
}
```

### Check Feature Access
```javascript
import { hasFeatureAccess } from './utils/stripe'

const canRecord = hasFeatureAccess(user.subscriptionStatus, 'unlimited_recordings')
const hasOffline = hasFeatureAccess(user.subscriptionStatus, 'offline_access')
```

### Verify Subscription
```javascript
import { verifySubscription } from './utils/stripe'

const result = await verifySubscription(customerId)
if (result.success) {
  console.log('Subscription active:', result.isActive)
}
```

## Emergency Services

### Send Emergency Alert
```javascript
import { sendEmergencyAlert } from './utils/emergency'

const contacts = [
  { name: 'John Doe', phone: '+1234567890', method: 'sms' },
  { name: 'Jane Smith', email: 'jane@example.com', method: 'email' }
]

const location = { latitude: 37.7749, longitude: -122.4194 }
const incidentDetails = {
  type: 'Traffic Stop',
  userName: 'User Name',
  recordingUrl: 'https://example.com/recording.webm'
}

const results = await sendEmergencyAlert(contacts, location, incidentDetails)
console.log('Alert results:', results)
```

### Validate Emergency Contact
```javascript
import { validateEmergencyContact } from './utils/emergency'

const contact = {
  name: 'John Doe',
  phone: '+1234567890',
  method: 'sms'
}

const validation = validateEmergencyContact(contact)
if (!validation.isValid) {
  console.log('Validation errors:', validation.errors)
}
```

### Create Emergency Card
```javascript
import { createEmergencyCard } from './utils/emergency'

const incidentDetails = {
  type: 'Traffic Stop',
  recordingUrl: 'https://example.com/recording.webm'
}

const card = createEmergencyCard(incidentDetails, location)
console.log('Emergency card:', card)
```

### Share Emergency Card
```javascript
import { shareEmergencyCard } from './utils/emergency'

const result = await shareEmergencyCard(card)
if (result.success) {
  console.log('Card shared successfully')
}
```

## Error Handling

All API functions return a consistent response format:

```typescript
interface APIResponse<T> {
  success: boolean
  data?: T
  error?: string
}
```

### Example Error Handling
```javascript
const result = await createIncident(incidentData)

if (result.success) {
  console.log('Incident created:', result.data)
} else {
  console.error('Error creating incident:', result.error)
  // Handle error appropriately
}
```

### Common Error Types

1. **Authentication Errors**: User not authenticated or session expired
2. **Validation Errors**: Invalid input data
3. **Permission Errors**: User doesn't have access to resource
4. **Network Errors**: API service unavailable
5. **Rate Limit Errors**: Too many requests

### Error Codes

- `AUTH_ERROR`: Authentication required
- `VALIDATION_ERROR`: Invalid input data
- `PERMISSION_DENIED`: Insufficient permissions
- `NOT_FOUND`: Resource not found
- `RATE_LIMITED`: Too many requests
- `SERVER_ERROR`: Internal server error

## Rate Limits

### OpenAI API
- **Free Tier**: 3 requests per minute
- **Premium**: 60 requests per minute

### Supabase
- **Free Tier**: 500MB database, 1GB bandwidth
- **Pro**: Unlimited database, 8GB bandwidth

### Stripe
- **Test Mode**: No limits
- **Live Mode**: 100 requests per second

## Environment Variables

Required environment variables for full functionality:

```env
# OpenAI
VITE_OPENAI_API_KEY=sk-...

# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Optional
VITE_GOOGLE_MAPS_API_KEY=AIza...
VITE_TWILIO_ACCOUNT_SID=AC...
```

## Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### API Testing
Use the provided test utilities:

```javascript
import { testSupabaseConnection } from './utils/test-helpers'

const isConnected = await testSupabaseConnection()
console.log('Supabase connected:', isConnected)
```

## Security Considerations

1. **API Keys**: Never expose API keys in client-side code in production
2. **Row Level Security**: Enabled on all Supabase tables
3. **Input Validation**: All user inputs are validated
4. **HTTPS Only**: All API calls use HTTPS
5. **Rate Limiting**: Implemented to prevent abuse

## Support

For API support and questions:

- **Documentation**: This file and inline code comments
- **Issues**: GitHub Issues for bug reports
- **Discussions**: GitHub Discussions for questions

---

**Last Updated**: 2024-01-XX
**Version**: 1.0.0
