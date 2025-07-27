'use client';

import AppBar from '@/components/Layout/AppBar';
import BlueInfoBanner from '@/components/ReportIncident/BlueInfoBanner';

export default function ReportPage() {
  return (
    <>
      {/* AppBar with white background */}
      <div className="bg-white">
        <AppBar type="internal" title="Report Incident" />
      </div>

      {/* Rest of the page with gray background */}
      <main className="bg-gray-100 min-h-screen px-4 py-6 md:px-8">
        <div className="w-full my-2">
          <BlueInfoBanner />
        </div>
        {/* Add more form components here */}
      </main>
    </>
  );
}