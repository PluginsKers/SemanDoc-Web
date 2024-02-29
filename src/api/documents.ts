import axios from 'axios';
import { Document } from './types';

const API_BASE_URL = 'https://ai.app.nbpt.edu.cn/api';

export const queryDocuments = async (query: string, k: number, filter: object): Promise<Document[]> => {
    const response = await axios.post(`${API_BASE_URL}/query`, { query, k, filter });
    return response.data.data;
};

export const removeDocuments = async (target: number[]) => {
    const response = await axios.post(`${API_BASE_URL}/edit/remove`, {
        type: "ids",
        target
    });
    return response.data.data;
};

export const addDocument = async (data: Document["page_content"], metadata: Document["metadata"]): Promise<Document[]> => {
    const response = await axios.post(`${API_BASE_URL}/edit/add`, {
        data,
        metadata
    });
    return response.data.data;
};
