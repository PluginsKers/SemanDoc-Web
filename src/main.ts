import { createApp } from 'vue';
import App from '@/App.vue';
import router from '@/router';
import store from './store';
import { useNotificationManager } from './notificationManager';

import '@/style.css'
const app = createApp(App);

app.use(router);

app.use(store);
app.provide('notificationManager', useNotificationManager());
app.mount('#app');
