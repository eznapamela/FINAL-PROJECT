import React, { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet'
import { useMap as useMapContext } from '../../contexts/MapContext'
import { useAlerts } from '../../hooks/useAlerts'
import { useGeolocation } from '../../hooks/useGeolocation'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Custom icons
const createCustomIcon = (color, type) => {
  return L.divIcon({
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 12px;
      ">
        ${getTypeIcon(type)}
      </div>
    `,
    className: 'custom-marker',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })
}

const getTypeIcon = (type) => {
  const icons = {
    violence: '🔴',
    arrest: '👮',
    medical: '🏥',
    checkpoint: '🚧',
    safe_zone: '🟢',
    danger_zone: '🔴',
    internet_shutdown: '📵',
    other: '⚠️'
  }
  return icons[type] || '⚠️'
}

const getAlertColor = (type, severity) => {
  const colors = {
    violence: {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F97316',
      low: '#EAB308'
    },
    arrest: {
      critical: '#7C3AED',
      high: '#8B5CF6',
      medium: '#A78BFA',
      low: '#C4B5FD'
    },
    medical: {
      critical: '#2563EB',
      high: '#3B82F6',
      medium: '#60A5FA',
      low: '#93C5FD'
    },
    safe_zone: {
      critical: '#059669',
      high: '#10B981',
      medium: '#34D399',
      low: '#6EE7B7'
    },
    danger_zone: {
      critical: '#DC2626',
      high: '#EF4444',
      medium: '#F97316',
      low: '#EAB308'
    }
  }
  return colors[type]?.[severity] || '#6B7280'
}

// Map Controller Component
const MapController = () => {
  const map = useMap()
  const { viewport, setViewport } = useMapContext()

  useEffect(() => {
    if (viewport.center && viewport.zoom) {
      map.setView(viewport.center, viewport.zoom)
    }
  }, [viewport, map])

  useEffect(() => {
    const handleMove = () => {
      const center = map.getCenter()
      const zoom = map.getZoom()
      setViewport({
        center: [center.lat, center.lng],
        zoom
      })
    }

    map.on('move', handleMove)
    return () => {
      map.off('move', handleMove)
    }
  }, [map, setViewport])

  return null
}

// User Location Component
const UserLocation = () => {
  const { location } = useGeolocation()
  const map = useMap()

  useEffect(() => {
    if (location && map) {
      // Center map on user location if it's the first load
      if (!map._loaded) {
        map.setView([location.lat, location.lng], 13)
      }
    }
  }, [location, map])

  if (!location) return null

  return (
    <>
      <Marker
        position={[location.lat, location.lng]}
        icon={L.divIcon({
          html: `
            <div style="
              background-color: #2563EB;
              width: 16px;
              height: 16px;
              border: 3px solid white;
              border-radius: 50%;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'user-location-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        })}
      >
        <Popup>
          <div className="text-sm">
            <strong>Your Location</strong>
            <p>Accuracy: {Math.round(location.accuracy)} meters</p>
          </div>
        </Popup>
      </Marker>
      
      {/* Accuracy circle */}
      <Circle
        center={[location.lat, location.lng]}
        radius={location.accuracy}
        pathOptions={{
          fillColor: '#3B82F6',
          fillOpacity: 0.1,
          color: '#2563EB',
          weight: 1,
          opacity: 0.5
        }}
      />
    </>
  )
}

const CrisisMap = () => {
  const { alerts } = useAlerts()
  const { viewport } = useMapContext()
  const { location } = useGeolocation()
  const mapRef = useRef()

  const defaultCenter = location ? [location.lat, location.lng] : [-1.2921, 36.8219] // Nairobi

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={viewport.center || defaultCenter}
        zoom={viewport.zoom || 12}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapController />
        <UserLocation />

        {/* Render alerts as markers */}
        {alerts.map((alert) => {
          if (!alert.location?.coordinates) return null
          
          const [lng, lat] = alert.location.coordinates
          const color = getAlertColor(alert.type, alert.severity)
          
          return (
            <Marker
              key={alert.alertId}
              position={[lat, lng]}
              icon={createCustomIcon(color, alert.type)}
            >
              <Popup>
                <div className="min-w-[200px]">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getTypeIcon(alert.type)}</span>
                    <div>
                      <h3 className="font-semibold capitalize">
                        {alert.type.replace('_', ' ')}
                      </h3>
                      <p className="text-sm text-gray-600 capitalize">
                        {alert.severity} severity
                      </p>
                    </div>
                  </div>
                  
                  <p className="text-sm mb-2">{alert.description}</p>
                  
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>
                      {alert.verification?.verified ? '✅ Verified' : '🔄 Unverified'}
                    </span>
                    <span>
                      {alert.verification?.count || 0} verifications
                    </span>
                  </div>
                  
                  {alert.location?.address && (
                    <p className="text-xs text-gray-500 mt-2">
                      📍 {alert.location.address}
                    </p>
                  )}
                </div>
              </Popup>
            </Marker>
          )
        })}

        {/* Alert radius circles */}
        {alerts.map((alert) => {
          if (!alert.location?.coordinates || alert.type === 'internet_shutdown') return null
          
          const [lng, lat] = alert.location.coordinates
          const color = getAlertColor(alert.type, alert.severity)
          const radius = getAlertRadius(alert.severity)
          
          return (
            <Circle
              key={`circle-${alert.alertId}`}
              center={[lat, lng]}
              radius={radius}
              pathOptions={{
                fillColor: color,
                fillOpacity: 0.1,
                color: color,
                weight: 2,
                opacity: 0.6
              }}
            />
          )
        })}
      </MapContainer>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4 max-w-xs">
        <h4 className="font-semibold mb-2">Map Legend</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Violence & Danger Zones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Arrests & Checkpoints</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Medical Emergencies</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe Zones</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Other Alerts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
            <span>Your Location</span>
          </div>
        </div>
      </div>
    </div>
  )
}

const getAlertRadius = (severity) => {
  const radii = {
    critical: 2000, // 2km
    high: 1000,     // 1km
    medium: 500,    // 500m
    low: 200        // 200m
  }
  return radii[severity] || 500
}

export default CrisisMap;