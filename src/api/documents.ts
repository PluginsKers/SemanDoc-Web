import axios from 'axios';
import { Document } from './types';
import router from '../router';

const API_BASE_URL = 'https://ai.app.nbpt.edu.cn/api';
const http = axios.create({
    baseURL: API_BASE_URL,
    timeout: 6000
});

http.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem('token');
        config.headers.Authorization = `Bearer ${token}`;
        return config
    }
)

http.interceptors.response.use(
    function (response) {
        return response;
    },
    function (error) {
        if (error.response) {
            const status = error.response.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                router.push("/login");
                return Promise.reject("验证已过期");
            }
        }
        return Promise.reject(error);
    }
);


export const queryDocuments = async (query: string, k: number, filter: object): Promise<Document[]> => {
    const response = await http.post(`/query`, { query, k, filter });
    return response.data.data;
};

export const removeDocuments = async (target: number[]) => {
    const response = await http.post(`/edit/remove`, {
        type: "ids",
        target
    });
    return response.data.data;
};

export const addDocument = async (data: Document["page_content"], metadata: Document["metadata"]): Promise<Document[]> => {
    const response = await http.post(`/edit/add`, {
        data,
        metadata
    });
    return response.data.data;
};
