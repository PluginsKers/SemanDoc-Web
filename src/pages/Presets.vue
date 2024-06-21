<template>
    <div class="py-10 pt-[64px]">
        <div
            class="relative flex flex-col lg:sticky lg:top-[48px] bg-white rounded-md md:shadow-sm p-4 pb-2 mb-4 w-full gap-4">
            <h1 class="text-3xl font-bold text-left">预设管理</h1>
            <div v-for="(preset, key) in presetData" :key="key"
                class="flex flex-row gap-4 border-l-4 rounded border-black pl-4">
                <h2 class="flex flex-col items-center font-bold">{{ key }}</h2>
                <ul class="flex flex-col items-center">
                    <li v-for="tag in preset.tags" :key="tag">{{ tag }}</li>
                </ul>
                <button @click="removePreset(key)" class="flex justify-center items-center select-none h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">删除预设</button>
            </div>
            <div class="flex flex-col">
                <h2>添加新预设</h2>
                <input v-model="newPresetName" placeholder="预设名称" class="mt-1 p-2 w-1/3 h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6">
                <input v-model="newPresetTag" placeholder="预设标签" class="mt-1 p-2 w-1/3 h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6">
                <button @click="addPreset" class="flex justify-center items-center select-none w-1/3 h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">添加预设</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';

interface Preset {
    tags: string[];
}

const presetsKey = 'presets';

const initialPresets = JSON.stringify({
    "通用": { "tags": ["通用"] },
    "人工智能学院": { "tags": ["人工智能学院"] }
});

const presetData = ref<Record<string, Preset>>({});
const newPresetName = ref('');
const newPresetTag = ref('');

onMounted(() => {
    let storedPresets = localStorage.getItem(presetsKey);
    if (!storedPresets) {
        localStorage.setItem(presetsKey, initialPresets);
        storedPresets = initialPresets;
    }

    if (storedPresets) {
        presetData.value = JSON.parse(storedPresets);
    }
});

const savePresets = () => {
    localStorage.setItem(presetsKey, JSON.stringify(presetData.value));
};

const removePreset = (key: string) => {
    delete presetData.value[key];
    savePresets();
};

const addPreset = () => {
    if (newPresetName.value.trim() !== '' && newPresetTag.value.trim() !== '') {
        presetData.value[newPresetName.value.trim()] = {
            tags: newPresetTag.value.trim().split(",")
        };
        newPresetName.value = '';
        newPresetTag.value = '';
        savePresets();
    }
};
</script>

<style scoped>
input {
    margin: 5px;
}

button {
    margin: 5px;
}
</style>
