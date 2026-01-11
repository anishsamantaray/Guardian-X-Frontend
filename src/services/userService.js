import api from '@/lib/axiosInstance';

export const getUserProfile = async () => {
  const res = await api.get('/user/profile');
  return res.data;
};

export const getUploadProfilePicUrl = async (filename) => {
  const res = await api.post(
    `/user/upload-profile-pic?filename=${encodeURIComponent(filename)}`
  );
  return res.data;
};

export const editUserProfile = async (payload) => {
  const res = await api.patch('/user/editprofile', payload);
  return res.data;
};
