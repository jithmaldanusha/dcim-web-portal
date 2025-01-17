import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const WelcomeToDcim = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sessions/checkUsers`);
    return response.data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const CreateSuperAdmin = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sessions/createSuper`, {
      username,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Error creating super admin:", error);
    throw error;
  }
};

export const Login = async (username, password) => {
  try {
    // Send username and password in the request body
    const response = await axios.post(`${API_BASE_URL}/api/sessions/login`, {
      username,
      password,
    });
    return response.data;

  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Propagate error for handling
  }
};

export const Logout = async (userId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/sessions/logout`, { userId });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Error during logout.");
  }
};

export const ValidateToken = async (token) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/sessions/validate-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Token validation error:", error);
    throw error;
  }
};
