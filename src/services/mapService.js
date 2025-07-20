import api from '@/lib/axiosInstance'

export const autocomplete = (input) =>
  api.get('/maps/autocomplete', {
    params: { input },
  });

export const getPlaceDetails = (placeId) =>
  api.get('/maps/details', {
    params: { place_id: placeId },
  });