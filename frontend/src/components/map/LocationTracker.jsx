import React, { useEffect, useState } from 'react'
import { useGeolocation } from '../../hooks/useGeolocation'

const LocationTracker = () => {
  const { location, error, loading, getLocation } = useGeolocation()
  const [lastUpdate, setLastUpdate] = useState(null)

  useEffect(() => {
    if (location) {
      setLastUpdate(new Date())
    }
  }, [location])

  const handleRefreshLocation = async () => {
    try {
      await getLocation()
    } catch (err) {
      console.error('Failed to refresh location:', err)
    }
  }

  if (loading) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-blue-700 text-sm">Getting your location...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-red-600">📍</span>
            <div>
              <p className="text-red-700 text-sm font-medium">Location Error</p>
              <p className="text-red-600 text-xs">{error}</p>
            </div>
          </div>
          <button
            onClick={handleRefreshLocation}
            className="bg-red-100 text-red-700 px-3 py-1 rounded text-xs hover:bg-red-200 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!location) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-yellow-600">📍</span>
            <p className="text-yellow-700 text-sm">Location not available</p>
          </div>
          <button
            onClick={handleRefreshLocation}
            className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded text-xs hover:bg-yellow-200 transition-colors"
          >
            Enable
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-green-600">📍</span>
          <div>
            <p className="text-green-700 text-sm font-medium">
              Location Active
            </p>
            <p className="text-green-600 text-xs">
              Accuracy: ~{Math.round(location.accuracy)} meters
              {lastUpdate && ` • Updated ${formatTimeAgo(lastUpdate)}`}
            </p>
          </div>
        </div>
        <button
          onClick={handleRefreshLocation}
          className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs hover:bg-green-200 transition-colors"
        >
          Refresh
        </button>
      </div>
    </div>
  )
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diffInSeconds = Math.floor((now - date) / 1000)
  
  if (diffInSeconds < 60) return 'just now'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`
  return `${Math.floor(diffInSeconds / 86400)} days ago`
}

export default LocationTracker;