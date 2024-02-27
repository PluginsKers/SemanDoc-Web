import { createApp } from 'vue';
import axios from 'axios';
import App from './App.vue';
import router from './router';

import './style.css'

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

axios.interceptors.response.use(response => {
    if (response.data.code && (response.data.code === 401 || response.data.code === 403)) {
        localStorage.removeItem('token');
        router.push('/login');
        return Promise.reject("Unauthorized: Token is invalid or expired");
    }
    return response;
}, error => {
    return Promise.reject(error);
});

createApp(App).use(router).mount('#app');
