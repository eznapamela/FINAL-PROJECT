import React from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

const ZoneMarker = ({ zone, type }) => {
  const getZoneIcon = (zoneType) => {
    const colors = {
      safe_zone: '#10B981',
      danger_zone: '#EF4444',
      medical_zone: '#3B82F6',
      evacuation_zone: '#F59E0B'
    }

    const icons = {
      safe_zone: '🟢',
      danger_zone: '🔴',
      medical_zone: '🏥',
      evacuation_zone: '🚨'
    }

    const color = colors[zoneType] || '#6B7280'
    const icon = icons[zoneType] || '⚠️'

    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          width: 32px;
          height: 32px;
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          font-weight: bold;
        ">
          ${icon}
        </div>
      `,
      className: 'zone-marker',
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    })
  }

  if (!zone.location?.coordinates) return null

  const [lng, lat] = zone.location.coordinates

  return (
    <Marker
      position={[lat, lng]}
      icon={getZoneIcon(type)}
    >
      <Popup>
        <div className="min-w-[200px]">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">
              {type === 'safe_zone' ? '🟢' : 
               type === 'danger_zone' ? '🔴' :
               type === 'medical_zone' ? '🏥' : '🚨'}
            </span>
            <div>
              <h3 className="font-semibold capitalize">
                {type.replace('_', ' ')}
              </h3>
              <p className="text-sm text-gray-600">
                {zone.verified ? '✅ Verified Zone' : '🔄 Unverified'}
              </p>
            </div>
          </div>
          
          {zone.description && (
            <p className="text-sm mb-2">{zone.description}</p>
          )}
          
          {zone.capacity && (
            <p className="text-sm mb-1">
              <strong>Capacity:</strong> {zone.capacity}
            </p>
          )}
          
          {zone.facilities && zone.facilities.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium">Facilities:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {zone.facilities.map((facility, index) => (
                  <span 
                    key={index}
                    className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                  >
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {zone.risks && zone.risks.length > 0 && (
            <div className="mb-2">
              <p className="text-sm font-medium text-red-700">Risks:</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {zone.risks.map((risk, index) => (
                  <span 
                    key={index}
                    className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                  >
                    {risk}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-between items-center text-xs text-gray-500 mt-2">
            <span>
              Updated {new Date(zone.updatedAt).toLocaleDateString()}
            </span>
            {zone.verifications > 0 && (
              <span>
                {zone.verifications} verifications
              </span>
            )}
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default ZoneMarker;