'use client';

import React, { useState, useEffect } from 'react';
import { editUserProfile } from '@/services/userService';
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  CheckIcon,
  MapPinIcon
} from '@heroicons/react/24/solid';

export default function EditProfileForm({ user, setUser }) {
  const [original, setOriginal] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) setOriginal(user);
  }, [user]);

  const handleChange = (key, value) => {
    setUser(prev => ({ ...prev, [key]: value }));
  };

  const getChangedFields = (original, updated) => {
    const changes = {};
    for (const key in updated) {
      if (JSON.stringify(updated[key]) !== JSON.stringify(original[key])) {
        changes[key] = updated[key];
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
      setOriginal(mapped);
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

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

        {/* Home Address Line 1 (Single Field Display) */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
          <input
              type="text"
              value={user?.home_address?.line1 || ''}
              onChange={e =>
                  handleChange('home_address', {
                    ...user?.home_address,
                    line1: e.target.value,
                  })
              }
              className="w-full pl-4 pr-10 py-2 rounded-xl border border-gray-300 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="123 Park Street, Mumbai, Maharashtra 400001"
          />
          <MapPinIcon className="h-5 w-5 text-gray-400 absolute right-3 top-9" />
        </div>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full py-3 rounded-md bg-gradient-to-r from-purple-600 to-red-500 text-white font-semibold shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
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
