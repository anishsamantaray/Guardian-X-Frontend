import api from '@/lib/axiosInstance';

/**
 * @param {{
 *   email: string,
 *   incident_type: string,
 *   description?: string,
 *   location: { latitude: number, longitude: number },
 *   timestamp: string
 * }} payload
 */
export const reportIncident = async (payload) => {
  try {
    const res = await api.post('/incident/report', payload);
    return res.data;
  } catch (err) {
    console.error('Report incident error:', err);
    throw err;
  }
};

export const getIncidentHistory = async (email) => {
  try {
    const res = await api.get(
      `/incident/history/${encodeURIComponent(email)}`
    );
    return res.data;
  } catch (err) {
    console.error('Fetch incident history error:', err);
    throw err;
  }
};
