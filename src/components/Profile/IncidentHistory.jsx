'use client';

import React, { useState, useEffect } from 'react';
import {
  ExclamationTriangleIcon,
  EyeIcon,
  MapPinIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { getIncidentHistory } from '@/services/incidentService';

export default function IncidentHistory({ email }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      try {
        const data = await getIncidentHistory(email);
        // Ensure the result is always an array
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.incidents)
          ? data.incidents
          : [];
        setReports(list);
      } catch (err) {
        console.error('Error fetching incident history:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchHistory();
  }, [email]);

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-4">
        Loading incident reports…
      </div>
    );
  }

  return (
    <section className="w-full max-w-screen-xl mx-auto space-y-6">
      <div className="flex items-center justify-between px-6">
        <h2 className="text-lg font-medium">My Incident Reports</h2>
        <span className="text-sm text-gray-500">{reports.length} reports</span>
      </div>
      <div className="space-y-4 px-6">
        {reports.map((r, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {(() => {
                  switch (r.incident_type) {
                    case 'Harassment':
                      return <ExclamationTriangleIcon className="w-6 h-6 text-red-500" />;
                    case 'Unsafe Area':
                      return <ExclamationTriangleIcon className="w-6 h-6 text-yellow-500" />;
                    case 'Stalking':
                      return <EyeIcon className="w-6 h-6 text-purple-500" />;
                    default:
                      return <MapPinIcon className="w-6 h-6 text-gray-500" />;
                  }
                })()}
                <span className="font-semibold text-gray-800">{r.incident_type}</span>
              </div>
              <ChevronDownIcon className="w-5 h-5 text-gray-400" />
            </div>
            <div className="mt-2 text-sm text-gray-500">
              {new Date(r.timestamp).toLocaleString()}
            </div>
            <div className="mt-1 flex items-center space-x-1 text-sm text-gray-700">
              <MapPinIcon className="w-4 h-4 text-gray-400" />
              <span>{r.location?.text || `${r.location.latitude}, ${r.location.longitude}`}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
