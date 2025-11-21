// Simple encryption for sensitive data (in a real app, use proper crypto)
const ENCRYPTION_KEY = 'vuf_secure_key_2024'

export const encryptionService = {
  encrypt: (text) => {
    try {
      // In a real application, use Web Crypto API or a proper library
      // This is a simple base64 encoding for demonstration
      return btoa(unescape(encodeURIComponent(text)))
    } catch (error) {
      console.error('Encryption error:', error)
      return text
    }
  },

  decrypt: (encryptedText) => {
    try {
      return decodeURIComponent(escape(atob(encryptedText)))
    } catch (error) {
      console.error('Decryption error:', error)
      return encryptedText
    }
  },

  hashData: (data) => {
    // Simple hash function for demonstration
    // In production, use a proper hashing algorithm
    let hash = 0
    const str = JSON.stringify(data)
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36)
  }
};