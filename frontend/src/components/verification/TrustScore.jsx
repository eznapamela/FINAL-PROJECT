import React from 'react'

const TrustScore = ({ score, size = 'medium' }) => {
  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    if (score >= 20) return 'text-orange-600 bg-orange-100'
    return 'text-red-600 bg-red-100'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Highly Trusted'
    if (score >= 60) return 'Trusted'
    if (score >= 40) return 'Neutral'
    if (score >= 20) return 'Low Trust'
    return 'New User'
  }

  const getSizeClasses = (size) => {
    const sizes = {
      small: 'w-6 h-6 text-xs',
      medium: 'w-8 h-8 text-sm',
      large: 'w-12 h-12 text-base'
    }
    return sizes[size] || sizes.medium
  }

  return (
    <div className="flex items-center space-x-2">
      <div 
        className={`${getSizeClasses(size)} rounded-full flex items-center justify-center font-semibold ${getScoreColor(score)}`}
        title={`Trust Score: ${score}/100 - ${getScoreLabel(score)}`}
      >
        {score}
      </div>
      <div className="text-sm text-gray-600">
        {getScoreLabel(score)}
      </div>
    </div>
  )
}

export default TrustScore;