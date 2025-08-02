import api from '@/lib/axiosInstance';

export const getUserProfile = async (email) => {
  try {
    const res = await api.get(
      `/user/profile?email=${encodeURIComponent(email)}`
    );
    return res.data;
  } catch (err) {
    console.error('User profile fetch error:', err);
    return null;
  }
};