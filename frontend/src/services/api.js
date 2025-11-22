import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL 

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('anonymousToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired, clear and reload
      localStorage.removeItem('anonymousToken')
      window.location.reload()
    }
    return Promise.reject(error)
  }
)

// Auth Service
export const authService = {
  createAnonymousUser: (deviceId) => 
    api.post('/auth/anonymous', { deviceId }),
  
  validateToken: (token) => 
    api.get('/auth/validate', { headers: { Authorization: `Bearer ${token}` } })
}

// Alert Service
export const alertService = {
  getAlerts: (params) => 
    api.get('/alerts', { params }),
  
  createAlert: (alertData) => 
    api.post('/alerts', alertData),
  
  verifyAlert: (alertId, verificationData) => 
    api.post(`/verify/alert/${alertId}`, verificationData),
  
  deleteAlert: (alertId) => 
    api.delete(`/alerts/${alertId}`)
}

// SOS Service
export const sosService = {
  createSOS: (sosData) => 
    api.post('/sos', sosData),
  
  getNearbySOS: (params) => 
    api.get('/sos/nearby', { params }),
  
  respondToSOS: (sosId, responseData) => 
    api.post(`/sos/${sosId}/respond`, responseData)
}

// Missing Persons Service
export const missingService = {
  getCases: (params) => 
    api.get('/missing-persons', { params }),
  
  createCase: (caseData) => 
    api.post('/missing-persons', caseData),
  
  updateCase: (caseId, updates) => 
    api.put(`/missing-persons/${caseId}`, updates)
}

// System Service
export const systemService = {
  getConfig: () => 
    api.get('/system/config'),
  
  updatePreferences: (preferences) => 
    api.put('/system/preferences', preferences)
}

export default api;