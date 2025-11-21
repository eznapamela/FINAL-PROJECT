import React, { useState } from 'react'
import { useAlerts } from '../hooks/useAlerts'
import AlertCard from '../components/alerts/AlertCard'
import AlertFilters from '../components/alerts/AlertFilters'
import AlertForm from '../components/alerts/AlertForm'
import LoadingSpinner from '../components/common/LoadingSpinner'

const Alerts = () => {
  const { alerts, loading, error, filters, updateFilters } = useAlerts()
  const [showAlertForm, setShowAlertForm] = useState(false)
  const [viewMode, setViewMode] = useState('list') // 'list' or 'map'

  const handleCreateAlertSuccess = () => {
    setShowAlertForm(false)
    // Alerts will refresh automatically via context
  }

  const filteredAlerts = alerts.filter(alert => {
    // Type filter
    if (filters.types.length > 0 && !filters.types.includes(alert.type)) {
      return false
    }
    
    // Severity filter
    if (filters.severity && alert.severity !== filters.severity) {
      return false
    }
    
    // Verified only filter
    if (filters.verifiedOnly && !alert.verification?.verified) {
      return false
    }
    
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Alerts</h1>
            <p className="text-gray-600 mt-2">
              Real-time safety information from your community
            </p>
          </div>
          
          <div className="flex space-x-3 mt-4 sm:mt-0">
            {/* View Toggle */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-red-100 text-red-700' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                🗺️ Map
              </button>
            </div>

            {/* Create Alert Button */}
            <button
              onClick={() => setShowAlertForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors flex items-center space-x-2"
            >
              <span>📝</span>
              <span>Create Alert</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <AlertFilters filters={filters} onFiltersChange={updateFilters} />

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 text-red-700">
              <span>⚠️</span>
              <div>
                <p className="font-medium">Error loading alerts</p>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Alert Form Modal */}
        {showAlertForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AlertForm 
                onSuccess={handleCreateAlertSuccess}
                onCancel={() => setShowAlertForm(false)}
              />
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner text="Loading community alerts..." />
          </div>
        ) : filteredAlerts.length > 0 ? (
          <div className="grid gap-6">
            {filteredAlerts.map((alert) => (
              <AlertCard key={alert.alertId} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Alerts Found
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {filters.types.length > 0 || filters.severity || filters.verifiedOnly
                ? "Try adjusting your filters to see more alerts."
                : "There are no alerts in your area yet. Be the first to report an incident."
              }
            </p>
            <button
              onClick={() => setShowAlertForm(true)}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Create First Alert
            </button>
          </div>
        )}

        {/* Load More (if implemented) */}
        {filteredAlerts.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={() => {/* Implement load more */}}
              className="bg-white border border-gray-300 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Load More Alerts
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Alerts;