import React, { createContext, useContext, useReducer } from 'react'

const MapContext = createContext()

const mapReducer = (state, action) => {
  switch (action.type) {
    case 'SET_VIEWPORT':
      return { ...state, viewport: action.payload }
    case 'SET_SELECTED_ALERT':
      return { ...state, selectedAlert: action.payload }
    case 'SET_ZOOM':
      return { ...state, viewport: { ...state.viewport, zoom: action.payload } }
    case 'SET_CENTER':
      return { ...state, viewport: { ...state.viewport, ...action.payload } }
    default:
      return state
  }
}

const initialState = {
  viewport: {
    center: [-1.2921, 36.8219], // Nairobi coordinates
    zoom: 12
  },
  selectedAlert: null,
  layers: {
    alerts: true,
    sos: true,
    safeZones: true,
    dangerZones: true
  }
}

export const MapProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mapReducer, initialState)

  const setViewport = (viewport) => {
    dispatch({ type: 'SET_VIEWPORT', payload: viewport })
  }

  const setSelectedAlert = (alert) => {
    dispatch({ type: 'SET_SELECTED_ALERT', payload: alert })
  }

  const setZoom = (zoom) => {
    dispatch({ type: 'SET_ZOOM', payload: zoom })
  }

  const setCenter = (center) => {
    dispatch({ type: 'SET_CENTER', payload: center })
  }

  const value = {
    ...state,
    setViewport,
    setSelectedAlert,
    setZoom,
    setCenter
  }

  return (
    <MapContext.Provider value={value}>
      {children}
    </MapContext.Provider>
  )
}

export const useMap = () => {
  const context = useContext(MapContext)
  if (!context) {
    throw new Error('useMap must be used within a MapProvider')
  }
  return context
};