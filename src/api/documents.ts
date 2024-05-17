import { Document } from '@/types';
import http from '@/api/http';


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
        return response.data;
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
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
