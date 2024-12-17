import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const Login = async (username, password) => {
  try {
    console.log('Logging in with:', username, password);

    // Send username and password in the request body
    const response = await axios.post(`${API_BASE_URL}/api/sessions/login`, {
      username,
      password,
    });

    return response.data; // Return server response
  } catch (error) {
    console.error('Error logging in:', error);
    throw error; // Propagate error for handling
  }
};
