// Stripe payment integration utilities
import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || ''
let stripePromise = null

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey)
  }
  return stripePromise
}

// Create checkout session for premium subscription
export const createCheckoutSession = async (priceId, userId, successUrl, cancelUrl) => {
  try {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate the process
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        priceId,
        userId,
        successUrl,
        cancelUrl,
        mode: 'subscription'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const session = await response.json()
    return { success: true, sessionId: session.id }
    
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return { success: false, error: error.message }
  }
}

// Redirect to Stripe Checkout
export const redirectToCheckout = async (sessionId) => {
  try {
    const stripe = await getStripe()
    
    const { error } = await stripe.redirectToCheckout({
      sessionId: sessionId,
    })

    if (error) {
      throw error
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    return { success: false, error: error.message }
  }
}

// Handle premium upgrade
export const upgradeToPremium = async (userId) => {
  try {
    // Premium subscription price ID (would be configured in Stripe dashboard)
    const priceId = 'price_premium_monthly' // Replace with actual price ID
    
    const successUrl = `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${window.location.origin}/cancel`
    
    const sessionResult = await createCheckoutSession(priceId, userId, successUrl, cancelUrl)
    
    if (!sessionResult.success) {
      throw new Error(sessionResult.error)
    }
    
    const redirectResult = await redirectToCheckout(sessionResult.sessionId)
    
    if (!redirectResult.success) {
      throw new Error(redirectResult.error)
    }
    
    return { success: true }
    
  } catch (error) {
    console.error('Error upgrading to premium:', error)
    return { success: false, error: error.message }
  }
}

// Create customer portal session for subscription management
export const createCustomerPortalSession = async (customerId, returnUrl) => {
  try {
    const response = await fetch('/api/create-portal-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        customerId,
        returnUrl,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const session = await response.json()
    return { success: true, url: session.url }
    
  } catch (error) {
    console.error('Error creating portal session:', error)
    return { success: false, error: error.message }
  }
}

// Verify subscription status
export const verifySubscription = async (customerId) => {
  try {
    const response = await fetch(`/api/verify-subscription/${customerId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to verify subscription')
    }

    const subscription = await response.json()
    return { 
      success: true, 
      isActive: subscription.status === 'active',
      subscription 
    }
    
  } catch (error) {
    console.error('Error verifying subscription:', error)
    return { success: false, error: error.message }
  }
}

// Cancel subscription
export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch('/api/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to cancel subscription')
    }

    const result = await response.json()
    return { success: true, data: result }
    
  } catch (error) {
    console.error('Error canceling subscription:', error)
    return { success: false, error: error.message }
  }
}

// Pricing configuration
export const PRICING_PLANS = {
  free: {
    name: 'Free',
    price: 0,
    features: [
      'Basic rights guides',
      'Limited recording (3 recordings)',
      'Basic emergency contacts',
      'Core legal scripts'
    ],
    limitations: {
      maxRecordings: 3,
      offlineAccess: false,
      advancedGuides: false,
      multiLanguage: false
    }
  },
  premium: {
    name: 'Premium',
    price: 3,
    priceId: 'price_premium_monthly', // Replace with actual Stripe price ID
    features: [
      'Advanced state-specific guides',
      'Unlimited recording storage',
      'Offline access',
      'Multi-language support',
      'Priority support',
      'Advanced emergency features'
    ],
    limitations: {
      maxRecordings: Infinity,
      offlineAccess: true,
      advancedGuides: true,
      multiLanguage: true
    }
  }
}

// Helper to check if feature is available for user
export const hasFeatureAccess = (userSubscription, feature) => {
  const plan = PRICING_PLANS[userSubscription] || PRICING_PLANS.free
  
  switch (feature) {
    case 'unlimited_recordings':
      return plan.limitations.maxRecordings === Infinity
    case 'offline_access':
      return plan.limitations.offlineAccess
    case 'advanced_guides':
      return plan.limitations.advancedGuides
    case 'multi_language':
      return plan.limitations.multiLanguage
    default:
      return true // Basic features available to all
  }
}
