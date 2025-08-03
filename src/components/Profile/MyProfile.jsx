'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppBar from '@/components/Layout/AppBar';
import ProfilePic from '@/components/Profile/profilePic';
import ProfileSummary from '@/components/Profile/ProfileSummary';
import { getUserProfile } from '@/services/userService';
import IncidentHistory from '@/components/Profile/IncidentHistory';
export default function MyProfile() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (!storedEmail) {
      setError('No email found in local storage');
      setLoading(false);
      return;
    }

    async function loadProfile() {
      try {
        const data = await getUserProfile(storedEmail);
        if (!data) {
          setError('No profile data returned');
        } else {
          setUser(data);
        }
      } catch (err) {
        console.error('Profile load error:', err);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

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
  const address = `${user.home_address?.line1}`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* App bar */}
      <div className="bg-white shadow-sm">
        <AppBar type="internal" title="My Profile" />
      </div>

      <main className="mx-auto w-full max-w-full sm:max-w-[1333px] px-4 sm:px-6 lg:px-8 space-y-6 mt-6">
        {/* Profile header */}
        <section className="p-6 flex flex-col items-center">
          <ProfilePic dpUrl={user.dpS3Url} initials={initials} size={80}/>
          <h1 className="mt-4 text-2xl font-bold text-gray-800">{user.name}</h1>
        </section>

        {/* Contact & Address summary */}
        <ProfileSummary
            email={user.email}
            phone={user.phone}
            address={address}
            onEdit={() => router.push('/profile/edit')}
        />

        <IncidentHistory email={user.email}/>
      </main>
    </div>
  );
}
