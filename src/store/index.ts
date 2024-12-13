import { createStore } from "vuex";
import { login } from "@/api/auth";
import { getDocumentsRecords, queryDocuments } from "@/api/index";

const store = createStore({
	state: {
		user: JSON.parse(localStorage.getItem("user") || "{}") || {
			username: "",
			nickname: "",
			role_id: null,
			token: "",
		},
		isAuthenticated: !!localStorage.getItem("token"),
		records: [],
		searchResults: [],
	},
	mutations: {
		SET_USER(state, user) {
			state.user = user;
			state.isAuthenticated = !!user.id;
			state.user.token = user.token;
			localStorage.setItem("user", JSON.stringify(state.user));
			localStorage.setItem("token", user.token);
		},
		CLEAR_USER(state) {
			state.user = {
				username: "",
				nickname: "",
				role_id: null,
				token: "",
			};
			state.isAuthenticated = false;
			localStorage.removeItem("user");
			localStorage.removeItem("token");
			localStorage.removeItem("rememberedUsername");
		},
		SET_RECORDS(state, records) {
			state.records = records;
		},
		SET_SEARCH_RESULTS(state, results) {
			state.searchResults = results;
		},
	},
	actions: {
		async login({ commit }, { username, password, rememberMe }) {
			try {
				const response = await login(username, password);
				const user = {
					username: response.data.username,
					nickname: response.data.nickname,
					role_id: response.data.role_id,
					token: response.token,
				};
				commit("SET_USER", user);
				if (rememberMe) {
					localStorage.setItem("rememberedUsername", username);
				} else {
					localStorage.removeItem("rememberedUsername");
				}
				return user;
			} catch (error) {
				console.error("Login failed:", error);
				throw error;
			}
		},
		logout({ commit }) {
			commit("CLEAR_USER");
		},
		async fetchRecords({ commit }) {
			try {
				commit("SET_RECORDS", []);
				const data = await getDocumentsRecords();
				commit("SET_RECORDS", data);
			} catch (error) {
				console.error("Failed to fetch records:", error);
			}
		},
		async searchDocuments(
			{ commit },
			{ query, k, filter, score_threshold, isPowerSet },
		) {
			try {
				const results = await queryDocuments(
					query,
					k,
					filter,
					Number(score_threshold),
					isPowerSet,
				);
				commit("SET_SEARCH_RESULTS", results);
			} catch (error) {
				console.error("Failed to search documents:", error);
				throw error;
			}
		},
	},
	getters: {
		getUser(state) {
			return state.user;
		},
		getToken(state) {
			return state.user.token;
		},
		isAuthenticated(state) {
			return state.isAuthenticated;
		},
		getRecords(state) {
			return state.records;
		},
		getSearchResults(state) {
			return state.searchResults;
		},
	},
});

export default store;
