<template>
    <header
        class="fixed w-full h-[55px] bg-white shadow-sm text-black px-4 border-b border-slate-200 bg-opacity-95 backdrop-blur-sm z-10">
        <nav class="mx-auto flex h-full items-center justify-between">
            <a class="font-bold text-xl" href="#">数据管理系统</a>
            <img class="h-8 rounded-full hover:ring-[3px] hover:ring-gray-100 hover:cursor-pointer" src="/avatar.jpg"
                @click="nav_redirect" />
        </nav>
    </header>
</template>

<script setup lang="ts">
import router from '@/router';

const nav_redirect = () => {
    if (router.currentRoute.value.name != 'Dashboard') {
        router.push({ name: 'Dashboard' });
    }
    else {
        router.push({ name: 'Home' });
    }
};
</script>