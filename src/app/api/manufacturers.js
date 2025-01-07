import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getManufacturers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/manufacturers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Manufacturers:', error.message);
        throw error;
    }
};