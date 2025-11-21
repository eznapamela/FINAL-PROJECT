// client/src/components/sos/SOSButton.jsx
import React, { useState } from 'react';
import { useSOS } from '../../hooks/useSOS';
import { useGeolocation } from '../../hooks/useGeolocation';
import SOSModal from './SOSModal';

const SOSButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { sendSOS, loading } = useSOS();
  const { location, getLocation } = useGeolocation();

  const handleSOSPress = () => {
    setIsModalOpen(true);
  };

  const handleSOSSubmit = async (sosData) => {
    try {
      const currentLocation = location || await getLocation();
      
      await sendSOS({
        ...sosData,
        location: {
          coordinates: [currentLocation.lng, currentLocation.lat],
          accuracy: currentLocation.accuracy
        }
      });
      
      setIsModalOpen(false);
      
      // Show success message
      alert('SOS alert sent successfully! Help is on the way.');
    } catch (error) {
      console.error('SOS submission error:', error);
      alert('Failed to send SOS. Please try again.');
    }
  };

  return (
    <>
      <button
        onClick={handleSOSPress}
        disabled={loading}
        className="sos-button"
        aria-label="Send emergency SOS"
      >
        <div className="sos-button-inner">
          <span className="sos-text">SOS</span>
          <div className="pulse-ring"></div>
        </div>
      </button>

      <SOSModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSOSSubmit}
        loading={loading}
      />

      <style jsx>{`
        .sos-button {
          position: fixed;
          bottom: 2rem;
          right: 2rem;
          width: 80px;
          height: 80px;
          border: none;
          border-radius: 50%;
          background: linear-gradient(135deg, #DC2626, #EF4444);
          color: white;
          font-weight: bold;
          font-size: 1.2rem;
          cursor: pointer;
          box-shadow: 0 4px 20px rgba(220, 38, 38, 0.4);
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .sos-button:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 25px rgba(220, 38, 38, 0.6);
        }

        .sos-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .sos-button-inner {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sos-text {
          position: relative;
          z-index: 2;
        }

        .pulse-ring {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: rgba(220, 38, 38, 0.6);
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
};

export default SOSButton;