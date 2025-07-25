export default function AddressAutocomplete({ addressInput, setAddressInput, setHomeAddress, suggestions, setSuggestions, pickSuggestion, useCurrentLocation }) {
  return (
    <div className="relative">
      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
        Home Address
      </label>
      <input
        id="address"
        type="text"
        value={addressInput}
        onChange={e => {
          setAddressInput(e.target.value);
          setHomeAddress(null);
        }}
        required
        className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        placeholder="Start typing your address…"
      />
      <div className="absolute right-3 top-2/3 transform -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" fill="currentColor" className="w-5 h-5">
          <path d="M168 0C75.4 0 0 75.4 0 168c0 87.4 125.2 264.6 158.6 307.6a24 24 0 0 0 38.8 0C218.8 432.6 344 255.4 344 168 344 75.4 268.6 0 176 0h-8zm0 256a88 88 0 1 1 0-176 88 88 0 0 1 0 176z" />
        </svg>
      </div>
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg max-h-48 overflow-auto">
          <li onClick={useCurrentLocation} className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-indigo-600 font-medium">
            📍 Use My Current Location
          </li>
          {suggestions.map(s => (
            <li
              key={s.place_id}
              onClick={() => pickSuggestion(s.place_id, s.description)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
