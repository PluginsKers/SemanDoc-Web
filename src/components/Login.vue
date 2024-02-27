<template>
    <div class="login-container">
        <h1>Login</h1>
        <form @submit.prevent="submitLogin">
            <div>
                <label for="username">Username:</label>
                <input v-model="username" type="text" id="username" required>
            </div>
            <div>
                <label for="password">Password:</label>
                <input v-model="password" type="password" id="password" required>
            </div>
            <div>
                <button type="submit">Login</button>
            </div>
            <p v-if="loginError" class="error">{{ loginErrorMessage }}</p>
        </form>
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';

export default defineComponent({
    setup() {
        const username = ref('');
        const password = ref('');
        const loginError = ref(false);
        const loginErrorMessage = ref('');
        const router = useRouter();

        const submitLogin = async () => {
            try {
                const token = await login(username.value, password.value);
                localStorage.setItem('token', token);
                loginError.value = false;
                loginErrorMessage.value = '';
                router.push({ name: 'Home' });
            } catch (error: any) {
                console.error('Login error:', error);
                loginError.value = true;
                loginErrorMessage.value = error.response?.data?.message || 'Login failed';
            }
        };

        return {
            username,
            password,
            loginError,
            loginErrorMessage,
            submitLogin
        };
    }
});
</script>
  
<style>
.login-container {
    max-width: 300px;
    margin: auto;
    padding: 20px;
}

.error {
    color: red;
}
</style>
  