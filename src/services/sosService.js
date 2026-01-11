import api from '@/lib/axiosInstance';

export const triggerSOS = async ({ latitude, longitude, timestamp }) => {
  const res = await api.post('/sos/trigger', {
    location: {
      latitude,
      longitude,
    },
    timestamp,
  });
  return res.data;
};

export const sendSOSHeartbeat = async ({ latitude, longitude, timestamp }) => {
  const res = await api.post('/sos/heartbeat', {
    location: {
      latitude,
      longitude,
    },
    timestamp,
  });
  return res.data;
};

export const endSOSEvent = async ({ timestamp }) => {
  const res = await api.post('/sos/end', { timestamp });
  return res.data;
};
