import React from 'react'

const SOSAlert = ({ sos, onRespond }) => {
  const getEmergencyIcon = (type) => {
    const icons = {
      violence_immediate: '🔴',
      medical_emergency: '🏥',
      arrest_in_progress: '👮',
      trapped_location: '🚷',
      life_threatening: '💀'
    }
    return icons[type] || '🚨'
  }

  const getPriorityColor = (priority) => {
    return priority === 'critical' ? 'bg-red-600' : 'bg-red-500'
  }

  const formatTimeAgo = (timestamp) => {
    const now = new Date()
    const sosTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - sosTime) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    return `${Math.floor(diffInMinutes / 60)}h ago`
  }

  const handleRespond = (responseType) => {
    if (onRespond) {
      onRespond(sos.sosId, responseType)
    }
  }

  return (
    <div className={`border-l-4 ${getPriorityColor(sos.priority)} bg-red-50 rounded-r-lg p-4 mb-3`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{getEmergencyIcon(sos.emergencyType)}</span>
          <div>
            <h3 className="font-bold text-red-900 capitalize">
              {sos.emergencyType.replace(/_/g, ' ')}
            </h3>
            <p className="text-red-700 text-sm">
              {formatTimeAgo(sos.createdAt)} • {sos.broadcastRadius}km away
            </p>
          </div>
        </div>
        
        <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getPriorityColor(sos.priority)}`}>
          {sos.priority.toUpperCase()}
        </span>
      </div>

      {/* Emergency Details */}
      {sos.details && (
        <div className="mb-3 text-sm text-red-800">
          {sos.details.numberOfPeople && (
            <p>
              <strong>People involved:</strong> {sos.details.numberOfPeople}
            </p>
          )}
          {sos.details.immediateDanger && (
            <p className="font-bold">🚨 IMMEDIATE DANGER PRESENT</p>
          )}
          {sos.details.medicalNeeds && sos.details.medicalNeeds.length > 0 && (
            <p>
              <strong>Medical needs:</strong> {sos.details.medicalNeeds.join(', ')}
            </p>
          )}
        </div>
      )}

      {/* Responder Actions */}
      <div className="flex space-x-2">
        <button
          onClick={() => handleRespond('on_way')}
          className="flex-1 bg-green-600 text-white py-2 px-3 rounded text-sm hover:bg-green-700 transition-colors"
        >
          ✅ I'm Coming
        </button>
        <button
          onClick={() => handleRespond('contacting_help')}
          className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors"
        >
          📞 Contacting Help
        </button>
        <button
          onClick={() => handleRespond('info_shared')}
          className="flex-1 bg-gray-600 text-white py-2 px-3 rounded text-sm hover:bg-gray-700 transition-colors"
        >
          ℹ️ Share Info
        </button>
      </div>

      {/* Responders Count */}
      {sos.responders && sos.responders.length > 0 && (
        <div className="mt-2 text-xs text-red-700">
          {sos.responders.length} people responding to this emergency
        </div>
      )}
    </div>
  )
}

export default SOSAlert;