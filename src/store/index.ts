import { createStore } from 'vuex';
import { login } from '@/api/auth';

const store = createStore({
    state: {
        user: {
            username: '',
            nickname: '',
            role_id: null,
            token: localStorage.getItem('token') || '',
        },
        isAuthenticated: false,
    },
    mutations: {
        SET_USER(state: { user: { token: any; }; isAuthenticated: boolean; }, user: { id: any; token: string; }) {
            state.user = user;
            state.isAuthenticated = !!user.id;
            state.user.token = user.token;
            localStorage.setItem('token', user.token);
        },
        CLEAR_USER(state: { user: { username: string; nickname: string; role_id: null; token: string; }; isAuthenticated: boolean; }) {
            state.user = {
                username: '',
                nickname: '',
                role_id: null,
                token: '',
            };
            state.isAuthenticated = false;
            localStorage.removeItem('token');
        }
    },
    actions: {
        async login({ commit }, { username, password }) {
            try {
                const response = await login(username, password);
                const user = {
                    username: response.data.username,
                    nickname: response.data.nickname,
                    role_id: response.data.role_id,
                    token: response.token,
                };
                commit('SET_USER', user);
                return user;
            } catch (error) {
                console.error('Login failed:', error);
                throw error;
            }
        },
        logout({ commit }) {
            commit('CLEAR_USER');
        }
    },
    getters: {
        getUser(state: { user: any; }) {
            return state.user;
        },
        getToken(state: { user: { token: any; }; }) {
            return state.user.token;
        },
        isAuthenticated(state: { isAuthenticated: any; }) {
            return state.isAuthenticated;
        }
    }
});

export default store;
