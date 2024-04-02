import axios from 'axios';

const API_BASE_URL = 'https://ai.app.nbpt.edu.cn/api/v1';

export const login = async (username: string, password: string) => {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username,
        password
    });
    return response.data.token;
};
