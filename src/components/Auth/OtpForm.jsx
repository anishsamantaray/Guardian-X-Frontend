'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyOtp } from '@/services/authService';

export default function OtpForm() {
  const [otp, setOtp] = useState('');
  const router = useRouter();
  const email = useSearchParams().get('email');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await verifyOtp(email, otp);
      router.push('/home'); // or `/signup?email=${email}` if new user
    } catch {
      alert('Invalid OTP');
    }
  };

  return (
    <form onSubmit={handleVerify} className="max-w-md mx-auto mt-10 p-4">
      <h1 className="text-xl font-semibold mb-4">Enter OTP</h1>
      <input
        type="text"
        maxLength={6}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        className="w-full p-2 border mb-4 rounded text-center"
      />
      <button className="w-full bg-purple-600 text-white p-2 rounded">
        Verify & Continue
      </button>
    </form>
  );
}
