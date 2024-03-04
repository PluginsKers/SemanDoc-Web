<template>
    <div class="py-10 pt-[56px]">
        <div
            class="flex flex-col items-center md:max-w-5xl lg:justify-center lg:flex-row-reverse lg:items-start mx-auto placeholder:text-gray-400 z-0">
            <div class="relative w-full max-w-2xl bg-white border-[1px] rounded-md md:shadow-sm p-4 pb-2 mb-4">
                <h1 class="text-3xl font-bold text-center mb-4">文档管理</h1>
                <div class="flex flex-col justify-center gap-4 mb-6">
                    <div class="flex flex-col">
                        <div class="flex">
                            <input v-model="query" placeholder="检索内容"
                                class="relative p-2 w-3/4 outline-none border-[1px] border-gray-200 text-gray-900 sm:text-sm leading-6 rounded-tl-md" />
                            <input v-model.number="k" type="number" min="1" placeholder="数量"
                                class="relative p-2 w-1/4 outline-none border-[1px] border-l-0 border-gray-200 text-gray-900 sm:text-sm leading-6 rounded-tr-md" />
                        </div>
                        <input v-model="filter" placeholder="条件过滤"
                            class="p-2 w-full outline-none text-gray-900 border-[1px] border-t-0 border-gray-200 sm:text-sm leading-6 rounded-bl-md rounded-br-md" />
                    </div>
                    <div @click="searchDocuments"
                        :class="{ 'bg-gray-800': queryingStatus == -1, 'bg-red-800': queryingStatus == -2, 'bg-green-700': queryingStatus == 1, 'bg-black hover:bg-gray-900': queryingStatus == 0 }"
                        class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-200">
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
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </template>
                        <template v-else>
                            检索
                        </template>
                    </div>
                    <div class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-black hover:bg-gray-900 text-white outline-none active:ring-[3px] active:ring-gray-200"
                        @click="showModal = true">
                        添加文档
                    </div>
                </div>
            </div>
            <ul v-show="documents.length > 1"
                class="grow docs-list bg-white border-[1px] lg:mr-4 max-w-2xl p-4 rounded-md md:shadow-sm">
                <li v-for="(document, index) in documents" :key="index"
                    class="border-b border-gray-200 py-2 flex justify-between items-center">
                    <span class="text-gray-700">{{ document.page_content }} - {{ document.metadata }}</span>
                    <div @click="removeDocument(index)"
                        class="flex justify-center items-center h-10 cursor-pointer select-none bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">
                        删除
                    </div>
                </li>
            </ul>
            <AddPanel v-show="showModal" @documentAdded="handleDocumentAdded" @closeModal="closeModal" />
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
const k = ref(6);
const filter = ref('{}');
const showModal = ref(false);
const queryingStatus = ref(0);
let timer: any = null;

const closeModal = () => {
    showModal.value = false;
}

const handleDocumentAdded = (newDocument: Document) => {
    documents.value.push(newDocument);
}

const searchDocuments = async () => {
    if (queryingStatus.value == -1) return;
    queryingStatus.value = -1;
    clearTimeout(timer);
    try {
        const results = await queryDocuments(query.value, k.value, JSON.parse(filter.value));
        documents.value = results;
        queryingStatus.value = 1;
        timer = setTimeout(() => {
            queryingStatus.value = 0;
        }, 3000);
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

<style scoped>
* {
    transition: all .2s !important;
}

@keyframes slideIn {
    from {
        margin-top: -100vh;
    }

    to {
        margin-top: 0px;
    }
}


@media (min-width: 992px) {
    .docs-list {
        animation: slideIn .5s ease forwards;
    }
}
</style>
