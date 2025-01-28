import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getZones = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/zones`);
        return response.data;
    } catch (error) {
        console.error('Error fetching zones:', error.message);
        throw error;
    }
};