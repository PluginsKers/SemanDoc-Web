<template>
    <div class="flex justify-center pt-18 pt-[100px] z-0">
        <form class="w-full max-w-md placeholder:text-gray-400">
            <h1 class="text-3xl font-semibold text-center text-gray-900 mb-4">登录</h1>
            <div class="mb-4">
                <label for="username" class="block text-sm font-medium text-gray-700">用户名:</label>
                <input v-model="username" type="text" id="username" required
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-[3px] focus:border-gray-200 sm:text-sm sm:leading-6">
            </div>
            <div class="mb-6">
                <label for="password" class="block text-sm font-medium text-gray-700">密码:</label>
                <input v-model="password" type="password" id="password" required
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 placeholder:text-gray-400 focus:ring-[3px] focus:border-gray-200 sm:text-sm sm:leading-6">
            </div>
            <div @click="submitLogin"
                :class="{ 'bg-gray-800': loginStatus == -1, 'bg-red-800': loginStatus == -2, 'bg-green-700': loginStatus == 1, 'bg-black hover:bg-gray-900': loginStatus == 0 }"
                class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-200">
                <template v-if="loginStatus == 1">
                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clip-rule="evenodd" />
                    </svg>
                </template>
                <template v-else-if="loginStatus == -1">
                    <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                        </path>
                    </svg>
                </template>
                <template v-else-if="loginStatus == -2">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor" stroke-width="4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    {{ loginErrorMessage }}
                </template>
                <template v-else>
                    登录
                </template>
            </div>
        </form>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../api/auth';

const username = ref('');
const password = ref('');
const loginStatus = ref(0);
const loginErrorMessage = ref('');
const router = useRouter();

const submitLogin = async () => {
    if (loginStatus.value == -1 || loginStatus.value == 1) return;
    loginStatus.value = -1;
    try {
        const token = await login(username.value, password.value);
        localStorage.setItem('token', token);
        loginStatus.value = 1;
        loginErrorMessage.value = '';
        setTimeout(() => {
            router.push({ name: 'Home' });
        }, 1600);
    } catch (error) {
        console.error('登录错误: ', error);
        loginStatus.value = -2;
        loginErrorMessage.value = '登录失败';
    }
};
</script>

<style></style>
