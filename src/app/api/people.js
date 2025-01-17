import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getPrimaryContacts = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/people/`); 
    console.log(response.data)
    return response.data;

  } catch (error) {
    console.error('Error fetching primary contacts:', error);
  }
};