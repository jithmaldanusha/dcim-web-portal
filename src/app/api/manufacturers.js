import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getManufacturers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/manufacturers`);
        return response.data;
    } catch (error) {
        console.error('Error fetching Manufacturers:', error.message);
        throw error;
    }
};