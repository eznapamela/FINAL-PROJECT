import React, { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { useAlerts } from '../hooks/useAlerts'
import { useAuth } from '../hooks/useAuth'
import { useGeolocation } from '../hooks/useGeolocation'
import AlertCard from '../components/alerts/AlertCard'
import LoadingSpinner from '../components/common/LoadingSpinner'
import LocationTracker from '../components/map/LocationTracker'

const Home = () => {
  const { alerts, loading, fetchAlerts } = useAlerts()
  const { user } = useAuth()
  const { location } = useGeolocation()
  const [stats, setStats] = useState({
    totalAlerts: 0,
    activeSOS: 0,
    verifiedAlerts: 0,
    recentAlerts: 0
  })

  useEffect(() => {
    if (location) {
      fetchAlerts({ radius: 10 });
    }
  }, [location, fetchAlerts])

  useEffect(() => {
    // Calculate stats
    const now = new Date()
    const recentAlerts = alerts.filter(alert => 
      new Date(alert.createdAt) > new Date(now.getTime() - 24 * 60 * 60 * 1000)
    )

    setStats({
      totalAlerts: alerts.length,
      activeSOS: alerts.filter(alert => alert.type === 'sos' && alert.status === 'active').length,
      verifiedAlerts: alerts.filter(alert => alert.verification?.verified).length,
      recentAlerts: recentAlerts.length
    })
  }, [alerts])

  const recentAlerts = alerts.slice(0, 5)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Stay Safe. Stay Informed.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Voices Under Fire is a community-driven platform dedicated to keeping people safe and informed during crises. We empower individuals to report incidents, verify alerts, and access real-time information all while protecting privacy and personal data.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                to="/alerts"
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>🚨</span>
                <span>View Live Alerts</span>
              </Link>
              <Link
                to="/map"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <span>🗺️</span>
                <span>Open Crisis Map</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{stats.totalAlerts}</div>
                <div className="text-sm text-gray-600">Total Alerts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.activeSOS}</div>
                <div className="text-sm text-gray-600">Active SOS</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.verifiedAlerts}</div>
                <div className="text-sm text-gray-600">Verified</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.recentAlerts}</div>
                <div className="text-sm text-gray-600">Last 24h</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Alerts */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Recent Alerts Near You</h2>
              <Link
                to="/alerts"
                className="text-red-600 hover:text-red-700 font-medium"
              >
                View All →
              </Link>
            </div>

            <LocationTracker />

            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner text="Loading alerts..." />
              </div>
            ) : recentAlerts.length > 0 ? (
              <div className="space-y-4 mt-4">
                {recentAlerts.map((alert) => (
                  <AlertCard key={alert.alertId} alert={alert} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📋</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Recent Alerts</h3>
                <p className="text-gray-600 mb-4">
                  There are no recent alerts in your area. Check back later or 
                  be the first to report an incident.
                </p>
                <Link
                  to="/alerts"
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
                  Report Incident
                </Link>
              </div>
            )}
          </div>

          {/* Right Column - Quick Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  to="/alerts?create=true"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-red-300 hover:bg-red-50 transition-colors"
                >
                  <span className="text-xl">📝</span>
                  <div>
                    <div className="font-medium">Report Incident</div>
                    <div className="text-sm text-gray-600">Share safety information</div>
                  </div>
                </Link>
                
                <Link
                  to="/missing"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <span className="text-xl">👤</span>
                  <div>
                    <div className="font-medium">Missing Persons</div>
                    <div className="text-sm text-gray-600">Report or search</div>
                  </div>
                </Link>
                
                <Link
                  to="/settings"
                  className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <span className="text-xl">⚙️</span>
                  <div>
                    <div className="font-medium">Settings</div>
                    <div className="text-sm text-gray-600">Privacy & preferences</div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Safety Tips */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Safety First
              </h3>
              <ul className="space-y-2 text-sm text-blue-800">
                <li className="flex items-start space-x-2">
                  <span>🔒</span>
                  <span>Your identity is always protected</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>✅</span>
                  <span>Verify information before acting</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>📱</span>
                  <span>Keep your location services enabled</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span>🚨</span>
                  <span>Use SOS only for genuine emergencies</span>
                </li>
              </ul>
            </div>

            {/* Anonymous Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-semibold text-green-900">Anonymous Mode Active</h4>
                  <p className="text-sm text-green-700">
                    Your privacy is protected. No personal data is stored.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home;