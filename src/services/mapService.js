import api from '@/lib/axiosInstance';

export const autocomplete = async (input) => {
  const res = await api.get(
    `/maps/autocomplete?input=${encodeURIComponent(input)}`
  );
  return res.data;
};

export const getPlaceDetails = async (placeId) => {
  const res = await api.get(`/maps/details?place_id=${placeId}`);
  return res.data;
};

export const fetchDistanceFromHome = async (currentLat, currentLng) => {
  const res = await api.get(
    `/maps/distance-from-home?current_lat=${currentLat}&current_lng=${currentLng}`
  );
  return res.data;
};

export const reverseGeocode = async (lat, lng) => {
  const res = await api.get(`/maps/reverse-geocode?lat=${lat}&lng=${lng}`);
  return res.data;
};
