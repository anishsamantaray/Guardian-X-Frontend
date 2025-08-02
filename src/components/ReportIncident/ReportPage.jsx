'use client';

import React from 'react';
import AppBar from '@/components/Layout/AppBar';
import BlueInfoBanner from '@/components/ReportIncident/BlueInfoBanner';
import ReportForm from '@/components/ReportIncident/ReportForm';

export default function ReportPage() {
  const handleFormSubmit = ({ date, time }) => {
    console.log('Incident happened on:', date, time);
    // TODO: send to your API, advance wizard, etc.
  };

  return (
    <>
      {/* AppBar with white background */}
      <div className="bg-white">
        <AppBar type="internal" title="Report Incident" />
      </div>

      {/* Rest of the page with gray background */}
      <main className="bg-gray-100 min-h-screen px-4 py-6 md:px-8 space-y-4">
        <BlueInfoBanner />

        {/* ReportForm pulls in your date/time modal internally */}
        <ReportForm onSubmit={handleFormSubmit} />
      </main>
    </>
  );
}
