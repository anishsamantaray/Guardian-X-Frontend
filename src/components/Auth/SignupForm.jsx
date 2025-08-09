'use client';
import AddressAutocomplete from '@/components/Auth/AddressAutocomplete';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { autocomplete,getPlaceDetails, reverseGeocode } from '@/services/mapService';
import {signup} from "@/services/authService";
import { useSearchParams } from 'next/navigation';
import { useUser } from '@/context/UserContext';

export default function SignupForm() {
    const { setUser } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const prefillEmail = searchParams.get('email') || '';
  const [name, setName] = useState('');
  const [email, setEmail] = useState(prefillEmail);
  const [phone, setPhone] = useState('');
  const [whatsappOptIn, setWhatsappOptIn] = useState(false);
const [locationDisplay, setLocationDisplay] = useState('');
  // Address autocomplete state
  const [addressInput, setAddressInput] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [homeAddress, setHomeAddress] = useState(null);
    const [loading, setLoading] = useState(false);
  const timerRef = useRef();

  // Fetch autocomplete suggestions
 useEffect(() => {
  if (addressInput.length < 3) {
    setSuggestions([]);
    return;
  }
  clearTimeout(timerRef.current);
  timerRef.current = window.setTimeout(async () => {
    const preds = await autocomplete(addressInput);
    setSuggestions(preds || []);
  }, 300);
}, [addressInput]);


const pickSuggestion = async (placeId, description) => {
  setAddressInput(description);
  setSuggestions([]);

  try {
    const res = await getPlaceDetails(placeId);


    const addr = {
      line1: res.line1,
      line2: res.line2,
      city: res.city,
      state: res.state,
      pincode: res.pincode,
      lat: res.latitude,
      long: res.longitude,
    };

    setHomeAddress(addr);
  } catch (err) {
    console.error("Failed to fetch place details:", err);
    alert("Failed to fetch address.");
  }
};


 const handleUseCurrentLocation = () => {
  navigator.geolocation.getCurrentPosition(
    async position => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      const res = await reverseGeocode(lat, lng);
      const addr = {
        line1: res.line1,
        line2: '',
        city: res.city,
        state: res.state,
        country: res.country,
        lat,
        long: lng,
        pincode: res.pincode
      };

      setHomeAddress(addr);
      setAddressInput('📍 Using current location');
      setSuggestions([]);
      setLocationDisplay(`${res.line1}, ${res.city}, ${res.state} ${res.pincode}`);
    },
    error => {
      console.error('Error getting location:', error);
      alert('Unable to fetch current location.');
    }
  );
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!homeAddress) {
    alert('Please select your address from the list.');
    return;
  }

  setLoading(true);

  const payload = {
    name,
    email,
    phone: `+91${phone}`,
    whatsapp_opt_in: whatsappOptIn,
    home_address: {
      line1: homeAddress.line1,
      line2: homeAddress.line2 || "",
      city: homeAddress.city,
      state: homeAddress.state,
      lat: homeAddress.lat,
      long: homeAddress.long,
      pincode: homeAddress.pincode,
    }
  };

  try {
    await signup(payload);
    setUser({ name, email });
    localStorage.setItem('email', email);
    router.push(`/home`);
  } catch (error) {
    console.error("Signup failed:", error);
    alert("Signup failed. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
      <form onSubmit={handleSubmit} className="w-full space-y-6">
          {/* Full Name */}
          <div className="relative">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
              </label>

              <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                  placeholder="Enter your full name"
              />

              <div className="absolute top-2/3 right-3 -translate-y-1/2 pointer-events-none">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                  >
                      <path
                          d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v1.2h19.2v-1.2c0-3.2-6.4-4.8-9.6-4.8z"
                      />
                  </svg>
              </div>
          </div>

          {/* Email */}
          <div className="relative">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
              </label>
              <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  placeholder="Enter your email address"
              />
              <div className="absolute top-2/3 right-3 -translate-y-1/2 pointer-events-none">
                  <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 1038 1024"
                      fill="currentColor"
                      className="w-7 h-7 text-gray-400"
                      aria-hidden="true"
                  >
                      <path
                          d="M212.155493 724.155493a14.422535 14.422535 0 0 1-9.374648-25.383662L413.061408 519.211268a14.422535 14.422535 0 0 1 18.749296 21.922253L221.530141 721.126761a14.422535 14.422535 0 0 1-9.374648 3.028732zM826.267042 724.155493a14.422535 14.422535 0 0 1-9.374648-3.461408L606.611831 541.566197a14.422535 14.422535 0 0 1 18.749296-22.354929l210.280563 179.560563a14.422535 14.422535 0 0 1-9.374648 25.383662zM519.211268 548.056338a83.218028 83.218028 0 0 1-58.988169-24.374084l-253.83662-239.414085 19.758873-21.056901 254.269296 239.990986a54.661408 54.661408 0 0 0 77.304789 0l254.413521-239.702536 19.758873 21.056902-254.12507 239.702535A82.496901 82.496901 0 0 1 519.211268 548.056338z"/>
                      <path
                          d="M822.084507 749.971831H230.760563a57.690141 57.690141 0 0 1-57.69014-57.690141V317.295775a57.690141 57.690141 0 0 1 57.69014-57.690141h591.323944a57.690141 57.690141 0 0 1 57.690141 57.690141v374.985915a57.690141 57.690141 0 0 1-57.690141 57.690141zM230.760563 288.450704a28.84507 28.84507 0 0 0-28.84507 28.845071v374.985915a28.84507 28.84507 0 0 0 28.84507 28.845071h591.323944a28.84507 28.84507 0 0 0 28.84507-28.845071V317.295775a28.84507 28.84507 0 0 0-28.84507-28.845071z"/>
                  </svg>
              </div>
          </div>

          {/* Phone */}
          <div className="w-full">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
              </label>
              <div className="relative rounded-lg shadow-sm w-full">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">+91</span>
                  </div>
                  <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                      required
                      maxLength={10}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400"
                      placeholder="Enter 10-digit number"
                  />
              </div>
          </div>

          {/* WhatsApp opt-in */}
          <div>
              <div className="flex items-center">
                  <input
                      id="whatsapp"
                      type="checkbox"
                      checked={whatsappOptIn}
                      onChange={e => setWhatsappOptIn(e.target.checked)}
                      className="mr-2 h-4 w-4 text-green-600 border-gray-300 rounded"
                  />

                  <span>Get safety alerts and updates on WhatsApp</span>

              </div>
              <p className="text-sm text-gray-400 pl-6">You can unsubscribe anytime</p>
          </div>

          <AddressAutocomplete
              addressInput={addressInput}
              setAddressInput={setAddressInput}
              setHomeAddress={setHomeAddress}
              suggestions={suggestions}
              setSuggestions={setSuggestions}
              pickSuggestion={pickSuggestion}
              useCurrentLocation={handleUseCurrentLocation}
          />

          {homeAddress && (
              <div className="bg-gray-100 p-4 rounded-lg text-sm text-gray-800">
                  <p className="font-medium mb-1">📍 Selected Address:</p>
                  <p>{homeAddress.line1}</p>
                  {/*<p>{homeAddress.city}, {homeAddress.state} - {homeAddress.pincode}</p>*/}
              </div>
          )}

          {/* Submit */}
          <button
              type="submit"
              disabled={!email || !name || !phone || loading}
              className={`
    w-full flex items-center justify-center py-3 rounded-lg
    bg-gradient-to-r from-purple-600 to-red-500
    text-white font-medium transition-transform transform
    ${!email || !name || !phone || loading
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'hover:scale-105 hover:shadow-lg'}
  `}
          >
              {loading ? (
                  <svg
                      className="animate-spin h-5 w-5 text-white"
                      viewBox="0 0 24 24"
                      fill="none"
                  >
                      <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                      />
                      <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                      />
                  </svg>
              ) : (
                  <>
                      <span>Sign Up &amp; Continue</span>
                      <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 ml-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="white"
                          strokeWidth={2}
                      >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                      </svg>
                  </>
              )}
          </button>
      </form>
  );
}
