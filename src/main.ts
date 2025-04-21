import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "@/App.vue";
import router from "@/router";
import { useNotificationManager } from "./notificationManager";

import "@/style.css";
const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.provide("notificationManager", useNotificationManager());
app.mount("#app");
