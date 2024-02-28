<template>
    <Head></Head>
    <router-view class="min-h-screen bg-gray-100/50 p-4 text-sm"></router-view>
</template>

<script lang="ts">
import Head from './components/layouts/Head.vue';
import { defineComponent } from 'vue';

export default defineComponent({
    components: {
        Head
    }
});
</script>