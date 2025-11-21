import React from 'react'

const AlertFilters = ({ filters, onFiltersChange }) => {
  const alertTypes = [
    { value: 'violence', label: 'Violence', icon: '🔴' },
    { value: 'arrest', label: 'Arrest', icon: '👮' },
    { value: 'medical', label: 'Medical', icon: '🏥' },
    { value: 'checkpoint', label: 'Checkpoint', icon: '🚧' },
    { value: 'safe_zone', label: 'Safe Zones', icon: '🟢' },
    { value: 'danger_zone', label: 'Danger Zones', icon: '🔴' },
    { value: 'internet_shutdown', label: 'Internet', icon: '📵' }
  ]

  const severityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ]

  const radiusOptions = [1, 5, 10, 25, 50]

  const handleTypeToggle = (type) => {
    const newTypes = filters.types.includes(type)
      ? filters.types.filter(t => t !== type)
      : [...filters.types, type]
    
    onFiltersChange({ ...filters, types: newTypes })
  }

  const handleSeverityChange = (severity) => {
    onFiltersChange({ ...filters, severity: severity === filters.severity ? null : severity })
  }

  const handleRadiusChange = (radius) => {
    onFiltersChange({ ...filters, radius })
  }

  const toggleVerifiedOnly = () => {
    onFiltersChange({ ...filters, verifiedOnly: !filters.verifiedOnly })
  }

  const clearFilters = () => {
    onFiltersChange({
      types: [],
      severity: null,
      radius: 10,
      verifiedOnly: false
    })
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        <button
          onClick={clearFilters}
          className="text-sm text-red-600 hover:text-red-700"
        >
          Clear All
        </button>
      </div>

      {/* Alert Types */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Alert Types
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {alertTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => handleTypeToggle(type.value)}
              className={`flex items-center space-x-1 p-2 border rounded-md text-sm transition-colors ${
                filters.types.includes(type.value)
                  ? 'border-red-500 bg-red-50 text-red-700'
                  : 'border-gray-300 text-gray-700 hover:border-gray-400'
              }`}
            >
              <span>{type.icon}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Severity Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Severity
          </label>
          <div className="space-y-1">
            {severityLevels.map((level) => (
              <button
                key={level.value}
                onClick={() => handleSeverityChange(level.value)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.severity === level.value
                    ? 'bg-red-100 text-red-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>

        {/* Radius Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Radius (km)
          </label>
          <div className="space-y-1">
            {radiusOptions.map((radius) => (
              <button
                key={radius}
                onClick={() => handleRadiusChange(radius)}
                className={`block w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  filters.radius === radius
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {radius} km
              </button>
            ))}
          </div>
        </div>

        {/* Additional Filters */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.verifiedOnly}
                onChange={toggleVerifiedOnly}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Verified alerts only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Active Filters Summary */}
      {(filters.types.length > 0 || filters.severity || filters.verifiedOnly) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Active filters:</p>
          <div className="flex flex-wrap gap-2">
            {filters.types.map(type => (
              <span key={type} className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">
                {alertTypes.find(t => t.value === type)?.label}
              </span>
            ))}
            {filters.severity && (
              <span className="bg-orange-100 text-orange-700 px-2 py-1 rounded-full text-xs">
                {filters.severity} severity
              </span>
            )}
            {filters.verifiedOnly && (
              <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">
                Verified only
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default AlertFilters;