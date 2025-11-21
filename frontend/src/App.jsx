import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router'
import { AuthProvider } from './contexts/AuthContext'
import { AlertProvider } from './contexts/AlertContext'
import { MapProvider } from './contexts/MapContext'

// Pages
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import Map from './pages/Map'
import SOS from './pages/SOS'
import MissingPersons from './pages/MissingPersons'
import Settings from './pages/Settings'

// Components
import Header from './components/common/Header'
import Footer from './components/common/Footer'
import SOSButton from './components/sos/SOSButton'
import ErrorBoundary from './components/common/ErrorBoundary'

import './App.css'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <AuthProvider>
          <AlertProvider>
            <MapProvider>
              <div className="app">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/alerts" element={<Alerts />} />
                    <Route path="/map" element={<Map />} />
                    <Route path="/sos" element={<SOS />} />
                    <Route path="/missing" element={<MissingPersons />} />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
                <Footer />
                <SOSButton />
              </div>
            </MapProvider>
          </AlertProvider>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  )
}

export default App;