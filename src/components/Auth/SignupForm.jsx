'use client';
import AddressAutocomplete from '@/components/Auth/AddressAutocomplete';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { autocomplete,getPlaceDetails, reverseGeocode } from '@/services/mapService';
import {signup} from "@/services/authService";
import { useSearchParams } from 'next/navigation';
export default function SignupForm() {
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
    const payload = {
  name,
  email,
  phone: `+91${phone}`, // Already handled correctly
  whatsapp_opt_in: whatsappOptIn,
  home_address: {
    line1: homeAddress.line1,
    line2: homeAddress.line2 || "",
    city: homeAddress.city,
    state: homeAddress.state,
    lat: homeAddress.lat,
    long: homeAddress.long,
    pincode: homeAddress.pincode
  }
};

    await signup(payload);
    router.push(`/login`);
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
                  {/*    <label*/}
                  {/*        htmlFor="whatsapp"*/}
                  {/*        className="flex items-center justify-start sm:justify-center gap-2 text-sm font-medium text-gray-700"*/}
                  {/*    >*/}
                  <span>Get safety alerts and updates on WhatsApp</span>
                  {/*        <svg*/}
                  {/*            xmlns="http://www.w3.org/2000/svg"*/}
                  {/*            viewBox="0 0 448 512"*/}
                  {/*            fill="currentColor"*/}
                  {/*            className="w-5 h-5 text-green-600"*/}
                  {/*        >*/}
                  {/*            <path*/}
                  {/*                d="M380.9 97.1C339 55.2 283.9 32 224.1 32c-114.9 0-208 93.1-208 208 0 36.7 9.6 72.4 27.8 104.1L12.3 480l138.7-36.4c30.1 16.5 64.2 25.2 98.2 25.2h.1c114.9 0 208-93.1 208-208 0-59.8-23.3-114.9-65.4-156.7zM224.1 438.6c-29.1 0-58.2-7.9-83.5-22.9l-6-3.5-82.3 21.6 22-80.1-3.9-6.3c-17.7-28.5-27-61.3-27-95 0-97.2 79.1-176.3 176.3-176.3 47 0 91.1 18.3 124.3 51.5 33.2 33.2 51.5 77.3 51.5 124.3 0 97.2-79.1 176.3-176.3 176.3zm101.7-138.5c-5.6-2.8-33.1-16.3-38.3-18.2-5.2-1.9-9-2.8-12.8 2.8s-14.7 18.2-18 22c-3.3 3.7-6.6 4.2-12.2 1.4-33.1-16.5-54.8-29.5-76.6-66.8-5.8-10 5.8-9.3 16.5-30.9 1.8-3.7.9-6.9-.5-9.7s-12.8-30.8-17.6-42.2c-4.7-11.3-9.5-9.8-12.8-10-3.3-.2-7.1-.2-10.9-.2s-10.1 1.4-15.4 6.9c-5.2 5.6-20.3 19.8-20.3 48.3s20.8 56.1 23.7 59.9c2.8 3.7 40.9 62.5 99.2 87.6 13.9 6 24.7 9.6 33.1 12.3 13.9 4.4 26.6 3.8 36.6 2.3 11.2-1.7 33.1-13.5 37.8-26.5 4.7-13 4.7-24.1 3.3-26.5-1.4-2.3-5.2-3.7-10.8-6.5z"/>*/}
                  {/*        </svg>*/}
                  {/*    </label>*/}
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
              disabled={!email || !name || !phone}
              className={`
    w-full flex items-center justify-center py-3 rounded-lg
    bg-gradient-to-r from-purple-600 to-red-500
    text-white font-medium transition-transform transform
    ${!email || !name || !phone
                  ? 'opacity-50 cursor-not-allowed pointer-events-none'
                  : 'hover:scale-105 hover:shadow-lg'}
  `}
          >
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
          </button>
      </form>
  );
}
