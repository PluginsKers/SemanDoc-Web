<template>
    <div class="py-10 pt-[100px]">
        <div class="mx-auto max-w-lg placeholder:text-gray-400">
            <h1 class="text-3xl font-bold text-center mb-6">文档管理</h1>
            <div class="flex flex-col justify-center gap-4 mb-6">
                <input v-model="query" placeholder="相关检索"
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <div @click="searchDocuments"
                    :class="{ 'bg-gray-800': querying && !querySuccess, 'bg-green-700': querySuccess, 'bg-black hover:bg-gray-900': !querying && !querySuccess }"
                    class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    <template v-if="querySuccess">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </template>
                    <template v-else-if="querying">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </template>
                    <template v-else>
                        检索
                    </template>
                </div>
            </div>
            <div class="flex flex-col justify-center gap-4 mb-6">
                <input v-model="newData" placeholder="文档信息"
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <input v-model="newMetadata" placeholder="源信息格式"
                    class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <div @click="addDocument"
                    :class="{ 'bg-gray-800': adding && !addSuccess, 'bg-green-700': addSuccess, 'bg-black hover:bg-gray-900': !adding && !addSuccess }"
                    class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">
                    <template v-if="addSuccess">
                        <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                    </template>
                    <template v-else-if="adding">
                        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                            viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                    </template>
                    <template v-else>
                        添加文档
                    </template>
                </div>
            </div>
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
  
  
  
<script lang="ts">
import { defineComponent, ref } from 'vue';
import { Document } from '../api/types'
import { queryDocuments, removeDocuments, addDocument as _addDocument } from '../api/documents';

export default defineComponent({
    setup() {
        const documents = ref<Document[]>([]);
        const query = ref('');
        const newData = ref('');
        const querying = ref(false);
        const querySuccess = ref(false);
        const adding = ref(false);
        const addSuccess = ref(false);
        const newMetadata = ref('{"tags":[]}');

        const searchDocuments = async () => {
            if (querying.value) return;
            querying.value = true;
            querySuccess.value = false;
            try {
                const results = await queryDocuments(query.value, 10);
                documents.value = results;
                querySuccess.value = true;
                setTimeout(() => {
                    querySuccess.value = false;
                }, 4000);
                querying.value = false;
            } catch (error) {
                console.error('Error fetching documents:', error);
                querying.value = false;
            }
        };

        const removeDocument = async (index: number) => {
            const docId = documents.value[index].metadata['ids'];
            try {
                await removeDocuments([docId]);
                documents.value.splice(index, 1);
            } catch (error) {
                console.error('Error removing document:', error);
            }
        };

        const addDocument = async () => {
            if (adding.value) return;
            adding.value = true;
            addSuccess.value = false;
            try {
                const newDoc = await _addDocument(newData.value, JSON.parse(newMetadata.value));
                documents.value.push(newDoc[0]);
                newData.value = '';
                addSuccess.value = true;
                setTimeout(() => {
                    addSuccess.value = false;
                }, 4000);
                adding.value = false;
            } catch (error) {
                console.error('Error adding document:', error);
                adding.value = false;
            }
        };

        return {
            documents,
            query,
            querying,
            querySuccess,
            newData,
            adding,
            addSuccess,
            newMetadata,
            searchDocuments,
            removeDocument,
            addDocument
        };
    }
});
</script>
  
<style scoped></style>
  