import React, { useState, useEffect } from 'react'
import { useSOS } from '../hooks/useSOS'
import { useGeolocation } from '../hooks/useGeolocation'
import SOSAlert from '../components/sos/SOSAlert'
import SOSModal from '../components/sos/SOSModal'
import LoadingSpinner from '../components/common/LoadingSpinner'

const SOS = () => {
  const [sosAlerts, setSosAlerts] = useState([])
  const [showSOSModal, setShowSOSModal] = useState(false)
  const { sendSOS, getNearbySOS, loading, error } = useSOS()
  const { location } = useGeolocation()

  useEffect(() => {
    if (location) {
      loadNearbySOS()
    }
  }, [location])

  const loadNearbySOS = async () => {
    try {
      if (location) {
        const alerts = await getNearbySOS(location, 10)
        setSosAlerts(alerts)
      }
    } catch (err) {
      console.error('Failed to load SOS alerts:', err)
    }
  }

  const handleSendSOS = async (sosData) => {
    try {
      await sendSOS(sosData)
      setShowSOSModal(false)
      // Reload nearby SOS to include the new one
      await loadNearbySOS()
    } catch (err) {
      console.error('SOS failed:', err)
    }
  }

  const handleRespondToSOS = (sosId, responseType) => {
    // Implement response logic
    console.log(`Responding to SOS ${sosId} with: ${responseType}`)
    // This would typically update the SOS request via API
  }

  const activeSOS = sosAlerts.filter(sos => sos.status === 'active')
  const recentSOS = sosAlerts.filter(sos => sos.status !== 'active')

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Emergency SOS
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Immediate help and community response during critical situations. 
            Use only for genuine emergencies.
          </p>
        </div>

        {/* Emergency Actions */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Send SOS Card */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="text-center">
              <div className="text-4xl mb-4">🚨</div>
              <h3 className="text-xl font-semibold text-red-900 mb-2">
                Need Immediate Help?
              </h3>
              <p className="text-red-700 mb-4">
                Send an emergency SOS alert to nearby users and responders
              </p>
              <button
                onClick={() => setShowSOSModal(true)}
                disabled={!location}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                Send Emergency SOS
              </button>
              {!location && (
                <p className="text-red-600 text-sm mt-2">
                  Enable location services to send SOS
                </p>
              )}
            </div>
          </div>

          {/* Emergency Contacts */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">
              Emergency Contacts
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Police Emergency</span>
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  911 / 112
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Medical Emergency</span>
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  911 / 112
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-700">Fire Department</span>
                <span className="font-mono bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                  911 / 112
                </span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-white rounded border border-blue-300">
              <p className="text-sm text-blue-800">
                <strong>Remember:</strong> For immediate life-threatening emergencies, 
                always call official emergency services first.
              </p>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-700">
              <span>⚠️</span>
              <div>
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Active SOS Alerts */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">
              Active Emergencies
            </h2>
            <button
              onClick={loadNearbySOS}
              disabled={loading}
              className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <span>🔄</span>
              <span>Refresh</span>
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner text="Loading emergencies..." />
            </div>
          ) : activeSOS.length > 0 ? (
            <div className="space-y-4">
              {activeSOS.map((sos) => (
                <SOSAlert
                  key={sos.sosId}
                  sos={sos}
                  onRespond={handleRespondToSOS}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <div className="text-green-500 text-6xl mb-4">✅</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Active Emergencies
              </h3>
              <p className="text-gray-600">
                There are no active SOS alerts in your area.
              </p>
            </div>
          )}
        </div>

        {/* Recent/Resolved SOS */}
        {recentSOS.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Recent Emergencies
            </h2>
            <div className="space-y-3">
              {recentSOS.slice(0, 5).map((sos) => (
                <div
                  key={sos.sosId}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className={
                        sos.status === 'resolved' ? 'text-green-500' : 'text-gray-500'
                      }>
                        {sos.status === 'resolved' ? '✅' : '❌'}
                      </span>
                      <div>
                        <h4 className="font-medium capitalize">
                          {sos.emergencyType.replace(/_/g, ' ')}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(sos.createdAt).toLocaleDateString()} • {sos.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {sos.responders?.length || 0} responders
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SOS Modal */}
        <SOSModal
          isOpen={showSOSModal}
          onClose={() => setShowSOSModal(false)}
          onSubmit={handleSendSOS}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default SOS;