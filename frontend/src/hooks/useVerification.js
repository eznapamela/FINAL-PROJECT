import { useState, useCallback } from 'react'
import { alertService } from '../services/api'

export const useVerification = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const verifyAlert = useCallback(async (alertId, verificationData) => {
    try {
      setLoading(true)
      setError(null)

      const response = await alertService.verifyAlert(alertId, verificationData)

      if (response.success) {
        return response.data
      } else {
        throw new Error(response.error || 'Verification failed')
      }
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const getVerificationStats = useCallback(async (alertId) => {
    try {
      // This would typically come from a separate endpoint
      const response = await alertService.getAlert(alertId)
      if (response.success) {
        return {
          confirmations: response.data.verification?.count || 0,
          denials: 0, // You'd track this separately
          verified: response.data.verification?.verified || false
        }
      }
      throw new Error('Failed to get verification stats')
    } catch (err) {
      setError(err.message)
      throw err
    }
  }, [])

  return {
    verifyAlert,
    getVerificationStats,
    loading,
    error,
    setError
  }
};