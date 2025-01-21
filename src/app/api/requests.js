import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchPendingRequests = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/requests/pendingRequests`);
        return response;
    } catch (error) {
        throw new Error('Error fetching pending requests: ' + error.message);
    }
};

export const fetchRejectedRequests = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/requests/rejectedRequests`);
        return response;
    } catch (error) {
        throw new Error('Error fetching pending requests: ' + error.message);
    }
};