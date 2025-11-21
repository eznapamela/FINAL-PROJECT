import React from 'react'
import { MapProvider } from '../contexts/MapContext'
import CrisisMap from '../components/map/CrisisMap'
import LocationTracker from '../components/map/LocationTracker'
import { useAlerts } from '../hooks/useAlerts'
import { useGeolocation } from '../hooks/useGeolocation'

const MapPage = () => {
  const { alerts, loading } = useAlerts()
  const { location } = useGeolocation()

  return (
    <MapProvider>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Crisis Map</h1>
              <p className="text-sm text-gray-600">
                Real-time safety information in your area
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {alerts.length} active alerts
              </div>
              
              {location && (
                <div className="text-sm text-green-600 flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Location active</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Location Tracker */}
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-2">
          <LocationTracker />
        </div>

        {/* Map Container */}
        <div className="flex-1 relative">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading map data...</p>
              </div>
            </div>
          ) : (
            <CrisisMap />
          )}
        </div>

        {/* Quick Actions Footer */}
        <div className="bg-white border-t border-gray-200 px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex space-x-2 text-sm text-gray-600">
              <span>🟢 Safe Zones</span>
              <span>🔴 Danger Areas</span>
              <span>👮 Checkpoints</span>
              <span>🏥 Medical</span>
            </div>
            
            <div className="text-xs text-gray-500">
              Data updates every 30 seconds
            </div>
          </div>
        </div>
      </div>
    </MapProvider>
  )
}

export default MapPage;