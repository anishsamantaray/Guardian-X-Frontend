'use client';

import { useEffect, useState } from 'react';
import { fetchDistanceFromHome } from '@/services/mapService';

export default function DistanceCard() {
  const [distance, setDistance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getDistance = async () => {
      try {
        const email = localStorage.getItem('email');
        if (!email) {
          console.warn("Email not found in localStorage.");
          setLoading(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (pos) => {
          const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            console.log("Calling fetchDistanceFromHome with:");
            const res = await fetchDistanceFromHome(lat, lng);
            const dist = res?.distance_from_home ?? null;
            setDistance(dist);
            setLoading(false);
          },
          (err) => {
            console.error("Geolocation error:", err);
            setLoading(false);
          },
          { enableHighAccuracy: true }
        );
      } catch (err) {
        console.error("Failed to calculate distance:", err);
        setLoading(false);
      }
    };

    getDistance();
  }, []);

  return (
    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-sm w-full max-w-8xl mx-auto text-center border border-gray-200">
      {loading ? (
        <span className="text-gray-400 text-sm">Calculating distance...</span>
      ) : distance !== null ? (
          <span className="flex justify-center items-center gap-2 text-sm sm:text-base text-gray-700">
         <span className="text-purple-600">
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
    <path
        d="M168 0C75.4 0 0 75.4 0 168c0 87.4 125.2 264.6 158.6 307.6a24 24 0 0 0 38.8 0C218.8 432.6 344 255.4 344 168 344 75.4 268.6 0 176 0h-8zm0 256a88 88 0 1 1 0-176 88 88 0 0 1 0 176z"/>
  </svg>
</span>
          You are{' '}
              <span className="font-semibold text-purple-600">
  {parseFloat(distance).toFixed(1)} km
</span>
          from home
        </span>
      ) : (
          <span className="text-red-500 text-sm">Location unavailable</span>
      )}
    </div>
  );
}
