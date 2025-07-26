'use client';

import AppBar from '@/components/Layout/AppBar';
import DistanceCard from '@/components/Map/DistanceCard';

export default function HomePage() {
  return (
    <>
      <AppBar type="home" />
      <div className="mt-4 px-4">
        <DistanceCard />
      </div>
    </>
  );
}