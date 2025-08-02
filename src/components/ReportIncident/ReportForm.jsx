'use client';

import React, { useState, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import IncidentDatePicker from '@/components/ReportIncident/IncidentDateModal';
import IncidentLocationPicker from '@/components/ReportIncident/incidentLocation';
import { autocomplete, getPlaceDetails } from '@/services/mapService';
import { reportIncident } from '@/services/incidentService';

export default function ReportForm({ onSuccess }) {
    const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
   const stored = localStorage.getItem('email');
   if (stored) setUserEmail(stored);
 }, []);
  const [incident, setIncident] = useState({
    date: '',
    time: '',
    lat: null,
    long: null,
    type: '',
    description: ''
  });
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (!addressInput.trim() || addressInput.startsWith('📍')) return;
    let active = true;
    (async () => {
      try {
        const results = await autocomplete(addressInput);
        if (active) setSuggestions(results);
      } catch {
        if (active) setSuggestions([]);
      }
    })();
    return () => { active = false; };
  }, [addressInput]);

  const handleDateChange = ({ date, time }) => {
    setIncident(prev => ({ ...prev, date, time }));
  };

  const pickSuggestion = async (placeId, description) => {
    setAddressInput(description);
    setSuggestions([]);
    try {
      const { latitude, longitude } = await getPlaceDetails(placeId);
      setIncident(prev => ({ ...prev, lat: latitude, long: longitude }));
    } catch {
      alert('Failed to fetch coordinates.');
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        setIncident(prev => ({ ...prev, lat: coords.latitude, long: coords.longitude }));
        setAddressInput('📍 Using current location');
        setSuggestions([]);
      },
      () => alert('Unable to fetch current location.')
    );
  };

  const types = [
    { key: 'harassment',  label: 'Harassment',  icon: '⚠️' },
    { key: 'stalking',    label: 'Stalking',    icon: '👁️' },
    { key: 'unsafe_area', label: 'Unsafe Area', icon: '⚠️' },
    { key: 'other',       label: 'Other',       icon: '⋯' }
  ];

  const handleTypeClick = key =>
    setIncident(prev => ({ ...prev, type: key }));

  const handleDescChange = e =>
    setIncident(prev => ({ ...prev, description: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    const ts = new Date(`${incident.date}T${incident.time}`);
    if (isNaN(ts.getTime())) {
      alert('Invalid date or time');
      return;
    }

    const payload = {
      email: userEmail,
      incident_type: incident.type,
      description: incident.description,
      location: {
        latitude: incident.lat,
        longitude: incident.long
      },
      timestamp: ts.toISOString()
    };

    try {
      await reportIncident(payload);
      onSuccess && onSuccess();
    } catch {
      alert('Failed to report incident.');
    }
  };

  const isDisabled =
    !incident.date ||
    !incident.time ||
    incident.lat == null ||
    incident.long == null ||
    !incident.type;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <IncidentDatePicker
        initialDate={incident.date}
        initialTime={incident.time}
        onChange={handleDateChange}
      />

      <IncidentLocationPicker
        addressInput={addressInput}
        setAddressInput={setAddressInput}
        suggestions={suggestions}
        pickSuggestion={pickSuggestion}
        useCurrentLocation={handleUseCurrentLocation}
      />

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-2">Incident Type</h2>
        <div className="grid grid-cols-2 gap-4">
          {types.map(t => (
            <button
              key={t.key}
              type="button"
              onClick={() => handleTypeClick(t.key)}
              className={`
                flex items-center justify-center space-x-2 px-4 py-3 border rounded-lg hover:bg-gray-50
                ${incident.type === t.key
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200'}
              `}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium mb-1">Description</h2>
        <p className="text-sm text-gray-500 mb-2">Optional: Add any details</p>
        <textarea
          value={incident.description}
          onChange={handleDescChange}
          placeholder="Describe what happened (optional)"
          className="w-full h-24 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isDisabled}
        className="
          w-full py-3 bg-gradient-to-r from-purple-500 to-red-500 text-white
          rounded-lg flex items-center justify-center space-x-2 disabled:opacity-50
        "
      >
        <PaperAirplaneIcon className="w-5 h-5 transform -rotate-45" />
        <span>Report Incident</span>
      </button>
    </form>
  );
}
