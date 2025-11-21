import { io } from 'socket.io-client'

class SocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
  }

  connect() {
    if (this.socket) return this.socket

    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000'
    const token = localStorage.getItem('anonymousToken')

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling']
    })

    this.socket.on('connect', () => {
      this.isConnected = true
      console.log('Socket connected')
    })

    this.socket.on('disconnect', () => {
      this.isConnected = false
      console.log('Socket disconnected')
    })

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  getSocket() {
    return this.socket
  }

  // Alert events
  subscribeToAlerts(callback) {
    if (this.socket) {
      this.socket.on('new_alert', callback)
    }
  }

  unsubscribeFromAlerts(callback) {
    if (this.socket) {
      this.socket.off('new_alert', callback)
    }
  }

  // SOS events
  subscribeToSOS(callback) {
    if (this.socket) {
      this.socket.on('sos_alert', callback)
    }
  }

  unsubscribeFromSOS(callback) {
    if (this.socket) {
      this.socket.off('sos_alert', callback)
    }
  }

  // Verification events
  subscribeToVerification(callback) {
    if (this.socket) {
      this.socket.on('alert_verified', callback)
    }
  }

  unsubscribeFromVerification(callback) {
    if (this.socket) {
      this.socket.off('alert_verified', callback)
    }
  }
}

export const socketService = new SocketService();