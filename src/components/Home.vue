<template>
    <div class="py-10 pt-[100px]">
        <div class="mx-auto max-w-lg placeholder:text-gray-400">
            <h1 class="text-3xl font-bold text-center mb-6">文档管理</h1>
            <div class="flex flex-col justify-center gap-4 mb-6">
                <input v-model="query" placeholder="相关检索"
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <div @click="searchDocuments"
                    :class="{ 'bg-gray-800': queryingStatus == -1, 'bg-red-800': queryingStatus == -2, 'bg-green-700': queryingStatus == 1, 'bg-black hover:bg-gray-900': queryingStatus == 0 }"
                    class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    <template v-if="queryingStatus == 1">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </template>
                    <template v-else-if="queryingStatus == -1">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </template>
                    <template v-else-if="queryingStatus == -2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor" stroke-width="4">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </template>
                    <template v-else>
                        检索
                    </template>
                </div>
            </div>
            <AddPanel @documentAdded="handleDocumentAdded" />
            <ul>
                <li v-for="(document, index) in documents" :key="index"
                    class="border-b border-gray-200 py-2 flex justify-between items-center">
                    <span class="text-gray-700">{{ document.page_content }} - {{ document.metadata }}</span>
                    <div @click="removeDocument(index)"
                        class="flex justify-center items-center h-10 cursor-pointer select-none bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">
                        删除
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document } from '../api/types';
import AddPanel from './AddPanel.vue';
import { queryDocuments, removeDocuments } from '../api/documents';

const documents = ref<Document[]>([]);
const query = ref('');
const queryingStatus = ref(0);
let queryingTimer: any = null;

const handleDocumentAdded = (newDocument: Document) => {
    documents.value.push(newDocument);
}

const searchDocuments = async () => {
    if (queryingStatus.value == -1) return;
    queryingStatus.value = -1;
    clearTimeout(queryingTimer);
    try {
        const results = await queryDocuments(query.value, 10);
        documents.value = results;
        queryingStatus.value = 1;
        queryingTimer = setTimeout(() => {
            queryingStatus.value = 0;
        }, 4000);
    } catch (error) {
        queryingStatus.value = -2;
        console.error('检索文档错误:', error);
    }
};

const removeDocument = async (index: number) => {
    const docId = documents.value[index].metadata['ids'];
    try {
        await removeDocuments([docId]);
        documents.value.splice(index, 1);
    } catch (error) {
        console.error('删除文档错误:', error);
    }
};
</script>

<style scoped></style>
