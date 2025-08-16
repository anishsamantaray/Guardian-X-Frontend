'use client';

import React, { useEffect, useState } from 'react';
import SOSButton from '@/components/Home/Sos';
import SosPopup from '@/components/Home/SosPopup';

export default function SOSPage() {
  const [popupOpen, setPopupOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) setEmail(storedEmail);

    // Get user's geolocation
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ latitude, longitude });
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  return (
    <>
      <SOSButton onClick={() => setPopupOpen(true)} />
      <SosPopup
        isOpen={popupOpen}
        onClose={() => setPopupOpen(false)}
        email={email}
        latitude={location.latitude}
        longitude={location.longitude}
      />
    </>
  );
}
