import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import { useNotificationManager } from './notificationManager';

import '@/style.css'
const app = createApp(App);

app.use(router);

app.provide('notificationManager', useNotificationManager());
app.mount('#app');
