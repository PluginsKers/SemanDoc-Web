import axios from 'axios';
import { Document } from './types';
import router from '../router';

const API_BASE_URL = 'https://ai.app.nbpt.edu.cn/api/v1';
const http = axios.create({
    baseURL: API_BASE_URL
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


export const queryDocuments = async (query: string, k: number, filter: object, score_threshold: number, powerset: boolean): Promise<Document[]> => {
    const response = await http.get(`/documents`, { params: { query, k, filter: JSON.stringify(filter), score_threshold, powerset } });
    return response.data.data;
};

export const uploadDocuments = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await http.post(`/upload/documents`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;  // 或者根据你的错误处理策略返回错误信息
    }
};


export const removeDocuments = async (target: string[]) => {
    const response = await http.delete(`/documents/${target[0]}`);
    return response.data.data;
};

export const updateDocument = async (target: string, data: Document["page_content"], metadata: Document["metadata"]) => {
    const response = await http.put(`/documents/${target}`, {
        data,
        metadata
    });
    return response.data.data;
};

export const addDocument = async (data: Document["page_content"], metadata: Document["metadata"]): Promise<Document[]> => {
    const response = await http.post(`/documents`, {
        data,
        metadata
    });
    return response.data.data;
};
