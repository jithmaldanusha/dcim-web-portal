import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getCabinetRows = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/cabinetrows`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cabinet rows:', error.message);
        throw error;
    }
};