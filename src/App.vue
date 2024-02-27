<template>
    <Head></Head>
    <router-view class="min-h-screen bg-gray p-4"></router-view>
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