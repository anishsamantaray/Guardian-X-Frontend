'use client';

import Link from 'next/link';
import Logo from '@/components/Logo';
import SignupForm from './SignupForm';

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white md:bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 md:shadow-lg flex flex-col items-center">
        <Link
          href="/login"
          className="self-start mb-4 text-gray-500 hover:text-gray-700 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </Link>

        <Logo className="w-16 h-16 mb-4" />

        <h1 className="text-3xl font-bold mb-1 text-center">GuardianX</h1>
        <p className="text-gray-600 text-xs font-medium mb-8 text-center">
          Built for safety. Designed for freedom.
        </p>

        <h2 className="text-2xl font-bold text-center mb-1">Create Your Account</h2>
        <p className="text-gray-600 text-sm mb-6 text-center">
          Join thousands of women staying safe together
        </p>

        <SignupForm />

        <p className="mt-6 text-xs text-gray-400 text-center">
          By signing up, you agree to our{' '}
          <Link href="/terms" className="underline text-indigo-600">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="underline text-indigo-600">
            Privacy Policy
          </Link>.
        </p>

        <div className="mt-2 flex items-center text-gray-400 text-xs">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 mr-1 text-purple-600"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 17a2 2 0 100-4 2 2 0 000 4z" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6 9V7a6 6 0 1112 0v2a2 2 0 012 2v8a2 2 0 01-2 2H6a2 2 0 01-2-2v-8a2 2 0 012-2zm2-2a4 4 0 018 0v2H8V7z"
            />
          </svg>
          <span>Your data is encrypted and secure</span>
        </div>
      </div>
    </div>
  );
}
