// src/api/cabinets.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

// Fetch all cabinet names (location) and their IDs
export const getCabinets = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/cabinets`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cabinets:', error.message);
        throw error;
    }
};

// Fetch a single cabinet by location
export const getCabinetByLocation = async (location) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/api/cabinets/getCabinetByID/${location}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cabinet:', error.message);
        throw error;
    }
};

// Fetch cabinets by datacenter
export const getCabinetsByDataCenter = async (datacenter) => {
    try {
        // Encode the datacenter parameter to handle special characters
        const encodedDatacenter = encodeURIComponent(datacenter);
        
        const response = await axios.get(`${API_BASE_URL}/api/cabinets/getCabinetsByDatacenter/${encodedDatacenter}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching cabinets:', error.message);
        throw error;
    }
};


// Fetch required data for dropdowns (datacenters, departments, zones, cabinet rows)
export const getRequiredData = async () => {
    try {
        const [datacenters, departments, zones, cabinetRows] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/datacenters`),
            axios.get(`${API_BASE_URL}/api/departments`),
            axios.get(`${API_BASE_URL}/api/zones`),
            axios.get(`${API_BASE_URL}/api/cabinetrows`),
        ]);

        return {
            datacenters: datacenters.data,
            departments: departments.data,
            zones: zones.data,
            cabinetRows: cabinetRows.data,
        };
    } catch (error) {
        console.error('Error fetching dropdown data:', error.message);
        throw error;
    }
};

// Add a new cabinet
export const addNewCabinet = async (formData) => {
    try {
        console.log('Adding New Cabinet:', formData);
        const response = await axios.post(`${API_BASE_URL}/api/cabinets/addCabinet`, formData);
        return response.data;
    } catch (error) {
        console.error('Error adding new cabinet:', error.message);
        throw error;
    }
};

// Update an existing cabinet
export const updateCabinet = async (formData) => {
    try {
        console.log('Updating Cabinet:', formData);
        const response = await axios.put(`${API_BASE_URL}/api/cabinets/updateCabinet/${formData.cabinetID}`, formData); // Using PUT
        return response.data;
    } catch (error) {
        console.error('Error updating cabinet:', error.message);
        throw error;
    }
};

// Delete a cabinet
export const deleteCabinet = async (cabinetID) => {
    try {
        console.log('Deleting Cabinet ID:', cabinetID);
        const response = await axios.delete(`${API_BASE_URL}/api/cabinets/deleteCabinet/${cabinetID}`); // Using DELETE
        return response.data;
    } catch (error) {
        console.error('Error deleting cabinet:', error.message);
        throw error;
    }
};



