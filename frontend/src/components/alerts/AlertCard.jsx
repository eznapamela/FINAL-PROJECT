import React, { useState } from 'react'
import { useVerification } from '../../hooks/useVerification'

const AlertCard = ({ alert, onVerify }) => {
  const [showVerifyModal, setShowVerifyModal] = useState(false)
  const { verifyAlert, loading } = useVerification()

  const severityColors = {
    critical: "bg-red-500",
    high: "bg-orange-500",
    medium: "bg-yellow-500",
    low: "bg-green-500"
  }

  const icons = {
    violence: "🔴",
    arrest: "👮",
    medical: "🏥",
    checkpoint: "🚧",
    safe_zone: "🟢",
    danger_zone: "⚠️",
    internet_shutdown: "📵",
    other: "⚠️"
  }

  const handleVerify = async (type, level) => {
    await verifyAlert(alert.alertId, {
      verificationType: type,
      confidence: level,
      additionalInfo: ''
    })
    setShowVerifyModal(false)
    onVerify?.(alert.alertId)
  }

  const timeAgo = (timestamp) => {
    const diffMin = Math.floor((Date.now() - new Date(timestamp)) / 60000)
    if (diffMin < 1) return 'Just now'
    if (diffMin < 60) return `${diffMin}m ago`
    if (diffMin < 1440) return `${Math.floor(diffMin / 60)}h ago`
    return `${Math.floor(diffMin / 1440)}d ago`
  }

  return (
    <>
      <div className="backdrop-blur-md bg-white/70 rounded-xl shadow-md border border-gray-200 p-5 transition hover:shadow-lg hover:-translate-y-1 duration-200">

        {/* Header Row */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{icons[alert.type]}</div>

            <div>
              <h3 className="font-semibold text-gray-900 capitalize">
                {alert.type.replace("_", " ")}
              </h3>

              <p className="text-xs text-gray-500">
                {timeAgo(alert.createdAt)} • {alert.location?.address || "Unknown location"}
              </p>
            </div>
          </div>

          <span className={`text-white text-xs px-3 py-1 rounded-full ${severityColors[alert.severity]}`}>
            {alert.severity}
          </span>
        </div>

        {/* Description */}
        <p className="mt-3 text-gray-700 leading-relaxed">
          {alert.description}
        </p>

        {/* Footer Actions */}
        <div className="mt-4 flex justify-between items-center text-sm">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowVerifyModal(true)}
              disabled={loading}
              className="text-blue-600 font-medium hover:text-blue-700 transition"
            >
              Verify
            </button>

            <button className="text-gray-600 hover:text-gray-800 transition">
              Share
            </button>

            {alert.verification?.count > 0 && (
              <span className="text-gray-500">
                {alert.verification.count} verification(s)
              </span>
            )}
          </div>

          <span className="text-xs text-gray-400">
            Expires {timeAgo(alert.expiresAt)}
          </span>
        </div>
      </div>

      {/* Modal */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm p-6 shadow-lg animate-fadeIn">

            <h2 className="text-lg font-semibold mb-2">Verify Alert</h2>
            <p className="text-sm text-gray-500 mb-4">
              Can you confirm this information? Your verification helps protect the community.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleVerify("confirm", "high")}
                className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
              >
                Confirm as True
              </button>

              <button
                onClick={() => handleVerify("deny", "high")}
                className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition"
              >
                Mark as False
              </button>

              <button
                onClick={() => handleVerify("update", "medium")}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Add More Info
              </button>
            </div>

            <button
              onClick={() => setShowVerifyModal(false)}
              className="mt-4 w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AlertCard
