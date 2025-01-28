import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDataCenters = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/datacenters`);
        return response.data;
    } catch (error) {
        console.error('Error fetching datacenters:', error.message);
        throw error;
    }
};