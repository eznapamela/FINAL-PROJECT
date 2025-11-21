import React, { useState } from 'react'
import { useGeolocation } from '../../hooks/useGeolocation'
import { useAlerts } from '../../hooks/useAlerts'

const AlertForm = ({ onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    type: '',
    severity: 'medium',
    description: '',
    location: null,
    visibility: 'public'
  })
  const [submitting, setSubmitting] = useState(false)
  
  const { location, getLocation } = useGeolocation()
  const { createAlert } = useAlerts()

  const alertTypes = [
    { value: 'violence', label: 'Violence', icon: '🔴' },
    { value: 'arrest', label: 'Arrest', icon: '👮' },
    { value: 'medical', label: 'Medical', icon: '🏥' },
    { value: 'checkpoint', label: 'Checkpoint', icon: '🚧' },
    { value: 'safe_zone', label: 'Safe Zone', icon: '🟢' },
    { value: 'danger_zone', label: 'Danger Zone', icon: '🔴' },
    { value: 'internet_shutdown', label: 'Internet Shutdown', icon: '📵' },
    { value: 'other', label: 'Other', icon: '⚠️' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low', color: 'text-yellow-600' },
    { value: 'medium', label: 'Medium', color: 'text-orange-600' },
    { value: 'high', label: 'High', color: 'text-red-600' },
    { value: 'critical', label: 'Critical', color: 'text-red-700 font-bold' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleGetLocation = async () => {
    try {
      const currentLocation = await getLocation()
      setFormData(prev => ({
        ...prev,
        location: {
          coordinates: [currentLocation.lng, currentLocation.lat],
          accuracy: currentLocation.accuracy
        }
      }))
    } catch (error) {
      alert('Unable to get your location. Please enable location services.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.type || !formData.description) {
      alert('Please fill in all required fields.')
      return
    }

    if (!formData.location) {
      alert('Please get your location first.')
      return
    }

    setSubmitting(true)
    try {
      await createAlert(formData)
      if (onSuccess) onSuccess()
    } catch (error) {
      alert('Failed to create alert: ' + error.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Create New Alert</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Alert Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alert Type *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {alertTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => handleInputChange('type', type.value)}
                className={`p-3 border rounded-md text-left transition-colors ${
                  formData.type === type.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span>{type.icon}</span>
                  <span>{type.label}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity Level *
          </label>
          <div className="flex space-x-2">
            {severityLevels.map((level) => (
              <button
                key={level.value}
                type="button"
                onClick={() => handleInputChange('severity', level.value)}
                className={`flex-1 p-2 border rounded-md text-center transition-colors ${
                  formData.severity === level.value
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                } ${level.color}`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={handleGetLocation}
              className="flex items-center space-x-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
            >
              <span>📍</span>
              <span>Get My Location</span>
            </button>
            {formData.location && (
              <span className="flex items-center text-sm text-green-600">
                ✅ Location captured
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Your exact location is never stored. Only approximate coordinates are used.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what's happening. Be specific but avoid personal information..."
            rows="4"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            maxLength="500"
          />
          <div className="text-xs text-black text-right mt-1">
            {formData.description.length}/500 characters
          </div>
        </div>

        {/* Visibility */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visibility
          </label>
          <select
            value={formData.visibility}
            onChange={(e) => handleInputChange('visibility', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="public">Public (Everyone can see)</option>
            <option value="verified_only">Verified Users Only</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting || !formData.type || !formData.description || !formData.location}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {submitting ? 'Creating Alert...' : 'Create Alert'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AlertForm;