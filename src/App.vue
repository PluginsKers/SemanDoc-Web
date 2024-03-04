<template>

    <Head v-if="showHead"></Head>
    <router-view class="min-h-screen bg-gray-100/50 p-4 text-sm"></router-view>
</template>

<script setup lang="ts">
import Head from './components/layouts/Head.vue';
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const showHead = ref(true);

watchEffect(() => {
    if (route.name === 'Login') {
        showHead.value = false;
    } else {
        showHead.value = true;
    }
});

</script>