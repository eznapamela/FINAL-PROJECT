import React, { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/common/LoadingSpinner'

const MissingPersons = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('search') // 'search' or 'report'
  const [loading, setLoading] = useState(false)
  const [cases, setCases] = useState([])

  // Mock data - replace with actual API calls
  const mockCases = [
    {
      id: 'case_001',
      name: 'John Kamau',
      age: 28,
      lastSeen: '2024-01-15T14:30:00Z',
      location: 'Nairobi Central',
      description: 'Last seen wearing blue jeans and white t-shirt',
      status: 'missing',
      contact: 'encrypted_contact_123'
    },
    {
      id: 'case_002',
      name: 'Mary Wanjiku',
      age: 32,
      lastSeen: '2024-01-14T10:00:00Z',
      location: 'Kibera Area',
      description: 'Carrying a red backpack, medical condition',
      status: 'search_ongoing',
      contact: 'encrypted_contact_456'
    }
  ]

  const [reportForm, setReportForm] = useState({
    name: '',
    age: '',
    gender: '',
    physicalDescription: '',
    lastSeenClothing: '',
    distinguishingFeatures: '',
    lastSeenLocation: '',
    lastSeenTime: '',
    circumstances: '',
    contactInfo: ''
  })

  const handleSearch = async (filters = {}) => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setCases(mockCases)
      setLoading(false)
    }, 1000)
  }

  const handleReportSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    // Validate form
    if (!reportForm.name || !reportForm.lastSeenLocation || !reportForm.lastSeenTime) {
      alert('Please fill in all required fields')
      setLoading(false)
      return
    }

    // Simulate API call
    setTimeout(() => {
      alert('Missing person report submitted successfully. The community has been alerted.')
      setReportForm({
        name: '',
        age: '',
        gender: '',
        physicalDescription: '',
        lastSeenClothing: '',
        distinguishingFeatures: '',
        lastSeenLocation: '',
        lastSeenTime: '',
        circumstances: '',
        contactInfo: ''
      })
      setLoading(false)
    }, 1500)
  }

  const handleInputChange = (field, value) => {
    setReportForm(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Missing Persons
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Community-powered missing persons registry. Report missing individuals 
            and help reunite families while protecting privacy.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('search')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'search'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              🔍 Search Cases
            </button>
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'report'
                  ? 'border-b-2 border-red-500 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📝 Report Missing
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'search' ? (
              <div>
                <div className="flex space-x-4 mb-6">
                  <input
                    type="text"
                    placeholder="Search by name, location..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <button
                    onClick={() => handleSearch()}
                    className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Search
                  </button>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner text="Searching cases..." />
                  </div>
                ) : cases.length > 0 ? (
                  <div className="space-y-4">
                    {cases.map((caseItem) => (
                      <div
                        key={caseItem.id}
                        className="border border-gray-200 rounded-lg p-4 hover:border-red-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {caseItem.name}
                              </h3>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                {caseItem.age} years
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                caseItem.status === 'missing' 
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {caseItem.status.replace('_', ' ')}
                              </span>
                            </div>
                            
                            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                              <div>
                                <p><strong>Last Seen:</strong> {new Date(caseItem.lastSeen).toLocaleString()}</p>
                                <p><strong>Location:</strong> {caseItem.location}</p>
                              </div>
                              <div>
                                <p><strong>Description:</strong> {caseItem.description}</p>
                              </div>
                            </div>

                            {caseItem.contact && (
                              <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                                <p className="text-sm text-green-700">
                                  <strong>Secure Contact:</strong> Information available to verified responders
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4">
                          <button className="flex-1 bg-red-600 text-white py-2 px-3 rounded text-sm hover:bg-red-700 transition-colors">
                            🚨 I Have Information
                          </button>
                          <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 transition-colors">
                            📍 Seen This Person
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-6xl mb-4">👤</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No Cases Found
                    </h3>
                    <p className="text-gray-600">
                      {cases.length === 0 
                        ? "There are no active missing persons cases in your area."
                        : "No cases match your search criteria."
                      }
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleReportSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={reportForm.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Age
                        </label>
                        <input
                          type="number"
                          value={reportForm.age}
                          onChange={(e) => handleInputChange('age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Gender
                        </label>
                        <select
                          value={reportForm.gender}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                          <option value="">Select</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Physical Description
                      </label>
                      <textarea
                        value={reportForm.physicalDescription}
                        onChange={(e) => handleInputChange('physicalDescription', e.target.value)}
                        rows="2"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Height, build, hair color, etc."
                      />
                    </div>
                  </div>

                  {/* Last Seen Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Last Seen</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location *
                      </label>
                      <input
                        type="text"
                        value={reportForm.lastSeenLocation}
                        onChange={(e) => handleInputChange('lastSeenLocation', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                        placeholder="Street, landmark, area"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date & Time *
                      </label>
                      <input
                        type="datetime-local"
                        value={reportForm.lastSeenTime}
                        onChange={(e) => handleInputChange('lastSeenTime', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Clothing Description
                      </label>
                      <input
                        type="text"
                        value={reportForm.lastSeenClothing}
                        onChange={(e) => handleInputChange('lastSeenClothing', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="What they were wearing"
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Distinguishing Features
                  </label>
                  <textarea
                    value={reportForm.distinguishingFeatures}
                    onChange={(e) => handleInputChange('distinguishingFeatures', e.target.value)}
                    rows="2"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Scars, tattoos, glasses, unique features..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Circumstances of Disappearance
                  </label>
                  <textarea
                    value={reportForm.circumstances}
                    onChange={(e) => handleInputChange('circumstances', e.target.value)}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="What were they doing? Who were they with? Any concerns?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Information (Encrypted)
                  </label>
                  <input
                    type="text"
                    value={reportForm.contactInfo}
                    onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="How responders can contact you securely"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This information is encrypted and only shared with verified responders
                  </p>
                </div>

                {/* Privacy Notice */}
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-blue-600">🔒</span>
                    <div className="text-sm text-blue-700">
                      <strong>Privacy Protected:</strong> All information is anonymized and encrypted. 
                      Your identity remains protected while helping reunite families.
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Submitting Report...</span>
                    </>
                  ) : (
                    <>
                      <span>🚨</span>
                      <span>Submit Missing Person Report</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Safety Information */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="font-semibold text-yellow-900 mb-3">Important Safety Notes</h3>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li className="flex items-start space-x-2">
              <span>✅</span>
              <span>Always contact official authorities for missing persons cases</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>🔒</span>
              <span>Your privacy and the missing person's privacy are protected</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>📞</span>
              <span>Verify information before sharing with authorities</span>
            </li>
            <li className="flex items-start space-x-2">
              <span>👁️</span>
              <span>Only share necessary information to protect vulnerable individuals</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default MissingPersons;