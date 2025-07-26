'use client';

import React, { useState, useRef } from 'react';
import QuickActionCard from '@/components/Home/QuickActionCard';

export default function QuickActions() {
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);
  const audioRef = useRef(null);

  const playSiren = () => {
    const audio = new Audio('/audios/loud_alarm_extended.mp3');
    audio.loop = true;
    audio.play().then(() => {
      setIsSirenPlaying(true);
      audioRef.current = audio;
    }).catch((e) => console.error('Playback failed', e));
  };

  const stopSiren = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setIsSirenPlaying(false);
  };

  const ACTIONS = [
    {
      icon: '/telephone_transparent.png',
      iconBg: 'bg-green-100',
      title: 'Emergency Call',
      subtitle: 'Call 112',
      path: 'tel:112',
    },
    {
      icon: '/violet_siren_transparent.png',
      iconBg: 'bg-purple-100',
      title: 'Siren Alarm',
      subtitle: 'Sound loud alert',
      customAction: playSiren,
    },
    {
      icon: '/bell_transparent_bg.png',
      iconBg: 'bg-red-100',
      title: 'Fake Call',
      subtitle: 'Simulate call',
      path: '/fake-call',
    },
  ];

  return (
    <section className="mt-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-lg font-semibold mb-4 text-gray-700 dark:text-gray-200">
        Quick Actions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {ACTIONS.map((a) => (
          <QuickActionCard key={a.title} {...a} />
        ))}
      </div>

      {/* Simple popup */}
      {isSirenPlaying && (
  <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl px-8 py-6 w-80 flex flex-col items-center">
      <img src="/violet_siren_transparent.png" alt="Siren Icon" className="w-12 h-12 mb-4" />

      <h3 className="text-lg font-bold text-red-600 dark:text-red-400 mb-1">
        Siren is Active
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-300 text-center mb-4">
        A loud alert is sounding. Tap below to stop it.
      </p>

      <button
        onClick={stopSiren}
        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg shadow transition"
      >
        Stop Siren
      </button>
    </div>
  </div>
)}
    </section>
  );
}
