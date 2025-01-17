import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const getRequiredDeviceData = async () => {
    try {
        const [datacenters, departments, manufacturers, primaryContacts, deviceStatuses] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/datacenters`),
            axios.get(`${API_BASE_URL}/api/departments`),
            axios.get(`${API_BASE_URL}/api/manufacturers`),
            axios.get(`${API_BASE_URL}/api/people`),
            axios.get(`${API_BASE_URL}/api/devices/deviceStatus`)
        ]);
        return {
            datacenters: datacenters.data,
            departments: departments.data,
            manufacturers: manufacturers.data,
            primaryContacts: primaryContacts.data,
            deviceStatuses: deviceStatuses.data
        };
    } catch (error) {
        console.error('Error fetching dropdown data:', error.message);
        throw error;
    }
};

export const AddDevice = async (formData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/addDevice`, formData);
        return response.data;
    } catch (error) {
        console.error('Error adding new device:', error.message);
        throw error;
    }
};

export const UpdateDevice = async (formData, deviceID) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/api/devices/updateDevice/${deviceID}`, formData);
        return response.data;
    } catch (error) {
        console.error('Error updating device:', error.message);
        throw error;
    }
};

export const deleteDevice = async (deviceID) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/api/devices/deleteDevice/${deviceID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting device:', error.message);
        throw error;
    }
};

export const getLabelByCabinet = async (cabinetID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/devices/getDevicesByCabinet/${cabinetID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching device:', error.message);
        throw error;
    }
};

export const getDeviceByID = async (deviceID) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/devices/getDeviceById/${deviceID}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching device data:', error.message);
        throw error;
    }
};

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

export const requestDeviceAddApproval = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/deviceAddApproval`, { data });
        return response.data;
    } catch (error) {
        console.error('Error requesting approval:', error.message);
        throw error;
    }
};

export const requestDeviceUpdateApproval = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/deviceUpdateApproval`, { data });
        return response.data;
    } catch (error) {
        console.error('Error requesting approval:', error.message);
        throw error;
    }
};

export const requestDeviceRemoveApproval = async (data) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/api/devices/deviceRemoveApproval`, { data });
        return response.data;
    } catch (error) {
        console.error('Error requesting approval:', error.message);
        throw error;
    }
};

export const requestBulkDeviceApproval = async (data) => {
    try {
        console.log(data)
        const response = await axios.post(`${API_BASE_URL}/api/devices/bulkDeviceApproval`, { data });
        return response.data;
    } catch (error) {
        console.error('Error requesting approval:', error.message);
        throw error;
    }
};