import React from 'react';

export default function ProfilePic({ dpUrl, initials, size = 80 }) {
  // Default diameter increased to 80px
  const dimension = `${size}px`;
  return (
    <div
      style={{ width: dimension, height: dimension }}
      className="rounded-full overflow-hidden bg-gradient-to-r from-purple-600 to-red-500 flex items-center justify-center"
    >
      {dpUrl ? (
        <img
          src={dpUrl}
          alt="Profile Picture"
          className="object-cover w-full h-full"
        />
      ) : (
        <span
          className="text-white font-extrabold"
          // initials font scaled down to 30% of the circle size
          style={{ fontSize: size * 0.3 }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}
