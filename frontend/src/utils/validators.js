/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (basic international format)
 */
export const isValidPhone = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone)
}

/**
 * Validate location coordinates
 */
export const isValidCoordinates = (lat, lng) => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    lat >= -90 && lat <= 90 &&
    lng >= -180 && lng <= 180
  )
}

/**
 * Validate alert description
 */
export const isValidAlertDescription = (description) => {
  if (!description || typeof description !== 'string') return false
  
  const trimmed = description.trim()
  return trimmed.length >= 10 && trimmed.length <= 500
}

/**
 * Validate SOS emergency data
 */
export const isValidSOSData = (sosData) => {
  if (!sosData.emergencyType) return false
  if (!isValidCoordinates(sosData.location?.lat, sosData.location?.lng)) return false
  
  return true
}

/**
 * Sanitize user input to prevent XSS
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Validate file type for uploads
 */
export const isValidFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return allowedTypes.includes(file.type)
}

/**
 * Validate file size
 */
export const isValidFileSize = (file, maxSizeInMB = 5) => {
  return file.size <= maxSizeInMB * 1024 * 1024
}

/**
 * Validate missing person report data
 */
export const isValidMissingPersonReport = (reportData) => {
  const errors = []
  
  if (!reportData.name || reportData.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters')
  }
  
  if (!reportData.lastSeenLocation || reportData.lastSeenLocation.trim().length < 3) {
    errors.push('Last seen location is required')
  }
  
  if (!reportData.lastSeenTime) {
    errors.push('Last seen time is required')
  }
  
  return errors
};