<template>
    <div class="flex justify-center py-10 pt-[100px]">
        <form class="w-full max-w-sm placeholder:text-gray-400">
            <h1 class="text-2xl font-semibold text-center text-gray-900 mb-6">登录</h1>
            <div class="mb-4">
                <label for="username" class="block text-sm font-medium text-gray-700">用户名:</label>
                <input v-model="username" type="text" id="username" required
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6">
            </div>
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700">密码:</label>
                <input v-model="password" type="password" id="password" required
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6">
            </div>
            <div @click="submitLogin"
                :class="{ 'bg-gray-800': loading && !loginSuccess, 'bg-red-500': loginError, 'bg-green-700': loginSuccess, 'bg-black hover:bg-gray-900': !loading && !loginSuccess }"
                class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                <template v-if="loginSuccess">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </template>
                <template v-else-if="loading">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </template>
                <template v-else-if="loginError">
                    {{ loginErrorMessage  }}
                </template>
                <template v-else>
                    登录
                </template>
            </div>
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
        const loading = ref(false);
        const loginSuccess = ref(false);
        const loginError = ref(false);
        const loginErrorMessage = ref('');
        const router = useRouter();

        const submitLogin = async () => {
            if (loading.value) return;
            loading.value = true;
            try {
                const token = await login(username.value, password.value);
                localStorage.setItem('token', token);
                loginSuccess.value = true;
                loginError.value = false;
                loginErrorMessage.value = '';
                setTimeout(() => {
                    router.push({ name: 'Home' });
                }, 3000);
            } catch (error: any) {
                console.error('登录错误: ', error);
                loading.value = false;
                loginSuccess.value = false;
                loginError.value = true;
                loginErrorMessage.value = error.response?.data?.message || '登录失败';
            }
        };

        return {
            username,
            password,
            loading,
            loginSuccess,
            loginError,
            loginErrorMessage,
            submitLogin
        };
    }
});
</script>

  
<style></style>
  