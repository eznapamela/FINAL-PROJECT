// Application constants
export const APP_CONSTANTS = {
  APP_NAME: 'Voices Under Fire',
  VERSION: '1.0.0',
  SDG_GOAL: 'SDG 16: Peace, Justice & Strong Institutions',
  
  // Alert types
  ALERT_TYPES: {
    VIOLENCE: 'violence',
    ARREST: 'arrest',
    MEDICAL: 'medical',
    CHECKPOINT: 'checkpoint',
    SAFE_ZONE: 'safe_zone',
    DANGER_ZONE: 'danger_zone',
    INTERNET_SHUTDOWN: 'internet_shutdown',
    OTHER: 'other'
  },

  // Severity levels
  SEVERITY_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high',
    CRITICAL: 'critical'
  },

  // SOS emergency types
  SOS_TYPES: {
    VIOLENCE_IMMEDIATE: 'violence_immediate',
    MEDICAL_EMERGENCY: 'medical_emergency',
    ARREST_IN_PROGRESS: 'arrest_in_progress',
    TRAPPED_LOCATION: 'trapped_location',
    LIFE_THREATENING: 'life_threatening'
  },

  // Verification types
  VERIFICATION_TYPES: {
    CONFIRM: 'confirm',
    DENY: 'deny',
    UPDATE: 'update'
  },

  // Confidence levels
  CONFIDENCE_LEVELS: {
    LOW: 'low',
    MEDIUM: 'medium',
    HIGH: 'high'
  },

  // Default settings
  DEFAULT_SETTINGS: {
    AUTO_DELETE_HOURS: 24,
    NOTIFICATION_RADIUS: 10, // km
    PANIC_WIPE_ENABLED: true,
    LOCATION_SHARING: true
  },

  // Storage keys
  STORAGE_KEYS: {
    ANONYMOUS_TOKEN: 'anonymousToken',
    DEVICE_ID: 'deviceId',
    USER_SETTINGS: 'userSettings',
    OFFLINE_ALERTS: 'offlineAlerts',
    OFFLINE_SOS: 'offlineSOS'
  },

  // API configuration
  API_CONFIG: {
    TIMEOUT: 10000,
    RETRY_ATTEMPTS: 3,
    RATE_LIMIT_DELAY: 1000
  },

  // Map configuration
  MAP_CONFIG: {
    DEFAULT_ZOOM: 12,
    MAX_ZOOM: 18,
    MIN_ZOOM: 8,
    TILE_LAYER: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  },

  // Emergency contacts (Kenya specific)
  EMERGENCY_CONTACTS: {
    POLICE: '911',
    AMBULANCE: '911',
    FIRE: '911',
    KNCHR: '0800 720 627', // Kenya National Commission on Human Rights
    IMLU: '0733 333 444'   // Independent Medico-Legal Unit
  }
}

// Local storage keys
export const STORAGE_KEYS = {
  USER_PREFERENCES: 'vuf_user_preferences',
  SESSION_DATA: 'vuf_session_data',
  OFFLINE_QUEUE: 'vuf_offline_queue',
  LOCATION_HISTORY: 'vuf_location_history'
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network connection failed. Please check your internet connection.',
  LOCATION_ERROR: 'Unable to access your location. Please enable location services.',
  AUTH_ERROR: 'Authentication failed. Please refresh the page.',
  SUBMISSION_ERROR: 'Failed to submit. Please try again.',
  LOAD_ERROR: 'Failed to load data. Please check your connection.'
}

// Success messages
export const SUCCESS_MESSAGES = {
  ALERT_CREATED: 'Alert created successfully and shared with the community.',
  SOS_SENT: 'Emergency SOS sent! Help is on the way.',
  VERIFICATION_SUBMITTED: 'Thank you for helping verify this information.',
  SETTINGS_SAVED: 'Settings saved successfully.'
};
