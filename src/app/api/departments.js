import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getDepartments = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/departments`);
        return response.data;
    } catch (error) {
        console.error('Error fetching departments:', error.message);
        throw error;
    }
};