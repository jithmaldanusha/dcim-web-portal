import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchUserData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/useraccounts`, {
      params: { userId },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error getting userdata.");
  }
};

export const updateUsernameAPI = async (newUserId, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/update-username`, {
      newUserId,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error updating username.");
  }
};

export const updateEmailAPI = async (newUserEmail, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/update-email`, {
      newUserEmail,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error updating email.");
  }
};

export const updateEmailPassAPI = async (newUserEmailPass, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/update-emailpass`, {
      newUserEmailPass,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error updating email password.");
  }
};

export const updatePasswordAPI = async (currentPassword, newPassword, userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/update-password`, {
      currentPassword,
      newPassword,
      userId,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error updating password.");
  }
};

export const updateRoleAPI = async (newRole, userId) => {
  console.log(newRole, userId)
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/update-role`, {
      newRole,
      userId
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error updating role.");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/useraccounts/getusers`); 
    return response.data;

  } catch (error) {
    console.error('Error fetching user IDs:', error);
  }
};

export const addNewUser = async (userData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/addnewuser`, userData); 
    return response;
  } catch (e) {
    console.error('Error adding User:', e);
    throw e;
  }
};

export const removeUser = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/useraccounts/removeuser`, { userId }); 
    return response;
  } catch (e) {
    console.error('Error removing User:', e);
    throw e;
  }
};
