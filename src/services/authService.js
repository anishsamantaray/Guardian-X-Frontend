import api from '@/lib/axiosInstance';

export const sendOtp = async (email) => {
  try {
    const res = await api.post('/user/send-otp', { email });
    return res.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const res = await api.post('/user/verify-otp', { email, otp });
    return res.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const signup = async (data) => {
  try {
    const res = await api.post('/user/signup', data);
    return res.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const res = await api.post('/user/logout');
    return res.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};