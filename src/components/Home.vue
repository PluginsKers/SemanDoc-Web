<template>
    <div class="py-10 pt-[48px]" :class="{ 'w-full': documents.length > 0 }">
        <div class="flex flex-col items-center lg:justify-center mx-auto lg:flex-row-reverse lg:items-start placeholder:text-gray-400 z-0"
            :class="{ 'md:max-w-2xl md:min-w-1xl lg:max-w-3xl lg:min-w-2xl': documents.length <= 0, 'lg:w-4/5': documents.length > 0 }">
            <div class="relative bg-white border-[1px] rounded-md md:shadow-sm p-4 pb-2 mb-4 w-full"
                :class="{ 'lg:w-1/3': documents.length > 0}">
                <h1 class="text-3xl font-bold text-center mb-4">文档管理</h1>
                <div class="flex flex-col justify-center gap-4">
                    <div class="flex flex-col mb-3 text-gray-900">
                        <div class="flex h-10">
                            <div
                                class="flex w-full flex-row relative h-10 border-[1px] border-gray-200 sm:text-sm rounded-tl-md">
                                <div
                                    class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
                                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input v-model="query" placeholder="检索内容"
                                    class="block p-2 pl-10 w-full h-full align-middle outline-none rounded-tl-md focus:bg-gray-50/50" />
                            </div>
                            <input v-model.number="k" type="number" min="1" placeholder="数量"
                                class="relative p-2 w-1/4 h-10 align-middle outline-none border-[1px] border-l-0 border-gray-200 sm:text-sm rounded-tr-md focus:bg-gray-50/50" />
                        </div>
                        <div class="flex h-10">
                            <input v-model.number="score_threshold" type="number" min="0" max="2" placeholder="分数阈值"
                                class="p-2 w-1/6 h-full text-center align-middle outline-none border-[1px] border-r-0 border-t-0 border-gray-200 sm:text-sm rounded-bl-md focus:bg-gray-50/50" />
                            <input v-model="filter" placeholder="条件过滤"
                                class="p-2 w-full h-full outline-none align-middle border-[1px] border-t-0 border-gray-200 sm:text-sm rounded-br-md rounded-br-md focus:bg-gray-50/50" />
                        </div>
                    </div>
                    <div @click="searchDocuments"
                        class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-200"
                        :class="{ 'bg-gray-800 cursor-not-allowed': queryingStatus == -1, 'bg-red-800': queryingStatus == -2, 'bg-green-700': queryingStatus == 1, 'bg-black hover:bg-gray-900': queryingStatus == 0 }">
                        <template v-if="queryingStatus == 1">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </template>

                        <template v-else-if="queryingStatus == -1">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
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
                        @click="showAddModal = true">
                        添加文档
                    </div>
                    <span class="text-center text-gray-300">注意：该系统为语义检索，调节阈值大小精确控制检索精度。</span>
                </div>
            </div>
            <ul v-show="documents.length > 0"
                class="w-full docs-list bg-white border-[1px] lg:mr-4 min-w-xl p-4 rounded-md md:shadow-sm">
                <li v-for="(document, index) in documents" :key="index" @click="openEditModel(index)"
                    class="p-2 flex flex-col cursor-pointer justify-between items-start rounded-md hover:ring-1 hover:ring-gray-200 hover:bg-gray-50/50">
                    <span class="text-gray-700">{{ document.page_content }}</span>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-500">标签:</span>
                        <span v-for="tag in document.metadata.tags" :key="tag"
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
                            {{ tag }}
                        </span>
                    </div>
                </li>
            </ul>
            <AddModel v-show="showAddModal" @documentAdded="handleDocumentAdded" @closeAddModel="closeAddModel" />
            <EditModel v-if="index > -1 && showEditModal" :index="index" :documents="documents"
                @documentRemoved="handleDocumentRemoved" @closeEditModal="closeEditModal" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document } from '../api/types';
import AddModel from './AddModel.vue';
import EditModel from './EditModel.vue';
import { queryDocuments } from '../api/documents';

const documents = ref<Document[]>([]);
const index = ref(-1);
const query = ref('');
const k = ref(20);
const filter = ref('{}');
const score_threshold = ref<number>(2.0)
const showAddModal = ref(false);
const showEditModal = ref(false);
const queryingStatus = ref(0);
let timer: any = null;

const openEditModel = (t_idx: number) => {
    index.value = t_idx;
    showEditModal.value = true;
}

const closeAddModel = () => {
    showAddModal.value = false;
}

const closeEditModal = () => {
    showEditModal.value = false;
}

const handleDocumentAdded = (newDocument: Document) => {
    documents.value.push(newDocument);
}

const handleDocumentRemoved = (removed_index: number) => {
    documents.value.splice(removed_index, 1);
}

const searchDocuments = async () => {
    if (queryingStatus.value == -1) return;
    queryingStatus.value = -1;
    clearTimeout(timer);
    try {
        const results = await queryDocuments(query.value, k.value, JSON.parse(filter.value), Number(score_threshold.value));
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
        animation: slideIn .4s cubic-bezier(0.5, 0, 0, 1) forwards;
    }
}
</style>./AddModel.vue./EditModel.vue
