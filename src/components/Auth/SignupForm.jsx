'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { autocomplete } from '@/services/mapService';
import {signup} from "@/services/authService";
import { useSearchParams } from 'next/navigation';
export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail);
  const [phone, setPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);

  // Address autocomplete state
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [homeAddress, setHomeAddress] = useState(null);

  const timerRef = useRef();

  // Fetch autocomplete suggestions
 useEffect(() => {
  if (addressInput.length < 3) {
    setSuggestions([]);
    return;
  }
  clearTimeout(timerRef.current);
  timerRef.current = window.setTimeout(async () => {
    const preds = await autocomplete(addressInput);
    setSuggestions(preds || []);
  }, 300);
}, [addressInput]);

  // When user picks a suggestion, fetch details
  const pickSuggestion = async (placeId, description) => {
    setAddressInput(description);
    setSuggestions([]);
    const res = await getPlaceDetails(placeId);
    const d = res.data.result;
    // Map Google fields into your Address schema
    const addr = {
      line1: d.name || description,
      line2: '',
      city: (d.address_components.find(c => c.types.includes('locality')) || {}).long_name || '',
      state: (d.address_components.find(c => c.types.includes('administrative_area_level_1')) || {}).long_name || '',
      lat: d.geometry.location.lat,
      long: d.geometry.location.lng,
      pincode: (d.address_components.find(c => c.types.includes('postal_code')) || {}).long_name || ''
    };
    setHomeAddress(addr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!homeAddress) {
      alert('Please select your address from the list.');
      return;
    }
    const payload = {
      name,
      email,
      phone: `+91${phone}`,
      whatsapp_opt_in: whatsappOptIn,
      home_address: homeAddress
    };
    await signup(payload);
    router.push(`/home`);
  };

  return (
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
              id="name"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your full name"
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email address"
          />
        </div>

        {/* Phone */}
        <div className="w-full">
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative rounded-lg shadow-sm w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500">+91</span>
            </div>
            <input
                id="phone"
                type="tel"
                value={phone}
                onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                required
                maxLength={10}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter 10-digit number"
            />
          </div>
        </div>

        {/* WhatsApp opt-in */}
        <div className="flex items-start">
          <input
              id="whatsapp"
              type="checkbox"
              checked={whatsappOptIn}
              onChange={e => setWhatsappOptIn(e.target.checked)}
              className="mt-1 mr-2 h-4 w-4 text-green-600 border-gray-300 rounded"
          />
          <div className="text-sm">
            <label htmlFor="whatsapp" className="font-medium text-gray-700">
              Get safety alerts and updates on WhatsApp
            </label>
          </div>
        </div>

        {/* Address autocomplete */}
        <div className="relative">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Home Address
          </label>
          <input
              id="address"
              type="text"
              value={addressInput}
              onChange={e => {
                setAddressInput(e.target.value);
                setHomeAddress(null);
              }}
              required
              className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
              placeholder="Start typing your address…"
          />
          {suggestions.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg max-h-48 overflow-auto">
                {suggestions.map(s => (
                    <li
                        key={s.place_id}
                        onClick={() => pickSuggestion(s.place_id, s.description)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {s.description}
                    </li>
                ))}
              </ul>
          )}
        </div>

        {/* Submit */}
        <button
            type="submit"
            disabled={!email || !name || !phone}
            className={`
    w-full flex items-center justify-center py-3 rounded-lg
    bg-gradient-to-r from-purple-600 to-red-500
    text-white font-medium transition-transform transform
    ${!email || !name || !phone
                ? 'opacity-50 cursor-not-allowed pointer-events-none'
                : 'hover:scale-105 hover:shadow-lg'}
  `}
        >
          <span>Sign Up &amp; Continue</span>
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 ml-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
          </svg>
        </button>
      </form>
  );
}
