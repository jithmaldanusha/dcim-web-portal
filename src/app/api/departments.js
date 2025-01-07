import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/departments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error.message);
        throw error;
    }
};