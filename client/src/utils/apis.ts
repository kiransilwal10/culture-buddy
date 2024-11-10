import axios from 'axios';

const API_URL = 'http://localhost:3000/'; 

export const postRequest = async (endpoint: string, data: object) => {
    try {
        const response = await axios.post(`${API_URL}${endpoint}`, data);
        return response.data; 
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || `POST request to ${endpoint} failed.`);
    }
};

export const getRequest = async (endpoint: string) => {
    try {
        const response = await axios.get(`${API_URL}${endpoint}`);
        return response.data; 
    } catch (error: any) {
        throw new Error(error?.response?.data?.message || `GET request to ${endpoint} failed.`);
    }
};