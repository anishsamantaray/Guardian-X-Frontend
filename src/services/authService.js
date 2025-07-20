import api from '@/lib/axiosInstance';

export const sendOtp = (email) => api.post('/user/send-otp', { email });
export const verifyOtp = (email, otp) => api.post('/user/verify-otp', { email, otp });
export const signup = (data) => api.post('/user/signup', data);
export const refreshToken = () => api.get('/user/refresh-token');