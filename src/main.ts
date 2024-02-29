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
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
        localStorage.removeItem('token');
        router.push('/login');
        return Promise.reject("验证已过期");
    }
    return Promise.reject(error);
});

createApp(App).use(router).mount('#app');
