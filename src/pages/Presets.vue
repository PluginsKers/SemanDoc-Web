<template>
    <div class="py-10 pt-[64px] bg-gray-50 min-h-screen" @click="handleClickOutside">
        <div class="container mx-auto px-4">
            <div class="bg-white rounded-md shadow p-6 mb-6">
                <h1 class="text-3xl font-bold mb-6">预设管理</h1>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div v-for="(preset, key) in presetData" :key="key"
                        class="bg-white cursor-pointer border rounded-lg shadow-sm p-4 transition-transform transform h-fit hover:bg-gray-50"
                        @mouseover="hoverPreset = key" @mouseleave="hoverPreset = null" @click="togglePreset(key)"
                        :class="{' bg-gray-50': expandedPresets.includes(key) }">
                        <h2 class="text-xl font-semibol">{{ key }}</h2>
                        <div v-if="expandedPresets.includes(key)">
                            <ul class="flex flex-row my-4">
                                <li v-for="tag in preset.tags" :key="tag"
                                    class="bg-gray-200 rounded-sm text-xs px-2.5 py-1 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
                                    @click.stop="removeTagFromPreset(key, tag)">
                                    {{ tag }}
                                </li>
                            </ul>
                            <button @click.stop="removePreset(key)"
                                class="flex justify-center items-center select-none h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">删除预设</button>
                        </div>
                    </div>
                    <div @click.stop="toggleAddPresetPanel"
                        class="border-2 border-dashed border-gray-300 flex justify-center items-center rounded-lg cursor-pointer min-h-[64px] h-fit hover:bg-gray-50"
                        :class="{ 'bg-gray-50 hover:bg-gray-50': showAddPresetPanel }">
                        <div v-if="!showAddPresetPanel" class="text-gray-400 text-3xl">+</div>
                        <div v-if="showAddPresetPanel" class="w-full p-4" @click.stop>
                            <h2 class="text-xl font-semibold border-b pb-2 mb-4">添加新预设</h2>
                            <input v-model="newPresetName" placeholder="预设名称"
                                class="w-full mb-2 p-2 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6">

                            <div class="flex flex-row items-center mb-2">
                                <input v-model="newPresetTagInput" @keyup.enter="addTag" placeholder="按回车添加"
                                    class="flex-1 p-2 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6">
                            </div>
                            <ul class="flex flex-row flex-wrap gap-1 mb-4">
                                <li v-for="(tag, index) in newPresetTags" :key="index"
                                    class="cursor-pointer select-none bg-gray-200 text-black text-xs px-2.5 py-1 rounded-sm hover:bg-gray-300"
                                    @click.stop="removeTag(index)">
                                    {{ tag }}
                                </li>
                            </ul>
                            <button @click="confirmAddPreset"
                                class="flex justify-center items-center select-none w-full h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">确定</button>
                        </div>
                    </div>
                </div>
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
const newPresetTagInput = ref('');
const newPresetTags = ref<string[]>([]);
const expandedPresets = ref<string[]>([]);
const hoverPreset = ref<string | null>(null);
const showAddPresetPanel = ref(false);

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
    const index = expandedPresets.value.indexOf(key);
    if (index > -1) {
        expandedPresets.value.splice(index, 1);
    }
};

const addTag = () => {
    const newTag = newPresetTagInput.value.trim();
    if (newTag !== '' && !newPresetTags.value.includes(newTag)) {
        newPresetTags.value.push(newTag);
        newPresetTagInput.value = '';
    }
};

const removeTag = (index: number) => {
    newPresetTags.value.splice(index, 1);
};

const removeTagFromPreset = (key: string, tag: string) => {
    const tags = presetData.value[key].tags;
    const index = tags.indexOf(tag);
    if (index > -1) {
        tags.splice(index, 1);
        if (tags.length === 0) {
            removePreset(key);
        } else {
            savePresets();
        }
    }
};

const confirmAddPreset = () => {
    if (newPresetName.value.trim() !== '' && newPresetTags.value.length > 0) {
        presetData.value[newPresetName.value.trim()] = {
            tags: newPresetTags.value
        };
        savePresets();
        showAddPresetPanel.value = false;
        newPresetName.value = '';
        newPresetTagInput.value = '';
        newPresetTags.value = [];
    }
};

const toggleAddPresetPanel = () => {
    showAddPresetPanel.value = !showAddPresetPanel.value;
    if (!showAddPresetPanel.value) {
        newPresetName.value = '';
        newPresetTagInput.value = '';
        newPresetTags.value = [];
    }
};

const handleClickOutside = (_event: MouseEvent) => {
    if (showAddPresetPanel.value && !isAddPresetPanelContentPresent()) {
        showAddPresetPanel.value = false;
        newPresetName.value = '';
        newPresetTagInput.value = '';
        newPresetTags.value = [];
    }
};

const isAddPresetPanelContentPresent = () => {
    return newPresetName.value.trim() !== '' || newPresetTags.value.length > 0 || newPresetTagInput.value.trim() !== '';
};

const togglePreset = (key: string) => {
    const index = expandedPresets.value.indexOf(key);
    if (index > -1) {
        expandedPresets.value.splice(index, 1);
    } else {
        expandedPresets.value.push(key);
    }
};
</script>

<style scoped></style>