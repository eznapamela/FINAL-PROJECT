import React, { useState } from 'react'
import { useVerification } from '../../hooks/useVerification'

const VerifyModal = ({ alert, isOpen, onClose, onVerify }) => {
  const [selectedType, setSelectedType] = useState('')
  const [confidence, setConfidence] = useState('medium')
  const [additionalInfo, setAdditionalInfo] = useState('')
  const { verifyAlert, loading } = useVerification()

  const verificationTypes = [
    {
      value: 'confirm',
      label: 'I Can Confirm This',
      description: 'I witnessed this event personally',
      icon: '✅',
      color: 'bg-green-100 border-green-500 text-green-700'
    },
    {
      value: 'deny',
      label: 'This Is Incorrect',
      description: 'This information is wrong or misleading',
      icon: '❌',
      color: 'bg-red-100 border-red-500 text-red-700'
    },
    {
      value: 'update',
      label: 'I Have Additional Info',
      description: 'I can provide updated or corrected information',
      icon: '🔄',
      color: 'bg-blue-100 border-blue-500 text-blue-700'
    }
  ]

  const confidenceLevels = [
    { value: 'low', label: 'Not Sure', description: 'Based on hearsay or limited information' },
    { value: 'medium', label: 'Fairly Confident', description: 'Good reason to believe this is accurate' },
    { value: 'high', label: 'Very Confident', description: 'Direct knowledge or strong evidence' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedType) {
      alert('Please select a verification type')
      return
    }

    try {
      await verifyAlert(alert.alertId, {
        verificationType: selectedType,
        confidence,
        additionalInfo: additionalInfo.trim()
      })
      
      if (onVerify) {
        onVerify(alert.alertId)
      }
      
      onClose()
    } catch (error) {
      console.error('Verification failed:', error)
      alert('Failed to submit verification: ' + error.message)
    }
  }

  const handleClose = () => {
    setSelectedType('')
    setConfidence('medium')
    setAdditionalInfo('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gray-900 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl">🔍</span>
              <div>
                <h2 className="text-lg font-bold">Verify Alert</h2>
                <p className="text-gray-300 text-sm">Help keep information accurate</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-300 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Alert Preview */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">
              {alert.type === 'violence' ? '🔴' :
               alert.type === 'arrest' ? '👮' :
               alert.type === 'medical' ? '🏥' :
               alert.type === 'safe_zone' ? '🟢' : '⚠️'}
            </span>
            <div>
              <h3 className="font-semibold capitalize">
                {alert.type.replace('_', ' ')}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {alert.severity} severity
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-700">{alert.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Verification Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How would you describe this information? *
            </label>
            <div className="space-y-2">
              {verificationTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setSelectedType(type.value)}
                  className={`w-full text-left p-3 border rounded-md transition-colors ${
                    selectedType === type.value
                      ? type.color
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm opacity-75">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Confidence Level */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How confident are you? *
            </label>
            <div className="space-y-2">
              {confidenceLevels.map((level) => (
                <button
                  key={level.value}
                  type="button"
                  onClick={() => setConfidence(level.value)}
                  className={`w-full text-left p-3 border rounded-md transition-colors ${
                    confidence === level.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div>
                    <div className="font-medium">{level.label}</div>
                    <div className="text-sm opacity-75">{level.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Additional Information */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Provide any additional details, corrections, or context..."
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              maxLength="200"
            />
            <div className="text-xs text-gray-500 text-right mt-1">
              {additionalInfo.length}/200 characters
            </div>
          </div>

          {/* Privacy Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <span className="text-blue-600">🔒</span>
              <div className="text-sm text-blue-700">
                <strong>Your privacy is protected:</strong> Your verification is completely 
                anonymous and not linked to your identity in any way.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !selectedType}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>Submit Verification</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default VerifyModal;