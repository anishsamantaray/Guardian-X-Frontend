import api from '@/lib/axiosInstance';

export const getUserSuggestions = async (query) => {
  const res = await api.get('/user/suggestions', { params: { query } });
  return res.data;
};

export const sendAllyRequest = async ({ to_email }) => {
  const res = await api.post('/allies/request', { to_email });
  return res.data;
};

export const respondToAllyRequest = async ({ from_email, response }) => {
  const res = await api.post('/allies/respond', { from_email, response });
  return res.data;
};

export const getReceivedRequests = async () => {
  const res = await api.get('/allies/requests/received');
  return res.data;
};

export const getSentRequests = async () => {
  const res = await api.get('/allies/requests/sent');
  return res.data;
};

export const getAllies = async () => {
  const res = await api.get('/allies');
  return res.data;
};
