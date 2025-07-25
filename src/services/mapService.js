import api from '@/lib/axiosInstance';

export const autocomplete = async (input) => {
  try {
    const res = await api.get(`/maps/autocomplete?input=${encodeURIComponent(input)}`);
    return res.data;
  } catch (err) {
    console.error("Autocomplete error:", err);
    return [];
  }
};

export const getPlaceDetails = async (placeId) => {
  try {
    const res = await api.get(`/maps/details?place_id=${placeId}`);
    return res.data;
  } catch (err) {
    console.error("Details fetch error:", err);
    return {};
  }
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const res = await api.get(`/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
    return res.data;
  } catch (err) {
    console.error("Reverse geocode error:", err);
    return {};
  }
};
