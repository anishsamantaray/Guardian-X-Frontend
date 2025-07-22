'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp } from '@/services/authService';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const router = useRouter();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await sendOtp(email);
    console.log('OTP Send Response:', response);

    if (response.data.exists === false) {
      // User doesn't exist → redirect to signup
      router.push(`/signup?email=${encodeURIComponent(email)}`);
    } else {
      // User exists → go to verify page
      router.push(`/verify?email=${encodeURIComponent(email)}`);
    }
  } catch (error) {
    console.error('Failed to send OTP:', error);
    alert('Failed to send OTP');
  }
};

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <div className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1038 1024"
            fill="currentColor"
            className="absolute left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 text-gray-400"
            aria-hidden="true"
          >
            <path d="M212.155493 724.155493a14.422535 14.422535 0 0 1-9.374648-25.383662L413.061408 519.211268a14.422535 14.422535 0 0 1 18.749296 21.922253L221.530141 721.126761a14.422535 14.422535 0 0 1-9.374648 3.028732zM826.267042 724.155493a14.422535 14.422535 0 0 1-9.374648-3.461408L606.611831 541.566197a14.422535 14.422535 0 0 1 18.749296-22.354929l210.280563 179.560563a14.422535 14.422535 0 0 1-9.374648 25.383662zM519.211268 548.056338a83.218028 83.218028 0 0 1-58.988169-24.374084l-253.83662-239.414085 19.758873-21.056901 254.269296 239.990986a54.661408 54.661408 0 0 0 77.304789 0l254.413521-239.702536 19.758873 21.056902-254.12507 239.702535A82.496901 82.496901 0 0 1 519.211268 548.056338z" />
            <path d="M822.084507 749.971831H230.760563a57.690141 57.690141 0 0 1-57.69014-57.690141V317.295775a57.690141 57.690141 0 0 1 57.69014-57.690141h591.323944a57.690141 57.690141 0 0 1 57.690141 57.690141v374.985915a57.690141 57.690141 0 0 1-57.690141 57.690141zM230.760563 288.450704a28.84507 28.84507 0 0 0-28.84507 28.845071v374.985915a28.84507 28.84507 0 0 0 28.84507 28.845071h591.323944a28.84507 28.84507 0 0 0 28.84507-28.845071V317.295775a28.84507 28.84507 0 0 0-28.84507-28.845071z" />
          </svg>
          <input
            id="email"
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      </div>

      <button
          type="submit"
          disabled={!email.trim()}
          className={`
    w-full flex items-center justify-center py-3 rounded-lg
    bg-gradient-to-r from-purple-600 to-red-500
    text-white font-medium transition-transform transform
    ${!email.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'}
  `}
      >
        <span>Send OTP</span>
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
  );
}
