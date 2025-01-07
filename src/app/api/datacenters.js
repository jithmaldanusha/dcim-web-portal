import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getDataCenters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/datacenters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching datacenters:', error.message);
        throw error;
    }
};