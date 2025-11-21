// client/src/contexts/AlertContext.jsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { alertService } from '../services/api';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSocket } from '../hooks/useSocket';

export const AlertContext = createContext();


const alertReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ALERTS':
      return { ...state, alerts: action.payload, loading: false };
    case 'ADD_ALERT':
      return { ...state, alerts: [action.payload, ...state.alerts] };
    case 'UPDATE_ALERT':
      return {
        ...state,
        alerts: state.alerts.map(alert =>
          alert.alertId === action.payload.alertId ? action.payload : alert
        )
      };
    case 'SET_FILTERS':
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    default:
      return state;
  }
};

const initialState = {
  alerts: [],
  loading: false,
  error: null,
  filters: {
    types: [],
    severity: null,
    radius: 10,
    verifiedOnly: false
  }
};

export const AlertProvider = ({ children }) => {
  const [state, dispatch] = useReducer(alertReducer, initialState);
  const { location } = useGeolocation();
  const { socket } = useSocket();

const fetchAlerts = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      const params = {
        ...state.filters,
        lat: location?.lat,
        lng: location?.lng
      };

      const response = await alertService.getAlerts(params);
      
      if (response.success) {
        dispatch({ type: 'SET_ALERTS', payload: response.data });
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
    }
  };


  useEffect(() => {
    fetchAlerts();
  }, [state.filters, location]);

  useEffect(() => {
    if (!socket) return;

    socket.on('new_alert', (alert) => {
      dispatch({ type: 'ADD_ALERT', payload: alert });
    });

    socket.on('alert_verified', (data) => {
      dispatch({ type: 'UPDATE_ALERT', payload: data.alert });
    });

    return () => {
      socket.off('new_alert');
      socket.off('alert_verified');
    };
  }, [socket]);

  
  const createAlert = async (alertData) => {
    try {
      const response = await alertService.createAlert(alertData);
      
      if (response.success) {
        dispatch({ type: 'ADD_ALERT', payload: response.data });
        return response.data;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const verifyAlert = async (alertId, verificationData) => {
    try {
      const response = await alertService.verifyAlert(alertId, verificationData);
      
      if (response.success) {
        // Alert will be updated via socket
        return response.data;
      }
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const updateFilters = (newFilters) => {
    dispatch({ type: 'SET_FILTERS', payload: newFilters });
  };

  const value = {
    ...state,
    createAlert,
    verifyAlert,
    updateFilters,
    fetchAlerts
  };

  return (
    <AlertContext.Provider value={value}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlerts must be used within an AlertProvider');
  }
  return context;
};