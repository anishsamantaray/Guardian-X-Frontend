'use client';

import React, { useState,useEffect, useMemo, useRef} from 'react';
import AppBar from '@/components/Layout/AppBar';
import { UserCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  getUserSuggestions,
  sendAllyRequest,
  getSentRequests,
  getReceivedRequests,
  respondToAllyRequest,
    getAllies,
} from '@/services/allyService';

function formatAgo(epochSeconds) {
  const s = Math.max(0, Math.floor(Date.now() / 1000) - Number(epochSeconds || 0))
  if (s < 60) return 'Just now'
  const m = Math.floor(s / 60); if (m < 60) return `${m} min${m>1?'s':''} ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h} hour${h>1?'s':''} ago`
  const d = Math.floor(h / 24); if (d < 30) return `${d} day${d>1?'s':''} ago`
  const mo = Math.floor(d / 30); if (mo < 12) return `${mo} mo ago`
  const y = Math.floor(mo / 12); return `${y} yr${y>1?'s':''} ago`
}

export default function MyAllies() {
  const [search, setSearch] = useState('');
  const [allyInput, setAllyInput] = useState('');
  const [activeTab, setActiveTab] = useState('sent');
  const [suggestions, setSuggestions] = useState([]);
  const [loadingSugs, setLoadingSugs] = useState(false);
  const [openSugs, setOpenSugs] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const boxRef = useRef(null);

  const tabs = [
    { key: 'sent', label: 'Sent Requests' },
    { key: 'received', label: 'Received' },
    { key: 'confirmed', label: 'Confirmed' },
  ];

  const [raw, setRaw] = useState({ sent: [], received: [], confirmed: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const email = typeof window !== 'undefined'
    ? (localStorage.getItem('email') || '').toLowerCase().trim()
    : '';

  async function loadLists() {
  if (!email) return;
  setLoading(true); setError('');
  try {
    const [sentJson, recvJson, alliesJson] = await Promise.all([
      getSentRequests(email),
      getReceivedRequests(email),
      getAllies(email), // { allies: ["a@b.com", ...] }
    ]);

    const sent = (sentJson?.requests || []).map(r => ({
      id: `${r.to_email}-${r.timestamp}`,
      label: r.to_email,
      status: 'Pending',
      when: `Sent ${formatAgo(r.timestamp)}`,
      from_email: email,
      to_email: r.to_email,
    }));

    const received = (recvJson?.requests || []).map(r => ({
      id: `${r.from_email}-${r.timestamp}`,
      label: r.from_email,
      status: 'Incoming',
      when: `Received ${formatAgo(r.timestamp)}`,
      from_email: r.from_email,
      to_email: email,
    }));

    const confirmed = (alliesJson?.allies || []).map(addr => ({
      id: addr,            // email is unique enough here
      label: addr,         // UI only shows the email
      status: 'Confirmed',
      when: '',            // optional: leave blank
      from_email: email,
      to_email: addr,
    }));

    setRaw({ sent, received, confirmed });
  } catch (e) {
    setError(e?.message || 'Failed to load requests');
  } finally {
    setLoading(false);
  }
}

  useEffect(() => { loadLists();  }, [email]);

  const list = useMemo(() => {
    const arr = raw[activeTab] || [];
    if (!search.trim()) return arr;
    const q = search.toLowerCase().trim();
    return arr.filter(i => i.label.toLowerCase().includes(q));
  }, [raw, activeTab, search]);

  useEffect(() => {
    let t;
    if (allyInput.trim().length >= 3) {
      setLoadingSugs(true);
      t = setTimeout(async () => {
        try {
          const { suggestions: rows } = await getUserSuggestions(allyInput.trim());
          setSuggestions(rows || []);
          setOpenSugs(true);
          setHighlight(-1);
        } finally {
          setLoadingSugs(false);
        }
      }, 250);
    } else {
      setSuggestions([]);
      setOpenSugs(false);
    }
    return () => clearTimeout(t);
  }, [allyInput]);

  useEffect(() => {
    const onClick = e => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpenSugs(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const selectSuggestion = (row) => {
    setAllyInput(row.email);
    setOpenSugs(false);
  };

  const onKeyDown = (e) => {
    if (!openSugs || suggestions.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlight(h => Math.min(h + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlight(h => Math.max(h - 1, 0));
    } else if (e.key === 'Enter' && highlight >= 0) {
      e.preventDefault();
      selectSuggestion(suggestions[highlight]);
    } else if (e.key === 'Escape') {
      setOpenSugs(false);
    }
  };

  const onSend = async () => {
    if (!allyInput.trim()) return;
    await sendAllyRequest({ from_email: localStorage.getItem('email'), to_email: allyInput.trim() });
    setAllyInput('');
    setSuggestions([]);
    setOpenSugs(false);
    await loadLists(); // refresh after sending
  };

  async function handleRespond(req, action) {
  try {
    await respondToAllyRequest({
      from_email: req.from_email,
      to_email: req.to_email,
      response: action, // "accepted" or "rejected"
    });

    setRaw(prev => ({
      ...prev,
      received: prev.received.filter(i => i.id !== req.id),
      confirmed:
        action === 'accepted'
          ? [{ ...req, status: 'Confirmed', when: 'Just now' }, ...prev.confirmed]
          : prev.confirmed,
    }));
  } catch (err) {
    console.error(err);
    alert(`Failed to ${action} request`);
  }
}

const UserMinusRed = (props) => (
  <svg viewBox="0 0 24 24" className={props.className ?? "w-5 h-5"} xmlns="http://www.w3.org/2000/svg">
    {/* person */}
    <circle cx="9" cy="8" r="3" fill="#EF4444" />
    <path d="M2 20v-1c0-3.314 3.134-6 7-6s7 2.686 7 6v1H2z" fill="#EF4444" />
    {/* minus */}
    <rect x="17" y="9" width="5" height="2" rx="1" fill="#EF4444" />
  </svg>
);

  const LocationPurple = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 384 512" className={className} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="locGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(146,95,255,1)" />
        <stop offset="100%" stopColor="rgba(110,54,255,1)" />
      </linearGradient>
    </defs>
    <path fill="url(#locGrad)"
      d="M168 0C75.4 0 0 75.4 0 168c0 87.4 125.2 264.6 158.6 307.6a24 24 0 0 0 38.8 0C218.8 432.6 344 255.4 344 168 344 75.4 268.6 0 176 0h-8zm0 256a88 88 0 1 1 0-176 88 88 0 0 1 0 176z"/>
  </svg>
);


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm">
        <AppBar type="internal" title="My Allies" />
      </div>

      <main className="mx-auto max-w-7xl px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <section className="bg-white rounded-xl shadow p-4 sm:px-4 sm:py-5" ref={boxRef}>
          <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Send Ally Request</h2>

          <div className="relative">
            <input
                type="text"
                value={allyInput}
                onChange={e => setAllyInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Enter name or email"
                className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />

            {openSugs && (
                <div className="absolute z-20 mt-2 w-full rounded-lg border bg-white shadow">
                  {loadingSugs ? (
                      <div className="px-4 py-3 text-sm text-gray-500">Searching…</div>
                  ) : suggestions.length === 0 ? (
                      <div className="px-4 py-3 text-sm text-gray-500">No results</div>
                  ) : (
                      <ul className="max-h-64 overflow-auto">
                        {suggestions.map((row, idx) => (
                            <li
                                key={row.email}
                                onMouseDown={() => selectSuggestion(row)}
                                onMouseEnter={() => setHighlight(idx)}
                                className={`px-4 py-3 cursor-pointer ${highlight === idx ? 'bg-indigo-50' : ''}`}
                            >
                              <div className="font-medium">{row.name || row.email}</div>
                              <div className="text-sm text-gray-500">{row.email}</div>
                            </li>
                        ))}
                      </ul>
                  )}
                </div>
            )}
          </div>

          <button
              className="mt-3 sm:mt-4 w-full rounded-xl py-3 sm:py-3.5 text-base sm:text-[15px] font-semibold text-white"
              style={{background: 'linear-gradient(90deg, rgba(124,77,255,1) 0%, rgba(255,85,85,1) 100%)'}}
              onClick={async () => {
                try {
                  await onSend();
                  alert('Request sent successfully');
                } catch (e) {
                  alert('Failed to send request');
                }
              }}
          >
            Send Request
          </button>

        </section>

        <section className="bg-white rounded-xl shadow px-4 py-4">
          <div className="flex gap-2 sm:gap-3 mb-3 sm:mb-4">
            {tabs.map(t => (
                <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    className={`flex-1 text-center py-2.5 sm:py-3 text-sm sm:text-base font-medium rounded-xl ${
                        activeTab === t.key ? 'text-white' : 'text-gray-700 bg-gray-100'
                    }`}
                    style={activeTab === t.key
                        ? {background: 'linear-gradient(90deg, rgba(146,95,255,1) 0%, rgba(110,54,255,1) 100%)'}
                        : {}}
                >
                  {t.label}
                </button>
            ))}
          </div>

          {loading && <div className="p-6 text-center text-gray-500">Loading…</div>}
          {error && !loading && <div className="p-6 text-center text-red-600">Error: {error}</div>}

          {!loading && !error && (
              <div className="divide-y">
                {list.length === 0 && (
                    <div className="p-6 text-center text-gray-500">No items</div>
                )}

                {list.map(item => (
  <div key={item.id} className="py-4 sm:py-5">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">

      {/* Left: avatar + email + (Active + location on same line if confirmed) */}
      <div className="flex items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
          <UserCircleIcon className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-[15px] sm:text-base truncate max-w-[70vw] sm:max-w-none">
            {item.label}
          </div>

          {activeTab === 'confirmed' ? (
            <div className="flex items-center gap-3 mt-1 sm:hidden">
              <span className="inline-block px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                Active
              </span>
              <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <LocationPurple gradientId={`locGrad-${item.id}`} />
              </button>
              <button className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <UserMinusRed />
              </button>
            </div>
          ) : (
            <div className="text-sm text-gray-500 mt-0.5">{item.when}</div>
          )}
        </div>
      </div>

      {/* DESKTOP/TABLET icons on the right */}
      {activeTab === 'confirmed' && (
        <div className="hidden sm:flex items-center gap-6">
          <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <LocationPurple className="w-6 h-6" gradientId={`locGrad-${item.id}-r`} />
          </button>
          <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center">
            <UserMinusRed className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* Right: actions */}
      {activeTab === 'received' && (
          <div className="flex gap-2 sm:gap-3">
            <button
                className="h-10 px-3 sm:px-4 rounded-lg text-sm sm:text-[15px] font-medium text-white bg-green-500 hover:bg-green-600 active:scale-[0.99]"
                onClick={() => handleRespond(item, 'accepted')}
            >
              Accept
            </button>
          <button
            className="h-10 px-3 sm:px-4 rounded-lg text-sm sm:text-[15px] font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 active:scale-[0.99]"
            onClick={() => handleRespond(item, 'rejected')}
          >
            Decline
          </button>
        </div>
      )}

      {activeTab !== 'confirmed' && activeTab !== 'received' && (
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            {item.status}
          </span>
          <button className="h-10 w-10 rounded-full hover:bg-gray-100 flex items-center justify-center" aria-label="Remove">
            <XMarkIcon className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
          </button>
        </div>
      )}
    </div>
  </div>
))}


              </div>
          )}
        </section>
      </main>
    </div>
  );
}
