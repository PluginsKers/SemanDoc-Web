<template>
    <header
        class="fixed w-full h-[55px] bg-white shadow-sm text-black px-4 border-b border-slate-200 bg-opacity-95 backdrop-blur-sm z-10">
        <nav class="mx-auto flex h-full items-center justify-between">
            <a class="font-bold text-xl" href="#">数据管理系统</a>
            <div class="relative" @mouseenter="showDropdown" @mouseleave="hideDropdown">
                <img class="h-8 rounded-full hover:ring-[3px] hover:ring-gray-100 hover:cursor-pointer"
                    src="../../assets/avatar.jpg" @click="nav_redirect" @mouseover="showDropdown"
                    @touchstart="startTouch" @touchend="endTouch" />
                <transition name="fade">
                    <div v-if="dropdownVisible"
                        class="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div class="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                            <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem"
                                @click="logout">登出</a>
                        </div>
                    </div>
                </transition>
            </div>
        </nav>
    </header>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import router from '@/router';
import { useNotificationManager } from '@/notificationManager';
const { addNotification } = useNotificationManager();

const dropdownVisible = ref(false);
const touchTimeout = ref<any>(null);

const logout = () => {
    localStorage.removeItem('token');
    router.push({ name: 'Login' });
    addNotification({
        id: new Date().getTime(),
        message: "登出成功"
    });
};

const showDropdown = () => {
    dropdownVisible.value = true;
};

const hideDropdown = () => {
    dropdownVisible.value = false;
};

const startTouch = () => {
    touchTimeout.value = setTimeout(() => {
        dropdownVisible.value = true;
    }, 500);
};

const endTouch = () => {
    if (touchTimeout.value) {
        clearTimeout(touchTimeout.value);
        touchTimeout.value = null;
    }
};

const nav_redirect = () => {
    if (router.currentRoute.value.name != 'Dashboard') {
        router.push({ name: 'Dashboard' });
    } else {
        router.push({ name: 'Home' });
    }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to

/* .fade-leave-active in <2.1.8 */
    {
    opacity: 0;
}
</style>
