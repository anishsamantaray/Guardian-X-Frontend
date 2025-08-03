'use client';

import React, { useEffect, useState } from 'react';
import { editUserProfile } from '@/services/userService';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon
} from '@heroicons/react/24/solid';

import AddressEdit from '@/components/Profile/AddressEdit';
import {
  autocomplete,
  getPlaceDetails,
  reverseGeocode
} from '@/services/mapService';

export default function EditProfileForm({ user: initialUser }) {
  const [user, setUser] = useState(initialUser);
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [locationDisplay, setLocationDisplay] = useState('');

  useEffect(() => {
  if (initialUser) {
    setUser(initialUser);
    setOriginal(JSON.parse(JSON.stringify(initialUser)));
    setAddressInput(initialUser?.home_address?.line1 || '');
    setLocationDisplay(initialUser?.home_address?.line1 || '');
  }
}, [initialUser]);

  const handleChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  const getChangedFields = (original, updated) => {
  const changes = {};
  for (const key in updated) {
    const a = original?.[key];
    const b = updated?.[key];

    const isEqual =
      typeof a === 'object' && a !== null && b !== null
        ? JSON.stringify(a) === JSON.stringify(b)
        : a === b;

    if (!isEqual) {
      changes[key] = b;
    }
  }
  return changes;
};

  const handleSave = async () => {
    const mapped = {
      email: user.email,
      name: user.name,
      phone: user.phone,
      whatsapp_opt_in: user.whatsapp_opt_in,
      home_address: user.home_address,
    };

    const changes = getChangedFields(original, mapped);
    if (Object.keys(changes).length === 0) {
      alert('No changes made');
      return;
    }

    try {
      setSaving(true);
      await editUserProfile({ email: user.email, ...changes });
      alert('Changes saved successfully');
      setOriginal(JSON.parse(JSON.stringify(user)));
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const pickSuggestion = async (placeId, description) => {
    setAddressInput(description);
    setSuggestions([]);

    try {
      const res = await getPlaceDetails(placeId);
      const addr = {
        line1: res.line1,
        line2: res.line2,
        city: res.city,
        state: res.state,
        pincode: res.pincode,
        lat: res.latitude,
        long: res.longitude
      };
      handleChange('home_address', addr);
      setLocationDisplay(`${res.line1}, ${res.city}, ${res.state} ${res.pincode}`);
    } catch (err) {
      console.error('Failed to fetch place details:', err);
      alert('Failed to fetch address.');
    }
  };

  const handleUseCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        const res = await reverseGeocode(lat, lng);
        const addr = {
          line1: res.line1,
          line2: '',
          city: res.city,
          state: res.state,
          country: res.country,
          lat,
          long: lng,
          pincode: res.pincode
        };

        handleChange('home_address', addr);
        setAddressInput('📍 Using current location');
        setSuggestions([]);
        setLocationDisplay(`${res.line1}, ${res.city}, ${res.state} ${res.pincode}`);
      },
      error => {
        console.error('Error getting location:', error);
        alert('Unable to fetch current location.');
      }
    );
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (addressInput.length < 3) return setSuggestions([]);
      const results = await autocomplete(addressInput);
      setSuggestions(results || []);
    };

    const debounce = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounce);
  }, [addressInput]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <form className="space-y-6">
        {/* Name */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            type="text"
            value={user?.name || ''}
            onChange={e => handleChange('name', e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Full Name"
          />
          <UserIcon className="h-5 w-5 text-gray-400 absolute right-3 top-9" />
        </div>

        {/* Email */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
          <input
            type="email"
            value={user?.email || ''}
            disabled
            className="w-full pl-4 pr-10 py-2 rounded-xl bg-gray-100 border border-gray-300 cursor-not-allowed"
          />
          <EnvelopeIcon className="h-5 w-5 text-gray-400 absolute right-3 top-9" />
          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
        </div>

        {/* Phone */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <input
            type="text"
            value={user?.phone || ''}
            onChange={e => handleChange('phone', e.target.value)}
            className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="+91 9876543210"
          />
          <PhoneIcon className="h-5 w-5 text-gray-400 absolute right-3 top-9" />
        </div>

        {/* WhatsApp Opt-In */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-3">
            <input
              id="whatsapp"
              type="checkbox"
              checked={user?.whatsapp_opt_in || false}
              onChange={e => handleChange('whatsapp_opt_in', e.target.checked)}
              className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
            />
            <label htmlFor="whatsapp" className="text-sm text-gray-700">
              WhatsApp Updates
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-1 ml-6">
            Receive safety alerts and updates on WhatsApp
          </p>
        </div>

        {/* AddressEdit Component */}
        <AddressEdit
          addressInput={addressInput}
          setAddressInput={setAddressInput}
          suggestions={suggestions}
          setSuggestions={setSuggestions}
          setHomeAddress={addr => handleChange('home_address', addr)}
          locationDisplay={locationDisplay}
          setLocationDisplay={setLocationDisplay}
          pickSuggestion={pickSuggestion}
          useCurrentLocation={handleUseCurrentLocation}
        />

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-red-500 text-white font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? 'Saving...' : (
            <>
              <CheckIcon className="w-5 h-5" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}
