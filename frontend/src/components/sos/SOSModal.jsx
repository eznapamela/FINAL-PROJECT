import React, { useState } from 'react'

const SOSModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [sosData, setSosData] = useState({
    emergencyType: '',
    details: {
      numberOfPeople: 1,
      immediateDanger: false,
      medicalNeeds: [],
      escapeRoutes: []
    },
    broadcastRadius: 5
  })

  const emergencyTypes = [
    {
      value: 'violence_immediate',
      label: 'Immediate Violence',
      description: 'Active violence or attack in progress',
      icon: '🔴'
    },
    {
      value: 'medical_emergency',
      label: 'Medical Emergency',
      description: 'Someone needs urgent medical attention',
      icon: '🏥'
    },
    {
      value: 'arrest_in_progress',
      label: 'Arrest in Progress',
      description: 'Someone is being arrested or detained',
      icon: '👮'
    },
    {
      value: 'trapped_location',
      label: 'Trapped/Need Escape',
      description: 'Unable to leave current location safely',
      icon: '🚷'
    },
    {
      value: 'life_threatening',
      label: 'Life-Threatening Situation',
      description: 'Immediate danger to life',
      icon: '💀'
    }
  ]

  const medicalNeedsOptions = [
    'first_aid',
    'bleeding_control',
    'cpr_needed',
    'allergic_reaction',
    'chronic_condition',
    'other_medical'
  ]

  const handleInputChange = (field, value) => {
    if (field.startsWith('details.')) {
      const detailField = field.replace('details.', '')
      setSosData(prev => ({
        ...prev,
        details: { ...prev.details, [detailField]: value }
      }))
    } else {
      setSosData(prev => ({ ...prev, [field]: value }))
    }
  }

  const handleMedicalNeedToggle = (need) => {
    const currentNeeds = sosData.details.medicalNeeds
    const newNeeds = currentNeeds.includes(need)
      ? currentNeeds.filter(n => n !== need)
      : [...currentNeeds, need]
    
    handleInputChange('details.medicalNeeds', newNeeds)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!sosData.emergencyType) {
      alert('Please select an emergency type')
      return
    }
    onSubmit(sosData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-red-600 text-white p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🚨</span>
              <div>
                <h2 className="text-xl font-bold">Emergency SOS</h2>
                <p className="text-red-100 text-sm">Help is on the way</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-red-100 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Emergency Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Emergency Type *
            </label>
            <div className="space-y-2">
              {emergencyTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleInputChange('emergencyType', type.value)}
                  className={`w-full text-left p-3 border rounded-md transition-colors ${
                    sosData.emergencyType === type.value
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-xl">{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Number of People */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of People Involved
            </label>
            <select
              value={sosData.details.numberOfPeople}
              onChange={(e) => handleInputChange('details.numberOfPeople', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </select>
          </div>

          {/* Immediate Danger */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={sosData.details.immediateDanger}
                onChange={(e) => handleInputChange('details.immediateDanger', e.target.checked)}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Immediate danger present
              </span>
            </label>
          </div>

          {/* Medical Needs */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Medical Needs (if any)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {medicalNeedsOptions.map((need) => (
                <button
                  key={need}
                  type="button"
                  onClick={() => handleMedicalNeedToggle(need)}
                  className={`p-2 border rounded-md text-sm transition-colors ${
                    sosData.details.medicalNeeds.includes(need)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {need.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Broadcast Radius */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alert Radius: {sosData.broadcastRadius} km
            </label>
            <input
              type="range"
              min="1"
              max="20"
              value={sosData.broadcastRadius}
              onChange={(e) => handleInputChange('broadcastRadius', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <p className="text-xs text-gray-500 mt-1">
              How far to broadcast this SOS alert
            </p>
          </div>

          {/* Warning Message */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <div className="flex items-center space-x-2 text-yellow-800">
              <span>⚠️</span>
              <div className="text-sm">
                <strong>Important:</strong> This SOS will be broadcast to nearby users. 
                Only use for genuine emergencies.
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-md hover:bg-gray-300 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !sosData.emergencyType}
              className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending SOS...</span>
                </>
              ) : (
                <>
                  <span>🚨</span>
                  <span>Send SOS Alert</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SOSModal;