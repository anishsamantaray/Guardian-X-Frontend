'use client';

import React from 'react'
import { useRouter } from 'next/navigation'

export default function QuickActionCard({
  icon,         // URL or imported SVG
  iconBg = 'bg-gray-100',  // Tailwind bg‑color for icon circle
  title,
  subtitle,
  path,
 customAction,// router push path or phone link
}) {
  const router = useRouter()

  const handleClick = () => {
    if (customAction) {
      customAction();
      return;
    }

    if (path?.startsWith('http') || path?.startsWith('tel:')) {
      window.location.href = path;
    } else if (path) {
      router.push(path);
    }
  };

  return (
    <button
      onClick={handleClick}
      className="
        w-full h-16
        bg-white dark:bg-gray-700
        rounded-lg shadow hover:shadow-md transition
        px-4 flex items-center space-x-4
      "
    >
      <div className={`p-[1px] rounded-full ${iconBg}`}>
        <img src={icon} alt={`${title} icon`} className="w-7 h-7" />
      </div>
      <div className="text-left">
        <div className="text-sm font-medium text-gray-900 dark:text-white">
          {title}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-300">
          {subtitle}
        </div>
      </div>
    </button>
  )
}