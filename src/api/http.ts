import axios from "axios";

const http = axios.create({
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: 10000,
	transformRequest: [
		(data) => {
			if (data) {
				return JSON.stringify(data);
			}
			return data;
		},
	],
	headers: {
		"Content-Type": "application/json",
	},
});

http.interceptors.request.use(
	(config) => {
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

http.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		return Promise.reject(error);
	},
);

export default http;
