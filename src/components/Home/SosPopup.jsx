'use client';

import React, { useEffect, useState, useRef } from 'react';
import { triggerSOS, endSOSEvent, sendSOSHeartbeat } from '@/services/sosService';

export default function SosPopup({ isOpen, onClose, email, latitude, longitude }) {
  const [confirmed, setConfirmed] = useState(false);
  const [countdown, setCountdown] = useState(180); // 3 minutes = 180 seconds
  const timerRef = useRef(null);
  const heartbeatRef = useRef(null);

  const now = () => new Date().toISOString();

  // Handle SOS start
  const handleStartSOS = async () => {
    try {
      await triggerSOS({ email, latitude, longitude, timestamp: now() });
      setConfirmed(true);

      // Heartbeat every 30s
      heartbeatRef.current = setInterval(() => {
        sendSOSHeartbeat({ email, latitude, longitude, timestamp: now() });
      }, 30000);

      // Countdown every 1s
      timerRef.current = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to trigger SOS');
      onClose();
    }
  };

  // Handle end of SOS (timeout or user-initiated)
  const handleEndSOS = async () => {
    try {
      await endSOSEvent({ email, timestamp: now() });
    } catch (err) {
      console.error('Failed to end SOS');
    } finally {
      clearInterval(timerRef.current);
      clearInterval(heartbeatRef.current);
      setConfirmed(false);
      setCountdown(180);
      onClose();
    }
  };

  // Auto end after countdown
  useEffect(() => {
    if (confirmed && countdown === 0) {
      handleEndSOS();
    }
  }, [countdown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg text-center">
        {!confirmed ? (
          <>
            <h2 className="text-xl font-semibold mb-4">Confirm SOS Alert</h2>
            <p className="mb-6">Are you sure you want to raise an SOS alert?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleStartSOS}
                className="px-5 py-2 bg-red-600 text-white rounded-lg shadow"
              >
                Yes, Raise SOS
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2 border border-gray-400 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold mb-4 text-red-600">SOS Active</h2>
            <p className="text-lg mb-4">Time remaining: <span className="font-bold">{countdown}s</span></p>
            <button
              onClick={handleEndSOS}
              className="mt-2 px-5 py-2 bg-black text-white rounded-lg"
            >
              End SOS Now
            </button>
          </>
        )}
      </div>
    </div>
  );
}
