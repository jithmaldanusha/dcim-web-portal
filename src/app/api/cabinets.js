// src/api/cabinets.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

//To fetch all cabinet names(location) and their id's
export const getCabinets = async () => {
    try {
        const cabinets = await axios.get(`${API_BASE_URL}/api/cabinets`);
        return cabinets.data;
    } catch (error) {
        console.error('Error fetching cabinets:', error);
        throw error;
    }
};

//to fetch the relevant record of the selected cabinet name(location)
export const getCabinetByLocation = async (location) => {
    try {
        const cabinet = await axios.get(`${API_BASE_URL}/api/cabinets/getCabinetById/${location}`);

        if(cabinet){
            return cabinet.data;
        }
        else{
            return null;
        }

    } catch (error) {
        console.error('Error fetching cabinet:', error);
        throw error;
    }
};

//to fetch required data for the dropdowns
export const getRequiredData = async () => {
    try {
        const datacenters = await axios.get(`${API_BASE_URL}/api/datacenters`);
        const departments = await axios.get(`${API_BASE_URL}/api/departments`);
        const zones = await axios.get(`${API_BASE_URL}/api/zones`);
        const cabinetrows = await axios.get(`${API_BASE_URL}/api/cabinetrows`);

        return {
            datacenters: datacenters.data,
            departments: departments.data,
            zones: zones.data,
            cabinetrows: cabinetrows.data,
        };
    } catch (error) {
        console.error('Error fetching cabinets:', error);
        throw error;
    }
};

export const addNewCabinet = async (formData) => {
    try {
        console.log('From addNewCabinet', formData)
        const response = await axios.post(`${API_BASE_URL}/api/cabinets/addCabinet`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error adding new cabinet:', error);
        throw error;
    }
};


export const updateCabinet = async (formData) => {
    try {
        console.log('From updateCabinet', formData)
        const response = await axios.post(`${API_BASE_URL}/api/cabinets/updateCabinet`, formData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating/inserting cabinet:', error);
        throw error;
    }
};

export const deleteCabinet = async (cabinetID) => {
    try {
        console.log('Deleting Cabinet:', cabinetID)
        const response = await axios.post(`${API_BASE_URL}/api/cabinets/deleteCabinet/${cabinetID}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting cabinet:', error);
        throw error;
    }
};