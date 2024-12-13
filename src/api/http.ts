import axios from "axios";
import store from "@/store";
import router from "@/router";
import { useNotificationManager } from "@/notificationManager";

const { addNotification } = useNotificationManager();
// const API_BASE_URL = 'http://127.0.0.1:7002/api/v1';
const API_BASE_URL = "https://ai.app.nbpt.edu.cn/sde/api/v1";
const http = axios.create({
	baseURL: API_BASE_URL,
});

http.interceptors.request.use(
	function (config) {
		const token = store.getters.getToken;
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	function (error) {
		return Promise.reject(error);
	},
);

http.interceptors.response.use(
	function (response) {
		if (response.data.message) {
			addNotification({
				id: new Date().getTime(),
				message: response.data.message,
			});
		}
		return response;
	},
	function (error) {
		if (error.response) {
			addNotification({
				id: new Date().getTime(),
				message: error.response.data.message || "请求失败",
			});
			const status = error.response.status;
			if (status === 401 || status === 403) {
				store.dispatch("logout");
				router.push({ name: "Login" });
				return Promise.reject(new Error("验证已过期"));
			}
		} else {
			addNotification({
				id: new Date().getTime(),
				message: "请求出错",
			});
		}
		return Promise.reject(error);
	},
);

export default http;
