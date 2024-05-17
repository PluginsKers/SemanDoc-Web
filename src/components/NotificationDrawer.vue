<template>
    <div v-if="isOpen" class="fixed right-4 bottom-0 w-64 z-50 hidden lg:block">
        <div
            class="absolute flex justify-center items-center top-[-60px] right-[-4px] text-white z-40 bg-black rounded-md w-[20px] h-[20px] text-sm">
            {{ notifications?.length }}{{ (outside) ? "+" : "" }}
        </div>
        <ul class="relative max-w-64 z-30" :style="{ bottom: `${bottoms.length * offset - offset}px` }">
            <li v-for="(item, index) in notifications" :key="item.id"
                class="absolute flex flex-row items-center bg-white ring-1 ring-gray-200 text-sm rounded-b-none w-full max-h-14 rounded p-4 origin-bottom transform cursor-pointer bottom-0"
                :style="{ transform: `translateY(${bottoms[index]}px) scale(${1 - scales[index]})` }"
                @mouseover="showTooltip(index)" @mouseleave="hideTooltip(index)">
                <svg t="1715015564979" class="icon mr-2 w-[24px] h-[24px]" viewBox="0 0 1024 1024" version="1.1"
                    xmlns="http://www.w3.org/2000/svg" p-id="5109" width="24" height="24">
                    <path
                        d="M512 85.333333c235.637333 0 426.666667 191.029333 426.666667 426.666667 0 78.293333-21.152 153.568-60.586667 219.274667a32 32 0 0 1-54.88-32.938667A360.789333 360.789333 0 0 0 874.666667 512c0-200.298667-162.368-362.666667-362.666667-362.666667S149.333333 311.701333 149.333333 512s162.368 362.666667 362.666667 362.666667a360.789333 360.789333 0 0 0 186.314667-51.445334 32 32 0 0 1 32.928 54.88A424.778667 424.778667 0 0 1 512 938.666667C276.362667 938.666667 85.333333 747.637333 85.333333 512S276.362667 85.333333 512 85.333333z m0 565.333334a42.666667 42.666667 0 1 1 0 85.333333 42.666667 42.666667 0 0 1 0-85.333333z m0-362.666667a42.666667 42.666667 0 0 1 42.666667 42.666667v234.666666a42.666667 42.666667 0 1 1-85.333334 0V330.666667a42.666667 42.666667 0 0 1 42.666667-42.666667z"
                        fill="#000000" p-id="5110"></path>
                </svg>
                <p class="truncate select-none font-sans w-full">{{ item.message }}</p>
                <div v-if="tooltipVisible[index]"
                    class="absolute bg-black text-white text-xs rounded py-1 px-2 top-[-50px] right-0 w-48">
                    {{ item.message }}
                </div>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { defineProps, ref, watch } from 'vue';
import { Notification } from '@/types'

const props = defineProps({
    isOpen: Boolean,
    notifications: Array<Notification>
});
const outside = ref(false);
const hasReachedFive = ref(false);
const offset = ref<number>(10);
const bottoms = ref<number[]>([]);
const scales = ref<number[]>([]);
const tooltipVisible = ref<boolean[]>([]);

watch(() => props.notifications, (newNotifications) => {
    if (newNotifications) {
        if (newNotifications.length >= 5) {
            if (hasReachedFive.value) {
                outside.value = true;
            } else {
                hasReachedFive.value = true;
            }
        } else {
            outside.value = false;
            hasReachedFive.value = false;
        }

        updateBottoms(newNotifications.length);
        updateScales(newNotifications.length);
        tooltipVisible.value = new Array(newNotifications.length).fill(false);
    }
}, { immediate: true, deep: true });

function updateBottoms(length: number) {
    bottoms.value = Array.from({ length }, (_, i) => i * offset.value);
}

function updateScales(length: number) {
    scales.value = Array.from({ length }, (_, i) => i * 0.05).reverse();
}

function showTooltip(index: number) {
    tooltipVisible.value[index] = true;
}

function hideTooltip(index: number) {
    tooltipVisible.value[index] = false;
}

</script>

<style scoped>
li {
    transition: all 0.1s;
}
</style>
