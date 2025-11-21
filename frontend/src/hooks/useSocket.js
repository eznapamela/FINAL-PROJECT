import { useState, useEffect, useRef } from 'react'
import { socketService } from '../services/socket'

export const useSocket = () => {
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    const s = socketService.connect()
    socketRef.current = s
    setSocket(s)

    const handleConnect = () => {}
    const handleDisconnect = () => {}

    s.on('connect', handleConnect)
    s.on('disconnect', handleDisconnect)

    return () => {
      s.off('connect', handleConnect)
      s.off('disconnect', handleDisconnect)
      socketService.disconnect()
    }
  }, [])

  return { socket, socketRef }
}
