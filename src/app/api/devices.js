import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getModelsByManufacturer = async (manufacturer) => {
    try {
        const encodedmanufacturer = encodeURIComponent(manufacturer);
        
        const response = await axios.get(`${API_BASE_URL}/api/devices/getModelsByManufacturer/${encodedmanufacturer}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching models:', error.message);
        throw error;
    }
};

export const DirectImportBulk = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/bulkImport`, { data });
        return response.data;
    } catch (error) {
        console.error('Error importing devices:', error.message);
        throw error;
    }
};

export const requestDeviceApproval = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/requestApproval`, { data });
        return response.data;
    } catch (error) {
        console.error('Error requesting approval:', error.message);
        throw error;
    }
};