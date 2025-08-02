import React, { useState, useRef, useEffect } from 'react';
// A simple sub-component for picking incident date/time
export default function IncidentDatePicker({
  onChange = () => {},
  initialDate = '',
 initialTime = '',
}) {
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);

  const dateRef = useRef(null);
  const timeRef = useRef(null);

  // useEffect(() => {
  //   // notify parent when either date or time updates
  //      if (date && time && typeof onChange === 'function') {
  //     onChange({ date, time });
  //   }
  // }, [date, time, onChange]);

  const openDatePicker = () => {
    if (dateRef.current?.showPicker) dateRef.current.showPicker();
    else dateRef.current?.focus();
  };

  const openTimePicker = () => {
    if (timeRef.current?.showPicker) timeRef.current.showPicker();
    else timeRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium mb-2">When did it happen?</h2>

      <div className="flex space-x-4">
        {/* Date field */}
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Date</label>
          <div className="relative">
            <input
              ref={dateRef}
              type="date"
              value={date}
                       onChange={e => {
             const newDate = e.target.value;
              setDate(newDate);
             // only notify parent when we have both date & time
              if (newDate && time) {
                 onChange({ date: newDate, time });                 }
          }}
              className="w-full pr-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={openDatePicker}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Open calendar"
            >
              {/* Calendar Icon placeholder */}
            </button>
          </div>
        </div>

        {/* Time field */}
        <div className="w-1/2">
          <label className="block text-sm font-medium mb-1">Time</label>
          <div className="relative">
            <input
              ref={timeRef}
              type="time"
              value={time}
                   onChange={e => {
              const newTime = e.target.value;
               setTime(newTime);
              // only notify parent when we have both date & time
               if (date && newTime) {
                 onChange({ date, time: newTime });
               }
        }}

              className="w-full pr-3 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            <button
              type="button"
              onClick={openTimePicker}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              aria-label="Open time picker"
            >
              {/* Clock Icon placeholder */}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
