import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  HomeIcon,
  PencilIcon
} from '@heroicons/react/24/solid';

export default function ProfileSummary({ email, phone, address, onEdit }) {
  return (
      <section className="w-full max-w-screen-xl mx-auto bg-white rounded-lg shadow-md p-6 space-y-6">
          {/* Email row */}
          <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                  <EnvelopeIcon className="w-5 h-5 text-black"/>
              </div>
              <div>
                  <div className="text-xs text-gray-500 uppercase">Email</div>
                  <div className="text-black">{email}</div>
              </div>
          </div>

          {/* Phone row */}
          <div className="flex items-center space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                  <PhoneIcon className="w-5 h-5 text-black"/>
              </div>
              <div>
                  <div className="text-xs text-gray-500 uppercase">Phone</div>
                  <div className="text-black">{phone}</div>
              </div>
          </div>

          {/* Address row */}
          <div className="flex items-start space-x-4">
              <div className="p-2 bg-gray-100 rounded-lg">
                  <HomeIcon className="w-5 h-5 text-black"/>
              </div>
              <div>
                  <div className="text-xs text-gray-500 uppercase">Home Address</div>
                  <div className="text-black">{address}</div>
              </div>
          </div>

          {/* Edit button */}
          <button
              onClick={onEdit}
              className="mt-4 w-full py-2 bg-gradient-to-r from-purple-600 to-red-500 text-white rounded-lg flex items-center justify-center"
          >
              <PencilIcon className="w-5 h-5 mr-2"/>
              Edit Profile
          </button>
      </section>
  );
}
