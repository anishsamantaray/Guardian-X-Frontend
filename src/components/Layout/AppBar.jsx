'use client';

import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import Logo from '@/components/Logo';
import { logout } from "@/services/authService";

export default function AppBar({ type = 'home', title = '', onBack }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef();
  const paddingClass = type === 'internal' ? 'py-3 sm:py-3' : 'py-5 sm:py-6';
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between px-4 py-5 sm:py-6 sm:px-12 shadow-sm bg-white sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-3">
        {type === 'internal' && (
            <button
                onClick={onBack || (() => router.back())}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center"
                aria-label="Go back"
            >
              <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  className="w-5 h-5 text-gray-700"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
            </button>

        )}
        {type === 'home' ? (
            <div className="flex items-center gap-3">
              <Logo className="w-8 h-8 sm:w-10 sm:h-10"/>
              <span className="text-xl sm:text-2xl font-bold">GuardianX</span>
            </div>
        ) : (
            <span className="text-lg sm:text-xl font-semibold">{title}</span>
        )}
      </div>

      {/* Right Section */}
      {type === 'home' ? (
          <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg py-1 text-sm z-50">
              <button
                onClick={() => router.push('/profile')}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <span className="text-purple-600 mr-3 flex-shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z" />
                  </svg>
                </span>
                <span className="text-base sm:text-sm">My Profile</span>
              </button>
              <button
                onClick={async () => {
                  await logout();
                  localStorage.clear();
                  router.push('/login');
                }}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 3h7v2H6v14h5v2H4V3z" />
                  <path d="M17 12 l-5 -5 v3 h-4 v4 h4 v3 l5 -5 z" />
                </svg>
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        // Show logo on the right for internal pages
        <div className="flex items-center gap-2">
          <Logo className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
      )}
    </div>
  );
}
