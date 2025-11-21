import { APP_CONSTANTS } from './constants'

/**
 * Format distance between two coordinates in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

/**
 * Format timestamp to relative time string
 */
export const formatTimeAgo = (timestamp) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInSeconds = Math.floor((now - time) / 1000)
  
  if (diffInSeconds < 60) {
    return 'just now'
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours}h ago`
  }
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) {
    return `${diffInDays}d ago`
  }
  
  return time.toLocaleDateString()
}

/**
 * Generate a random anonymous ID
 */
export const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Generate device fingerprint
 */
export const generateDeviceFingerprint = () => {
  const components = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.platform,
    new Date().getTimezoneOffset()
  ]
  
  return components.join('|')
}

/**
 * Hash string for basic obfuscation (not cryptographic)
 */
export const simpleHash = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36)
}

/**
 * Validate location coordinates
 */
export const isValidLocation = (location) => {
  if (!location || !location.coordinates) return false
  
  const [lng, lat] = location.coordinates
  return (
    typeof lat === 'number' && 
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

/**
 * Get alert severity color
 */
export const getSeverityColor = (severity) => {
  const colors = {
    low: '#EAB308',      // yellow
    medium: '#F97316',   // orange
    high: '#EF4444',     // red
    critical: '#DC2626'  // dark red
  }
  return colors[severity] || colors.medium
}

/**
 * Get alert type icon
 */
export const getAlertTypeIcon = (type) => {
  const icons = {
    violence: '🔴',
    arrest: '👮',
    medical: '🏥',
    checkpoint: '🚧',
    safe_zone: '🟢',
    danger_zone: '🔴',
    internet_shutdown: '📵',
    other: '⚠️'
  }
  return icons[type] || icons.other
}

/**
 * Format file size for display
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

/**
 * Debounce function for search inputs
 */
export const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

/**
 * Check if device is online
 */
export const isOnline = () => {
  return navigator.onLine
}

/**
 * Get user's approximate location from IP (fallback)
 */
export const getApproximateLocation = async () => {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    
    return {
      lat: data.latitude,
      lng: data.longitude,
      accuracy: 50000, // Rough accuracy for IP-based location
      city: data.city,
      country: data.country_name
    }
  } catch (error) {
    console.error('Failed to get approximate location:', error)
    return null
  }
}

/**
 * Compress image for upload
 */
export const compressImage = (file, maxWidth = 800, quality = 0.7) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    
    reader.onload = (event) => {
      const img = new Image()
      img.src = event.target.result
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        // Calculate new dimensions
        let width = img.width
        let height = img.height
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        ctx.drawImage(img, 0, 0, width, height)
        
        canvas.toBlob(
          (blob) => resolve(blob),
          'image/jpeg',
          quality
        )
      }
      
      img.onerror = reject
    }
    
    reader.onerror = reject
  })
}

/**
 * Generate unique ID for alerts
 */
export const generateAlertId = () => {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Validate alert data before submission
 */
export const validateAlertData = (alertData) => {
  const errors = []
  
  if (!alertData.type) {
    errors.push('Alert type is required')
  }
  
  if (!alertData.severity) {
    errors.push('Severity level is required')
  }
  
  if (!alertData.description || alertData.description.trim().length < 10) {
    errors.push('Description must be at least 10 characters')
  }
  
  if (!isValidLocation(alertData.location)) {
    errors.push('Valid location is required')
  }
  
  return errors
}

/**
 * Calculate trust score based on user activity
 */
export const calculateTrustScore = (userActivity) => {
  let score = 50 // Base score
  
  // Positive factors
  if (userActivity.verifiedAlerts > 0) {
    score += Math.min(userActivity.verifiedAlerts * 5, 30)
  }
  
  if (userActivity.helpfulVerifications > 0) {
    score += Math.min(userActivity.helpfulVerifications * 3, 15)
  }
  
  if (userActivity.consistentUsage) {
    score += 10
  }
  
  // Negative factors
  if (userActivity.rejectedAlerts > 0) {
    score -= Math.min(userActivity.rejectedAlerts * 10, 40)
  }
  
  if (userActivity.falseVerifications > 0) {
    score -= Math.min(userActivity.falseVerifications * 8, 32)
  }
  
  return Math.max(0, Math.min(100, score))
};