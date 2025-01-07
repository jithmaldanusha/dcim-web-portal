import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getZones = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/zones`);
        return response.data;
    } catch (error) {
        console.error('Error fetching zones:', error.message);
        throw error;
    }
};