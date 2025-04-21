import { createRouter, createWebHashHistory } from "vue-router";
import Home from "@/pages/Home.vue";
import Presets from "@/pages/Presets.vue";
import Dashboard from "@/pages/Dashboard.vue";

const routes = [
	{ path: "/", name: "Home", component: Home },
	{ path: "/dashboard", name: "Dashboard", component: Dashboard },
	{ path: "/presets", name: "Presets", component: Presets },
];

const router = createRouter({
	history: createWebHashHistory("/"),
	routes,
});

export default router;
