'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react'; // you can also import any chat icon you like

export default function ChatbotButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-6 right-6 z-50
        w-16 h-16
        rounded-full
        shadow-xl
        bg-gradient-to-br from-purple-600 to-red-400
        flex items-center justify-center
        transform hover:scale-105 transition
      "
    >
      <MessageSquare className="w-8 h-8 text-white" />
    </button>
  );
}
