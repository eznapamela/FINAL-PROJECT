import React, { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth';
const Settings = () => {
  const { user, panicWipe } = useAuth()
  const [settings, setSettings] = useState({
    // Privacy Settings
    autoDeleteHours: 24,
    panicWipeEnabled: true,
    locationSharing: true,
    
    // Notification Settings
    alertNotifications: true,
    sosNotifications: true,
    verificationRequests: true,
    notificationRadius: 10,
    
    // Appearance
    darkMode: false,
    language: 'en',
    
    // Data Management
    exportData: false,
    clearHistory: false
  })

  const [activeSection, setActiveSection] = useState('privacy')
  const [saveStatus, setSaveStatus] = useState('')

  // Load settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('userSettings')
    if (savedSettings) {
      setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userSettings', JSON.stringify(settings))
  }, [settings])

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    setSaveStatus('Saving...')
    
    // Simulate API call
    setTimeout(() => {
      setSaveStatus('Settings saved successfully!')
      setTimeout(() => setSaveStatus(''), 3000)
    }, 1000)
  }

  const handleExportData = () => {
    // In a real app, this would generate a data export
    const exportData = {
      user: {
        anonymousId: user?.anonymousId,
        trustScore: 75
      },
      settings: settings,
      exportDate: new Date().toISOString()
    }
    
    const dataStr = JSON.stringify(exportData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    
    const link = document.createElement('a')
    link.href = URL.createObjectURL(dataBlob)
    link.download = `voices-under-fire-export-${new Date().getTime()}.json`
    link.click()
  }

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your local history? This action cannot be undone.')) {
      localStorage.removeItem('userSettings')
      sessionStorage.clear()
      setSettings({
        autoDeleteHours: 24,
        panicWipeEnabled: true,
        locationSharing: true,
        alertNotifications: true,
        sosNotifications: true,
        verificationRequests: true,
        notificationRadius: 10,
        darkMode: false,
        language: 'en',
        exportData: false,
        clearHistory: false
      })
      alert('Local history cleared successfully.')
    }
  }

  const sections = {
    privacy: {
      title: 'Privacy & Security',
      icon: '🔒',
      description: 'Control your data and security settings'
    },
    notifications: {
      title: 'Notifications',
      icon: '🔔',
      description: 'Manage alerts and notifications'
    },
    appearance: {
      title: 'Appearance',
      icon: '🎨',
      description: 'Customize the app appearance'
    },
    data: {
      title: 'Data Management',
      icon: '💾',
      description: 'Manage your data and exports'
    },
    emergency: {
      title: 'Emergency',
      icon: '🚨',
      description: 'Emergency actions and settings'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your privacy, notifications, and app preferences
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {Object.entries(sections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-3 border-b border-gray-200 last:border-b-0 transition-colors ${
                    activeSection === key
                      ? 'bg-red-50 text-red-700 border-red-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{section.icon}</span>
                    <div>
                      <div className="font-medium">{section.title}</div>
                      <div className="text-sm opacity-75">{section.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Anonymous Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-semibold text-green-900">Anonymous Mode</h4>
                  <p className="text-sm text-green-700">Your identity is protected</p>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                Device ID: {user?.deviceId?.substring(0, 8)}...
              </div>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {sections[activeSection].icon} {sections[activeSection].title}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {sections[activeSection].description}
                </p>
              </div>

              <div className="p-6">
                {activeSection === 'privacy' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Auto-Delete Alerts</div>
                          <div className="text-sm text-gray-600">
                            Automatically delete alerts after {settings.autoDeleteHours} hours
                          </div>
                        </div>
                        <select
                          value={settings.autoDeleteHours}
                          onChange={(e) => handleSettingChange('autoDeleteHours', parseInt(e.target.value))}
                          className="ml-4 px-3 py-1 border border-gray-300 rounded-md text-sm"
                        >
                          <option value={6}>6 hours</option>
                          <option value={12}>12 hours</option>
                          <option value={24}>24 hours</option>
                          <option value={48}>48 hours</option>
                          <option value={168}>7 days</option>
                        </select>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Panic Wipe</div>
                          <div className="text-sm text-gray-600">
                            Emergency button to clear all local data immediately
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('panicWipeEnabled', !settings.panicWipeEnabled)}
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            settings.panicWipeEnabled ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.panicWipeEnabled ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Location Sharing</div>
                          <div className="text-sm text-gray-600">
                            Share your approximate location for relevant alerts
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('locationSharing', !settings.locationSharing)}
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            settings.locationSharing ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.locationSharing ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>
                  </div>
                )}

                {activeSection === 'notifications' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Alert Notifications</div>
                          <div className="text-sm text-gray-600">
                            Receive notifications for new alerts in your area
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('alertNotifications', !settings.alertNotifications)}
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            settings.alertNotifications ? 'bg-green-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.alertNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">SOS Notifications</div>
                          <div className="text-sm text-gray-600">
                            Receive emergency SOS alerts from nearby users
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('sosNotifications', !settings.sosNotifications)}
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            settings.sosNotifications ? 'bg-red-600' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.sosNotifications ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="flex items-center space-x-3">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">Notification Radius</div>
                          <div className="text-sm text-gray-600">
                            Receive alerts within {settings.notificationRadius} km of your location
                          </div>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={settings.notificationRadius}
                          onChange={(e) => handleSettingChange('notificationRadius', parseInt(e.target.value))}
                          className="w-32"
                        />
                        <span className="w-12 text-sm text-gray-600">
                          {settings.notificationRadius} km
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {activeSection === 'appearance' && (
                  <div className="space-y-6">
                    <div>
                      <label className="flex items-center justify-between cursor-pointer">
                        <div>
                          <div className="font-medium text-gray-900">Dark Mode</div>
                          <div className="text-sm text-gray-600">
                            Use dark theme for better visibility in low light
                          </div>
                        </div>
                        <button
                          onClick={() => handleSettingChange('darkMode', !settings.darkMode)}
                          className={`ml-4 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
                            settings.darkMode ? 'bg-gray-900' : 'bg-gray-200'
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                              settings.darkMode ? 'translate-x-5' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      </label>
                    </div>

                    <div>
                      <label className="block font-medium text-gray-900 mb-2">
                        Language
                      </label>
                      <select
                        value={settings.language}
                        onChange={(e) => handleSettingChange('language', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        <option value="en">English</option>
                        <option value="sw">Swahili</option>
                        <option value="fr">French</option>
                        <option value="es">Spanish</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeSection === 'data' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Data Export</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Export your anonymous activity data for personal records
                      </p>
                      <button
                        onClick={handleExportData}
                        className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        📥 Export My Data
                      </button>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-3">Clear Local History</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Delete all local data and settings from this device
                      </p>
                      <button
                        onClick={handleClearHistory}
                        className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors"
                      >
                        🗑️ Clear Local Data
                      </button>
                    </div>
                  </div>
                )}

                {activeSection === 'emergency' && (
                  <div className="space-y-6">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <h3 className="font-semibold text-red-900 mb-2">Emergency Panic Wipe</h3>
                      <p className="text-red-700 mb-4">
                        This will immediately clear all local data, including your anonymous 
                        session, settings, and history. This action cannot be undone.
                      </p>
                      <button
                        onClick={() => {
                          if (window.confirm('🚨 EMERGENCY WIPE 🚨\n\nThis will immediately delete ALL local data and log you out. Are you absolutely sure?')) {
                            panicWipe()
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors w-full"
                      >
                        🚨 EMERGENCY PANIC WIPE
                      </button>
                    </div>

                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <h3 className="font-semibold text-yellow-900 mb-2">Safety Information</h3>
                      <ul className="space-y-2 text-sm text-yellow-800">
                        <li>• Your data is automatically encrypted and anonymized</li>
                        <li>• No personal information is ever stored on our servers</li>
                        <li>• All alerts expire automatically based on your settings</li>
                        <li>• Your location data is approximate and never precise</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              {/* Save Button */}
              {activeSection !== 'emergency' && (
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50 rounded-b-lg">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {saveStatus || 'Changes are saved automatically'}
                    </div>
                    <button
                      onClick={handleSaveSettings}
                      className="bg-red-600 hover:bg-red-700 text-white py-2 px-6 rounded-md transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings;