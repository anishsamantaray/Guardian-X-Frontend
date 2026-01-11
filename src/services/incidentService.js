import api from '@/lib/axiosInstance';

export const reportIncident = async (payload) => {
  const res = await api.post('/incident/report', payload);
  return res.data;
};

export const getIncidentHistory = async () => {
  const res = await api.get('/incident/history');
  return res.data;
};
