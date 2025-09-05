// Supabase configuration and utilities
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// User management
export const createUser = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([{
        email: userData.email,
        subscription_status: userData.subscriptionStatus || 'free',
        preferred_language: userData.preferredLanguage || 'en',
        emergency_contacts: userData.emergencyContacts || [],
        state: userData.state,
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating user:', error)
    return { success: false, error: error.message }
  }
}

export const updateUser = async (userId, updates) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating user:', error)
    return { success: false, error: error.message }
  }
}

export const getUser = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching user:', error)
    return { success: false, error: error.message }
  }
}

// Incident management
export const createIncident = async (incidentData) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .insert([{
        user_id: incidentData.userId,
        timestamp: incidentData.timestamp,
        location: incidentData.location,
        recording_url: incidentData.recordingUrl,
        notes: incidentData.notes || '',
        contacts_notified: incidentData.contactsNotified || [],
        incident_type: incidentData.incidentType || 'general',
        created_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating incident:', error)
    return { success: false, error: error.message }
  }
}

export const getUserIncidents = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return { success: false, error: error.message }
  }
}

export const updateIncident = async (incidentId, updates) => {
  try {
    const { data, error } = await supabase
      .from('incidents')
      .update(updates)
      .eq('incident_id', incidentId)
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error updating incident:', error)
    return { success: false, error: error.message }
  }
}

// Legal guides management
export const getLegalGuide = async (state, language = 'en') => {
  try {
    const { data, error } = await supabase
      .from('legal_guides')
      .select('*')
      .eq('state', state)
      .eq('language', language)
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error fetching legal guide:', error)
    return { success: false, error: error.message }
  }
}

export const createLegalGuide = async (guideData) => {
  try {
    const { data, error } = await supabase
      .from('legal_guides')
      .insert([{
        state: guideData.state,
        content: guideData.content,
        language: guideData.language,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])
      .select()
      .single()

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error creating legal guide:', error)
    return { success: false, error: error.message }
  }
}

// File storage for recordings
export const uploadRecording = async (file, fileName) => {
  try {
    const { data, error } = await supabase.storage
      .from('recordings')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error
    
    // Get public URL
    const { data: urlData } = supabase.storage
      .from('recordings')
      .getPublicUrl(fileName)

    return { success: true, data: { ...data, publicUrl: urlData.publicUrl } }
  } catch (error) {
    console.error('Error uploading recording:', error)
    return { success: false, error: error.message }
  }
}

export const deleteRecording = async (fileName) => {
  try {
    const { error } = await supabase.storage
      .from('recordings')
      .remove([fileName])

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error deleting recording:', error)
    return { success: false, error: error.message }
  }
}

// Authentication helpers
export const signUp = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error signing up:', error)
    return { success: false, error: error.message }
  }
}

export const signIn = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Error signing in:', error)
    return { success: false, error: error.message }
  }
}

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error signing out:', error)
    return { success: false, error: error.message }
  }
}

export const getCurrentUser = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) throw error
    return { success: true, data: user }
  } catch (error) {
    console.error('Error getting current user:', error)
    return { success: false, error: error.message }
  }
}
