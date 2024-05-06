<template>
  <transition name="slide-up">
    <div v-if="isOpen" class="fixed right-4 bottom-0 mr-4 w-64 z-50 hidden lg:block">
      <ul class="relative max-w-50" :style="{ bottom: `${bottoms.length * offset - offset}px` }">
        <li v-for="(item, index) in notifications" :key="item.id"
          class="absolute bg-white ring-1 font-sans text-sm ring-gray-200 shadow-md rounded-b-none w-full max-h-14 truncate  rounded p-4 origin-bottom transform select-none cursor-pointer hover:rotate-0 "
          :style="{bottom: `${bottoms[index]}px`, transform: `scale(${1 - scales[index]})`}">
          {{ item.message }}
        </li>
      </ul>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { Notification } from '@/types'

const props = defineProps({
  isOpen: Boolean,
  notifications: Array<Notification>
});

const offset = ref<number>(10);
const bottoms = ref<number[]>([]);
const scales = ref<number[]>([]);

watch(() => props.notifications, (newNotifications) => {
  if (newNotifications) {
    updateBottoms(newNotifications.length);
    updateScales(newNotifications.length);
  }
}, { immediate: true, deep: true });

function updateBottoms(length: number) {
  bottoms.value = Array.from({ length }, (_, i) => i * -offset.value);
}

function updateScales(length: number) {
  scales.value = Array.from({ length }, (_, i) => i * 0.05).reverse();
}

</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-in-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

li {
  backface-visibility: hidden;
}
</style>
