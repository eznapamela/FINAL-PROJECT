import React, { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'

export const AuthContext = createContext()


export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    initializeAuth()
  }, [])

  const initializeAuth = async () => {
    try {
      // Check for existing anonymous token
      const existingToken = localStorage.getItem('anonymousToken')
      const deviceId = getOrCreateDeviceId()

      if (existingToken) {
        // Validate existing token
        const isValid = await authService.validateToken(existingToken)
        if (isValid) {
          setUser({ anonymousId: existingToken, deviceId })
        } else {
          await createAnonymousUser(deviceId)
        }
      } else {
        await createAnonymousUser(deviceId)
      }
    } catch (err) {
      setError('Failed to initialize authentication')
      console.error('Auth initialization error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getOrCreateDeviceId = () => {
    let deviceId = localStorage.getItem('deviceId')
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('deviceId', deviceId)
    }
    return deviceId
  }

  const createAnonymousUser = async (deviceId) => {
    try {
      const response = await authService.createAnonymousUser(deviceId)
      if (response.success) {
        const { anonymousId } = response.data
        localStorage.setItem('anonymousToken', anonymousId)
        setUser({ anonymousId, deviceId })
      }
    } catch (err) {
      throw new Error('Failed to create anonymous user')
    }
  }

  const panicWipe = () => {
    // Clear all local data
    localStorage.removeItem('anonymousToken')
    localStorage.removeItem('deviceId')
    sessionStorage.clear()
    
    // Reset user state
    setUser(null)
    
    // Reload the app
    window.location.reload()
  }

  const value = {
    user,
    loading,
    error,
    panicWipe,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
};