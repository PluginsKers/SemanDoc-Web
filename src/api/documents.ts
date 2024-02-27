import axios from 'axios';
import { Document } from './types';

const API_BASE_URL = 'https://ai.app.nbpt.edu.cn/api';

export const queryDocuments = async (query: string, k: number): Promise<Document[]> => {
    const response = await axios.get(`${API_BASE_URL}/query`, {
        params: { query, k }
    });
    return response.data.data;
};

export const removeDocuments = async (target: number[]) => {
    const response = await axios.get(`${API_BASE_URL}/edit/remove`, {
        params: {
            type: "ids",
            target: JSON.stringify(target)
        }
    });
    return response.data.data;
};

export const addDocument = async (data: string, metadata: object):Promise<Document[]> => {
    const response = await axios.get(`${API_BASE_URL}/edit/add`, {
        params: {
            data,
            metadata: JSON.stringify(metadata)
        }
    });
    return response.data.data;
};
