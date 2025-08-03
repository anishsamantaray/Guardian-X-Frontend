'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/Layout/AppBar';
import ProfilePic from '@/components/Profile/profilePic';
import EditProfileForm from '@/components/Profile/EditProfileForm';
import {
  getUserProfile,
  getUploadProfilePicUrl
} from '@/services/userService';

export default function EditProfile() {
  const router = useRouter();
  const [user, setUser]       = useState(null);
  const [dpUrl, setDpUrl]     = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  // Load profile once on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      setError('No email found in local storage');
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const data = await getUserProfile(storedEmail);
        if (!data) {
          setError('No profile data returned');
        } else {
          setUser(data);
          setDpUrl(data.dpS3Url || '');
        }
      } catch (err) {
        console.error('Profile load error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Actual upload handler
  const uploadProfilePhoto = async (email, file) => {
    const { uploadUrl, dpS3Url } = await getUploadProfilePicUrl(email, file.name);

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type, // dynamic content-type
      },
      body: file,
    });

    if (!res.ok) throw new Error('Failed to upload image to S3');
    return dpS3Url;
  };

  const handlePhotoChange = async (file) => {
    try {
      const previewUrl = URL.createObjectURL(file);
      setDpUrl(previewUrl);

      const newUrl = await uploadProfilePhoto(user.email, file);
      setDpUrl(newUrl);
      setUser(u => ({ ...u, dpS3Url: newUrl }));
    } catch (err) {
      console.error('Photo upload failed', err);
      alert('Failed to upload photo');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-gray-500">Loading profile…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-red-500">{error}</span>
      </div>
    );
  }

  const nameParts = (user.name ?? '').trim().split(/\s+/);
  const initials = nameParts.map(p => p[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <AppBar type="internal" title="Edit Profile" />
      </div>

      <main className="w-full max-w-[1333px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 space-y-6">
        {/* Profile Picture */}
        <section className="flex flex-col items-center">
          <ProfilePic
            dpUrl={dpUrl}
            initials={initials}
            size={100}
            onPhotoChange={handlePhotoChange}
          />
        </section>

         {/*Form */}
        <section className="max-w-xl mx-auto w-full">
          <EditProfileForm user={user} setUser={setUser} />
        </section>
      </main>
    </div>
  );
}
