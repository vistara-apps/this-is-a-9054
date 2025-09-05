// Location detection utilities

export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        })
      },
      (error) => {
        reject(error)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 600000 // 10 minutes
      }
    )
  })
}

export const detectState = async (location) => {
  if (!location) {
    return 'CA' // Default fallback
  }

  try {
    // In a real app, you'd use a reverse geocoding service
    // For demo purposes, we'll use a simple approximation based on coordinates
    
    // This is a simplified state detection - in production you'd use proper geocoding
    const { latitude, longitude } = location
    
    // Simple state boundaries (very approximate)
    if (latitude >= 32.5 && latitude <= 42 && longitude >= -124.4 && longitude <= -114.1) {
      return 'CA' // California
    } else if (latitude >= 25.8 && latitude <= 31 && longitude >= -87.6 && longitude <= -79.8) {
      return 'FL' // Florida
    } else if (latitude >= 40.5 && latitude <= 45.0 && longitude >= -79.8 && longitude <= -71.8) {
      return 'NY' // New York
    } else if (latitude >= 25.8 && latitude <= 36.5 && longitude >= -106.6 && longitude <= -93.5) {
      return 'TX' // Texas
    }
    
    // More states could be added with proper boundary detection
    return 'CA' // Default fallback
    
  } catch (error) {
    console.error('Error detecting state:', error)
    return 'CA' // Default fallback
  }
}

export const formatLocation = (location) => {
  if (!location) return 'Unknown location'
  
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
}