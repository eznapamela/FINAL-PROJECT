import { useState, useEffect, useCallback } from 'react'
import { storageService } from '../services/storage'

export const useOffline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [offlineQueue, setOfflineQueue] = useState([])

  useEffect(() => {
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Load offline queue from storage
    const savedQueue = storageService.getItem('offlineQueue') || []
    setOfflineQueue(savedQueue)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  const addToOfflineQueue = useCallback((action, data) => {
    const newItem = {
      id: Date.now().toString(),
      action,
      data,
      timestamp: new Date().toISOString()
    }
    
    const updatedQueue = [...offlineQueue, newItem]
    setOfflineQueue(updatedQueue)
    storageService.setItem('offlineQueue', updatedQueue)
  }, [offlineQueue])

  const processOfflineQueue = useCallback(async () => {
    if (offlineQueue.length === 0 || !isOnline) return

    const successful = []
    const failed = []

    for (const item of offlineQueue) {
      try {
        // Here you would make the actual API call based on the action
        console.log('Processing offline item:', item)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 100))
        successful.push(item.id)
      } catch (error) {
        failed.push(item.id)
      }
    }

    // Remove successful items from queue
    const remainingQueue = offlineQueue.filter(item => !successful.includes(item.id))
    setOfflineQueue(remainingQueue)
    storageService.setItem('offlineQueue', remainingQueue)

    return { successful: successful.length, failed: failed.length }
  }, [offlineQueue, isOnline])

  const clearOfflineQueue = useCallback(() => {
    setOfflineQueue([])
    storageService.setItem('offlineQueue', [])
  }, [])

  return {
    isOnline,
    offlineQueue,
    addToOfflineQueue,
    processOfflineQueue,
    clearOfflineQueue
  }
};