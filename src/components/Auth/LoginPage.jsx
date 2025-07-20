'use client';

import Logo from '@/components/Logo';
import Link from 'next/link';
import LoginForm from './LoginForm';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl p-8 flex flex-col items-center shadow-none md:shadow-lg">
        {/* Logo */}
        <Logo className="w-16 h-16 mb-4"/>

        {/* Name */}
        <h1 className="text-3xl font-bold text-center mb-1">
          GuardianX
        </h1>

        {/* Tagline: smaller & medium weight, with extra gap */}
        <p className="text-gray-600 text-xs font-medium mb-8 text-center">
          Built for safety. Designed for freedom.
        </p>

        {/* Welcome */}
        <h2 className="text-2xl font-bold text-center mb-1">
          Welcome!
        </h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Enter your email to receive a secure OTP
        </p>

        {/* The Form */}
        <LoginForm/>

        {/* Footer */}
        <div className="mt-8 flex flex-col items-center space-y-2 text-center text-xs text-gray-400">
          <div className="flex items-center text-gray-400">
            {/* Purple filled lock */}
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="w-4 h-4 mr-1 text-purple-600"
                 viewBox="0 0 24 24"
                 fill="currentColor">
              <path d="M12 17a2 2 0 100-4 2 2 0 000 4z"/>
              <path
                  fillRule="evenodd"
                  d="M6 9V7a6 6 0 1112 0v2a2 2 0 012
                  2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2
                0 012-2zm2-2a4 4 0 018 0v2H8V7z"
                  clipRule="evenodd"
              />
            </svg>
            <span>Your data is encrypted and secure</span>
          </div>
          <p>
            <span className="text-gray-400">Need help? Contact our&nbsp;</span>
            <Link href="#" className="text-indigo-600 hover:underline">
              24/7 support team </Link></p>
        </div>
      </div>
    </div>
  );
}
