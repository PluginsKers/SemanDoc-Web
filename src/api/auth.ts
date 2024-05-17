import axios from 'axios';
import { useNotificationManager } from '@/notificationManager';
const { addNotification } = useNotificationManager();

const API_BASE_URL = 'http://10.102.20.242:7002/api/v1';
const http = axios.create({
    baseURL: API_BASE_URL
});

http.interceptors.response.use(
    function (response) {
        addNotification({
            id: new Date().getTime(),
            message: response.data.message
        });
        return response;
    },
    function (error) {
        if (error.response) {
            addNotification({
                id: new Date().getTime(),
                message: error.response.data.message
            });
        }
        return Promise.reject(error);
    }
);

export const login = async (username: string, password: string) => {
    const response = await http.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
    });
    return response.data.token;
};
