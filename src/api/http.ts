import axios from 'axios';
import router from '@/router';
import { useNotificationManager } from '@/notificationManager';
const { addNotification } = useNotificationManager();

const API_BASE_URL = 'http://10.102.20.242:7002/api/v1';
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
            const status = error.response.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                router.push({ name: 'Login' });
                return Promise.reject("验证已过期");
            }
        } else {
            addNotification({
                id: new Date().getTime(),
                message: "请求出错"
            });
        }
        return Promise.reject(error);
    }
);

export default http;