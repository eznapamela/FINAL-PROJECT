// client/src/hooks/useSOS.js
import { useState, useCallback } from 'react';
import { sosService } from '../services/api';
import { useSocket } from './useSocket';

export const useSOS = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();

  const sendSOS = useCallback(async (sosData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await sosService.createSOS(sosData);

      if (response.success) {
        // Socket will handle real-time updates
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to send SOS');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getNearbySOS = useCallback(async (location, radius = 10) => {
    try {
      const response = await sosService.getNearbySOS({
        lat: location.lat,
        lng: location.lng,
        radius
      });

      if (response.success) {
        return response.data;
      } else {
        throw new Error(response.error || 'Failed to fetch SOS alerts');
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const respondToSOS = useCallback(async (sosId, responseType) => {
    try {
      // This would update the SOS request with responder info
      if (socket) {
        socket.emit('sos_response', {
          sosId,
          responseType,
          timestamp: new Date()
        });
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [socket]);

  return {
    sendSOS,
    getNearbySOS,
    respondToSOS,
    loading,
    error
  };
};