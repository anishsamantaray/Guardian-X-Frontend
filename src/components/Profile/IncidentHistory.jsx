'use client';

import React, { useState, useEffect } from 'react';
import { Disclosure } from '@headlessui/react';
import {
  ExclamationTriangleIcon,
  EyeIcon,
  MapPinIcon,
  HashtagIcon,
  ChevronDownIcon
} from '@heroicons/react/24/solid';
import { getIncidentHistory } from '@/services/incidentService';

function formatDate(iso) {
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    + ' at ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })
  );
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export default function IncidentHistory({ email }) {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getIncidentHistory(email);
        setReports(Array.isArray(data.incidents) ? data.incidents : []);
      } catch {
        console.error('fetch error');
      } finally {
        setLoading(false);
      }
    })();
  }, [email]);

  if (loading) return <div className="text-center py-12 text-gray-500">Loading…</div>;

  return (
      <section className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-Large text-black">My Incident Reports</h2>
          <span className="text-sm text-gray-800">{reports.length} reports</span>
        </div>
        {reports.map((r, i) => {
          const type = r.incident_type.toLowerCase();
          let Icon = MapPinIcon, bg = 'bg-gray-50', fg = 'text-gray-500';
          if (type === 'harassment') {
            Icon = ExclamationTriangleIcon;
            bg = 'bg-red-50';
            fg = 'text-red-600';
          } else if (type === 'unsafe area') {
            Icon = ExclamationTriangleIcon;
            bg = 'bg-yellow-50';
            fg = 'text-yellow-600';
          } else if (type === 'stalking') {
            Icon = EyeIcon;
            bg = 'bg-purple-50';
            fg = 'text-purple-600';
          }

          return (
              <Disclosure
                  key={i}
                  as="div"
                  className="bg-white rounded-xl shadow hover:shadow-lg transition-shadow"
              >
                {({open}) => (
                    <>
                      <Disclosure.Button className="w-full flex items-start justify-between p-6">
                        <div className="flex items-center gap-4">
                          <div className={`${bg} p-3 rounded-lg`}>
                            <Icon className={`w-8 h-8 ${fg}`}/>
                          </div>
                          <div className="flex-1 flex flex-col">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {capitalize(r.incident_type)}
                              </h3>
                              {/*<ChevronDownIcon*/}
                              {/*    className={`w-5 h-5 text-gray-400 transform transition-transform ${*/}
                              {/*        open ? 'rotate-180' : ''*/}
                              {/*    }`}*/}
                              {/*/>*/}
                            </div>
                            <time className="mt-1 text-sm text-gray-500">
                              {formatDate(r.timestamp)}
                            </time>
                          </div>
                        </div>
                        <ChevronDownIcon
                            className={`w-5 h-5 text-gray-400 transform transition-transform ${
                                open ? 'rotate-180' : ''
                            }`}
                        />
                      </Disclosure.Button>

                      <Disclosure.Panel className="border-t px-4 sm:px-6 pt-4 pb-6 space-y-3 text-gray-700">
  <p className="italic text-sm sm:text-base whitespace-pre-wrap break-words">
    {r.description || 'No additional details.'}
  </p>

  <div className="flex flex-wrap items-start gap-2 text-sm text-gray-600">
    <HashtagIcon className="w-4 h-4 text-gray-400 mt-0.5" />
    <span className="min-w-0 break-all leading-snug">
      Incident ID:{' '}
      <span className="font-mono">
        {r.incident_id}
      </span>
    </span>
  </div>
</Disclosure.Panel>
                    </>
                )}
              </Disclosure>
          );
        })}
      </section>
  );
}
