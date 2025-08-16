import api from '@/lib/axiosInstance';

export const triggerSOS = async ({ email, latitude, longitude, timestamp }) => {
  try {
    const res = await api.post('/sos/trigger', {
      email,
      location: {
        latitude,
        longitude,
      },
      timestamp,
    });
    return res.data;
  } catch (err) {
    console.error('Trigger SOS error:', err);
    throw err;
  }
};

export const sendSOSHeartbeat = async ({ email, latitude, longitude, timestamp }) => {
  try {
    const res = await api.post('/sos/heartbeat', {
      email,
      location: {
        latitude,
        longitude,
      },
      timestamp,
    });
    return res.data;
  } catch (err) {
    console.error('SOS heartbeat error:', err);
    throw err;
  }
};
export const endSOSEvent = async ({ email, timestamp }) => {
  try {
    const res = await api.post('/sos/end', { email, timestamp });
    return res.data;
  } catch (err) {
    console.error('End SOS event error:', err);
    throw err;
  }
};