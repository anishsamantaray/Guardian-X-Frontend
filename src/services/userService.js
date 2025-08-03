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

export const getUploadProfilePicUrl = async (email, filename) => {
  try {
    const res = await api.post(
      `/user/upload-profile-pic?email=${encodeURIComponent(email)}&filename=${encodeURIComponent(filename)}`
    );
    return res.data; // { uploadUrl, dpS3Url }
  } catch (err) {
    console.error('Upload profile pic URL fetch error:', err);
    throw err;
  }
};

export const editUserProfile = async (payload) => {
  try {
    const res = await api.patch('/user/editprofile', payload);
    return res.data;
  } catch (err) {
    console.error('User profile update error:', err);
    throw err;
  }
};