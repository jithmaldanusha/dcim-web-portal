import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getCabinetRows = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/cabinetrows`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cabinet rows:', error.message);
        throw error;
    }
};