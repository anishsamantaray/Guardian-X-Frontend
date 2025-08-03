'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPinIcon } from '@heroicons/react/24/solid';

export default function AddressEdit({
  addressInput,
  setAddressInput,
  suggestions,
  setSuggestions,
  setHomeAddress,
  locationDisplay,
  setLocationDisplay,
  pickSuggestion,
  useCurrentLocation
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

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
    setAddressInput('📍 Using current location');
    useCurrentLocation();
  };

  return (
    <div ref={containerRef} className="relative">
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>

      <div className="relative">
        <input
            type="text"
            value={addressInput}
            onChange={handleInputChange}
            onFocus={() => setOpen(addressInput.length > 0)}
            placeholder="Enter location or address"
            className="w-full px-4 pr-10 py-2 rounded-xl border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <MapPinIcon className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2"/>
      </div>

      {open && (
          <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl max-h-60 overflow-auto shadow-lg">
            <li
                onClick={handleUseCurrent}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
            >
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
