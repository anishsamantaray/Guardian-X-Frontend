'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

export default function ActionCard({
  icon,
  title,
  description,
  path,
  className = '',      // new
}) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push(path)}
      className={`
        bg-white dark:bg-gray-700
        rounded-lg shadow hover:shadow-md transition
        p-4 flex flex-col items-center justify-center space-y-1
        ${className}          /* apply passed-in sizing */
      `}
    >
      <div className="p-2 bg-white-100 dark:bg-gray-600 rounded-full">
        <img
          src={icon}
          alt={`${title} icon`}
          className="w-12 h-12"
        />
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {title}
      </span>
      <span className="text-xs text-gray-500 dark:text-gray-300">
        {description}
      </span>
    </button>
  );
}
