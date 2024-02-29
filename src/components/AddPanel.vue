<template>
    <div class="flex flex-col justify-center gap-4 mb-6">
        <input v-model="newData" placeholder="文档信息"
            class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
        <input v-model="newMetadata" placeholder="源信息格式"
            class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
        <div @click="addDocument"
            :class="{ 'bg-gray-800': addingStatus == -1, 'bg-green-700': addingStatus == 1, 'bg-red-800': addingStatus == -2, 'bg-black hover:bg-gray-900': addingStatus == 0 }"
            class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
            <template v-if="addingStatus == 1">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                </svg>
            </template>
            <template v-else-if="addingStatus == -1">
                <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                    </circle>
                    <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                    </path>
                </svg>
            </template>
            <template v-else-if="addingStatus == -2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor" stroke-width="4">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </template>
            <template v-else>
                添加文档
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { addDocument as _addDocument } from '../api/documents';
import { defineEmits } from 'vue'; // Importing defineEmits for use with script setup

const newData = ref('');
const newMetadata = ref('{"tags":[]}');
const addingStatus = ref(0);
const emit = defineEmits(['documentAdded']);

const addDocument = async () => {
    if (addingStatus.value == -1) return;
    addingStatus.value = -1;
    try {
        const newDoc = await _addDocument(newData.value, JSON.parse(newMetadata.value));
        newData.value = '';
        newMetadata.value = '{"tags":[]}';
        addingStatus.value = 1;
        emit('documentAdded', newDoc);
    } catch (error) {
        console.error('添加文档错误:', error);
        addingStatus.value = -2;
    }
};
</script>
