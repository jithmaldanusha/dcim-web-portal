import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getPrimaryContacts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/people/`); 
    return response.data;

  } catch (error) {
    console.error('Error fetching primary contacts:', error);
  }
};