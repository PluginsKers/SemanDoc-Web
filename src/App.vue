<template>
  <Head v-if="showHead"></Head>
  <router-view class="min-h-screen bg-gray-100 p-4 text-sm"></router-view>
  <NotificationDrawer :isOpen="isDrawerOpen" :notifications="notifications" @close="isDrawerOpen = false" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { inject } from 'vue';
import Head from '@/components/layouts/Head.vue';
import NotificationDrawer from '@/components/NotificationDrawer.vue';
import { NotificationManager } from '@/notificationManager';
import router from '@/router';
import { useRoute } from 'vue-router';

if (!localStorage.getItem('token')) {
  router.push({ name: 'Login' });
}

const notificationManager = inject<NotificationManager>('notificationManager');
if (!notificationManager) {
  throw new Error('notificationManager is not provided');
}
const { notifications } = notificationManager;

const route = useRoute();
const showHead = ref(route.name !== 'Login');
const isDrawerOpen = ref(false);

watch(() => notifications.value, (newVal, _oldVal) => {
  isDrawerOpen.value = newVal.length > 0;
}, { deep: true });
</script>
