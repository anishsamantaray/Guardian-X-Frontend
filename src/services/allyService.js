import api from '@/lib/axiosInstance';


export const getUserSuggestions = async (query) => {
  try {
    const res = await api.get('/user/suggestions', { params: { query } });
    return res.data; // { suggestions: [{ email, name }, ...] }
  } catch (err) {
    console.error('Suggestions fetch error:', err);
    throw err;
  }
};


export const sendAllyRequest = async ({ from_email, to_email }) => {
  try {
    const res = await api.post('/allies/request', { from_email, to_email });
    return res.data;
  } catch (err) {
    console.error('Send ally request error:', err);
    throw err;
  }
};


export const respondToAllyRequest = async ({ from_email, to_email, response }) => {
  try {
    const res = await api.post('/allies/respond', { from_email, to_email, response });
    return res.data;
  } catch (err) {
    console.error('Respond to ally request error:', err);
    throw err;
  }
};


export const getReceivedRequests = async (to_email) => {
  try {
    const res = await api.get('/allies/requests/received', { params: { to_email } });
    return res.data; // { requests: [{ from_email, timestamp }, ...] }
  } catch (err) {
    console.error('Get received requests error:', err);
    throw err;
  }
};


export const getSentRequests = async (from_email) => {
  try {
    const res = await api.get('/allies/requests/sent', { params: { from_email } });
    return res.data; // { requests: [{ to_email, timestamp }, ...] }
  } catch (err) {
    console.error('Get sent requests error:', err);
    throw err;
  }
};

export const getAllies = async (email) => {
  try {
    const res = await api.get('/allies/allies', { params: { email } });
    return res.data; // { allies: [...] }
  } catch (err) {
    console.error('Get allies error:', err);
    throw err;
  }
};
