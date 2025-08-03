'use client';

import React, { useRef } from 'react';
import { CameraIcon } from '@heroicons/react/24/solid';

export default function ProfilePic({
  dpUrl,
  initials,
  size = 120,
  onPhotoChange  // ← optional callback
}) {
  const inputRef = useRef(null);
  const dim = `${size}px`;
  const fontSize = size * 0.3;

  const handleClick = () => {
    if (onPhotoChange) inputRef.current.click();
  };
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file && ['image/png','image/jpeg'].includes(file.type)) {
      onPhotoChange(file);
    } else {
      alert('Please select a PNG or JPG image');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        onClick={handleClick}
        style={{ width: dim, height: dim }}
        className={`relative rounded-full overflow-hidden
                    bg-gradient-to-r from-purple-600 to-red-500
                    flex items-center justify-center
                    ${onPhotoChange ? 'cursor-pointer' : ''}`}
      >
        {dpUrl
  ? (
    <img
      src={dpUrl}
      alt="Profile"
      className="w-full h-full object-cover"
      onError={() => inputRef.current?.click()} // optional
    />
  )
  : (
    <span className="text-white font-extrabold" style={{ fontSize }}>
      {initials}
    </span>
  )
}

{onPhotoChange && (
  <>
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        handleClick();
      }}
      className="absolute bottom-1 right-1 bg-white rounded-full p-1.5 shadow"
    >
      <CameraIcon className="w-5 h-5 text-gray-700" />
    </button>

    <input
      ref={inputRef}
      type="file"
      accept="image/png, image/jpeg"
      capture="environment"
      onChange={handleFile}
      className="hidden"
    />
  </>
)}
      </div>

      {onPhotoChange && (
          <p className="mt-2 text-medium text-gray-600">Tap to change photo</p>
      )}
    </div>
  );
}
