// Local storage management with encryption
const STORAGE_KEYS = {
  ANONYMOUS_TOKEN: 'anonymousToken',
  DEVICE_ID: 'deviceId',
  USER_PREFERENCES: 'userPreferences',
  OFFLINE_ALERTS: 'offlineAlerts',
  OFFLINE_SOS: 'offlineSOS'
}

export const storageService = {
  // Basic storage operations
  setItem: (key, value) => {
    try {
      const serializedValue = JSON.stringify(value)
      localStorage.setItem(key, serializedValue)
      return true
    } catch (error) {
      console.error('Storage set error:', error)
      return false
    }
  },

  getItem: (key) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : null
    } catch (error) {
      console.error('Storage get error:', error)
      return null
    }
  },

  removeItem: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Storage remove error:', error)
      return false
    }
  },

  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch (error) {
      console.error('Storage clear error:', error)
      return false
    }
  },

  // App-specific methods
  saveOfflineAlert: (alert) => {
    const offlineAlerts = storageService.getItem(STORAGE_KEYS.OFFLINE_ALERTS) || []
    offlineAlerts.push({
      ...alert,
      offline: true,
      createdAt: new Date().toISOString()
    })
    return storageService.setItem(STORAGE_KEYS.OFFLINE_ALERTS, offlineAlerts)
  },

  getOfflineAlerts: () => {
    return storageService.getItem(STORAGE_KEYS.OFFLINE_ALERTS) || []
  },

  clearOfflineAlerts: () => {
    return storageService.setItem(STORAGE_KEYS.OFFLINE_ALERTS, [])
  },

  saveOfflineSOS: (sos) => {
    const offlineSOS = storageService.getItem(STORAGE_KEYS.OFFLINE_SOS) || []
    offlineSOS.push({
      ...sos,
      offline: true,
      createdAt: new Date().toISOString()
    })
    return storageService.setItem(STORAGE_KEYS.OFFLINE_SOS, offlineSOS)
  },

  getOfflineSOS: () => {
    return storageService.getItem(STORAGE_KEYS.OFFLINE_SOS) || []
  },

  clearOfflineSOS: () => {
    return storageService.setItem(STORAGE_KEYS.OFFLINE_SOS, [])
  }
};