'use client';

import AppBar from '@/components/Layout/AppBar';
import DistanceCard from '@/components/Map/DistanceCard';
import SOSButton from '@/components/Home/Sos';
export default function Home() {
  return (
    <main className="bg-gray-800 min-h-screen">
      <AppBar type="home" />
        <div className="mt-4 px-4 space-y-6">
            <DistanceCard/>
            <div className="container mx-auto mt-8 px-4 space-y-8 flex flex-col items-center">
                <SOSButton/>
            </div>
                {/* Other sections… */}
            </div>
    </main>
);
}