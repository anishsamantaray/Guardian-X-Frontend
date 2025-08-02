'use client';

import React, { useEffect, useState, useRef } from 'react';

export default function IncidentLocationPicker({
  addressInput,
  setAddressInput,
  suggestions,
  pickSuggestion,       // (place_id: string, description: string) => void
  useCurrentLocation,   // () => void
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // close dropdown on outside click
  useEffect(() => {
    const onClickOutside = e => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const handleInputChange = e => {
    setAddressInput(e.target.value);
    setOpen(e.target.value.length > 0);
  };

  const handleSelect = (place) => {
    setOpen(false);
    setAddressInput(place.description);
    pickSuggestion(place.place_id, place.description);
  };

  const handleUseCurrent = () => {
    setOpen(false);
    setAddressInput('Current location');
    useCurrentLocation();
  };

  return (
    <div ref={containerRef} className="bg-white rounded-lg shadow p-4 relative">
      <label htmlFor="incident-location" className="block text-sm font-medium text-gray-700 mb-1">
        Where did it happen?
      </label>
      <div className="relative">
        <input
          id="incident-location"
          type="text"
          value={addressInput}
          onChange={handleInputChange}
          onFocus={() => setOpen(addressInput.length > 0)}
          placeholder="Enter location or address"
          className="w-full px-4 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z" />
            <path d="M12 2C8.686 2 6 4.686 6 8c0 4.75 6 12 6 12s6-7.25 6-12c0-3.314-2.686-6-6-6z" />
          </svg>
        </div>
      </div>

      {open && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg max-h-60 overflow-auto shadow-lg">
          <li
            onClick={handleUseCurrent}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
          >
            {/*<svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 24 24">*/}
            {/*  <path d="M12 8a4 4 0 100 8 4 4 0 000-8z" />*/}
            {/*  <path fillRule="evenodd" d="M12 2a1 1 0 011 1v2a1 1 0 11-2 0V3a1 1 0 011-1zm0 16a1 1 0 011 1v2a1 1 0 11-2 0v-2a1 1 0 011-1zM4.22 4.22a1 1 0 011.415 0l1.414 1.414a1 1 0 11-1.414 1.414L4.22 5.636a1 1 0 010-1.415zm12.728 12.728a1 1 0 011.414 0l1.414 1.414a1 1 0 11-1.414 1.414l-1.414-1.414a1 1 0 010-1.414z" clipRule="evenodd"/>*/}
            {/*</svg>*/}
           📍 Use current location
          </li>

          {suggestions.map(s => (
            <li
              key={s.place_id}
              onClick={() => handleSelect(s)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
