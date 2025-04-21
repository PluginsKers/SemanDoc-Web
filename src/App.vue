<template>
	<Head v-if="showHead"></Head>
	<router-view class="min-h-screen bg-gray-100 p-4 text-sm"></router-view>
	<NotificationDrawer
		:isOpen="isDrawerOpen"
		:notifications="notifications"
		@close="isDrawerOpen = false" />
</template>

<script setup lang="ts">
import { ref, watch, watchEffect, onMounted } from "vue";
import { inject } from "vue";
import Head from "@/components/layouts/Header.vue";
import NotificationDrawer from "@/components/NotificationDrawer.vue";
import { NotificationManager } from "@/notificationManager";
import { useRoute } from "vue-router";

const notificationManager = inject<NotificationManager>("notificationManager");
if (!notificationManager) {
	throw new Error("notificationManager is not provided");
}
const { notifications } = notificationManager;

const route = useRoute();
const showHead = ref(false);
const isDrawerOpen = ref(false);

watchEffect(() => {
	if (route.name === "Login") {
		showHead.value = false;
	} else {
		showHead.value = true;
	}
});

watch(
	() => notifications.value,
	(newVal, _oldVal) => {
		isDrawerOpen.value = newVal.length > 0;
	},
	{ deep: true },
);

onMounted(() => {
	const hasVisitedBefore = localStorage.getItem("hasVisitedBefore");
	if (!hasVisitedBefore) {
		localStorage.setItem("hasVisitedBefore", "true");
	}
});
</script>
