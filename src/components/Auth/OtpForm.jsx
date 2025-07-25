'use client';

import { useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';
import {verifyOtp} from "@/services/authService";

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get('email') || 'your email';
  const [otp, setOtp] = useState(Array(6).fill(''));
  const inputsRef = useRef([]);

  const handleChange = (e, i) => {
    const val = e.target.value.replace(/\D/, '');
    if (!val) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (i < 5) inputsRef.current[i + 1]?.focus();
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await verifyOtp(email, otp.join('')); // `otp` is assumed to be an array of digits
    if (res.verified) {
      localStorage.setItem('access_token', res.access_token);
      localStorage.setItem('refresh_token', res.refresh_token);
      router.push('/home');
    } else {
      alert("OTP verification failed.");
    }
  } catch (err) {
    console.error('Verification error:', err);
    alert("An error occurred while verifying the OTP.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 flex flex-col items-center md:shadow-lg">
        {/* Back link */}
        <Link
          href="/login"
          className="self-start mb-4 flex items-center text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back
        </Link>

        {/* Logo & headings */}
        <Logo className="w-16 h-16 mb-4" />
        <h1 className="text-3xl font-bold mb-1">GuardianX</h1><br></br>
        <h2 className="text-xl font-bold mb-2">Verify Your Email</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          We’ve sent a 6-digit code to&nbsp;
          <span className="font-medium text-gray-800">{email}</span>
        </p>

        {/* OTP inputs */}
        <form onSubmit={handleSubmit} className="w-full space-y-6">
          <div className="flex justify-between space-x-2">
            {otp.map((digit, i) => (
                <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, i)}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className="w-10 h-10 text-center border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
            ))}
          </div>

          {/* Verify button */}
          <button
              type="submit"
              disabled={otp.some((digit) => digit === '')}
              className={`w-full flex items-center justify-center py-3 rounded-lg
  bg-gradient-to-r from-purple-600 to-red-500
  text-white font-medium transition-transform transform
  ${otp.some((digit) => digit === '')
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : 'hover:scale-105 hover:shadow-lg'}
`}
          >
            <span>Verify</span>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="white"
                strokeWidth={2}
            >
              <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </button>
        </form>

        {/* Resend link */}
        <p className="mt-4 text-xs text-gray-400">
          Didn’t receive the code?{' '}
          <Link href="#" className="text-indigo-600 hover:underline">
            Resend OTP
          </Link>
        </p>

        {/* Footer lock */}
        <div className="mt-6 flex items-center text-gray-400 text-xs">
          <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4 mr-1 text-purple-600"
              viewBox="0 0 24 24"
              fill="currentColor"
          >
            <path d="M12 17a2 2 0 100-4 2 2 0 000 4z"/>
            <path
                fillRule="evenodd"
                d="M6 9V7a6 6 0 1112 0v2a2 2 0 012
                 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2
                 0 012-2zm2-2a4 4 0 018 0v2H8V7z"
              clipRule="evenodd"
            />
          </svg>
          <span>Your verification is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}
