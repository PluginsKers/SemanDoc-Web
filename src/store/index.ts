import { createStore } from 'vuex';
import { login } from '@/api/auth';

const store = createStore({
    state: {
        user: JSON.parse(localStorage.getItem('user')|| "{}") || {
            username: '',
            nickname: '',
            role_id: null,
            token: '',
        },
        isAuthenticated: !!localStorage.getItem('token'),
    },
    mutations: {
        SET_USER(state: { user: { token: any; }; isAuthenticated: boolean; }, user: { id: any; token: string; }) {
            state.user = user;
            state.isAuthenticated = !!user.id;
            state.user.token = user.token;
            localStorage.setItem('user', JSON.stringify(state.user));
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
            localStorage.removeItem('user');
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
