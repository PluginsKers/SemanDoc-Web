<template>
    <div class="flex items-center justify-center bg-gray-50 px-4">
        <form @submit.prevent="submitLogin" class="w-full max-w-sm">
            <h1 class="text-2xl font-semibold text-center text-gray-900 mb-6">Login</h1>
            <div class="mb-4">
                <label for="username" class="block text-sm font-medium text-gray-700">Username:</label>
                <input v-model="username" type="text" id="username" required
                    class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700">Password:</label>
                <input v-model="password" type="password" id="password" required
                    class="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
            </div>
            <div class="flex items-center justify-between">
                <button type="submit"
                    class="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">Login</button>
            </div>
            <p v-if="loginError" class="mt-2 text-sm text-red-600">{{ loginErrorMessage }}</p>
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
  
<style></style>
  