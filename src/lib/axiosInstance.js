import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true, // ✅ allows sending cookies like refresh_token
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { data } = await api.get('/user/refresh-token');
        localStorage.setItem('access_token', data.access_token);

        originalRequest.headers['Authorization'] = `Bearer ${data.access_token}`;
        return api(originalRequest); // 🔁 retry original request
      } catch (refreshErr) {
        console.error("Session expired. Please log in again.");
        localStorage.removeItem('access_token');
        window.location.href = '/login'; // or redirect to auth
      }
    }

    return Promise.reject(error);
  }
);

export default api;
