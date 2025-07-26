'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function SOSButton({ onClick = () => {} }) {
  return (
    <div className="flex flex-col items-center">
      <motion.button
        type="button"
        onClick={onClick}
        initial={{ scale: 1 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF5151] to-[#884DFF] shadow-lg flex flex-col items-center justify-center text-white focus:outline-none"
      >
        <span className="text-5xl leading-none mb-1">!</span>
        <span className="text-lg font-semibold">SOS</span>
      </motion.button>
      <p className="mt-4 text-gray-800 text-sm">
        Tap to Send Emergency Alert
      </p>
    </div>
  );
}
