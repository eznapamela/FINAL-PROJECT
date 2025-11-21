const generateAnonymousId = () => {
  return `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateAlertId = () => {
  return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const generateSOSId = () => {
  return `sos_${Date.now()}`;
};

const generateCaseId = () => {
  return `case_${Date.now()}`;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

const formatTimeAgo = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffInSeconds = Math.floor((now - time) / 1000);
  
  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
};

const calculateTrustScore = (userActivity) => {
  let score = 50; // Base score
  
  // Positive factors
  if (userActivity.verifiedAlerts > 0) {
    score += Math.min(userActivity.verifiedAlerts * 5, 30);
  }
  
  if (userActivity.helpfulVerifications > 0) {
    score += Math.min(userActivity.helpfulVerifications * 3, 15);
  }
  
  // Negative factors
  if (userActivity.rejectedAlerts > 0) {
    score -= Math.min(userActivity.rejectedAlerts * 10, 40);
  }
  
  return Math.max(0, Math.min(100, score));
};

module.exports = {
  generateAnonymousId,
  generateAlertId,
  generateSOSId,
  generateCaseId,
  sanitizeInput,
  formatTimeAgo,
  calculateTrustScore
};