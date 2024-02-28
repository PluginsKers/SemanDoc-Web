<template>
    <div class="py-10 pt-[100px]">
        <div class="mx-auto max-w-lg placeholder:text-gray-400">
            <h1 class="text-3xl font-bold text-center mb-6">文档管理</h1>
            <div class="flex flex-col justify-center gap-4 mb-6">
                <input v-model="query" placeholder="相关检索"
                    class="mt-1 p-2 w-full outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <div @click="searchDocuments"
                    class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">检索</div>
            </div>
            <div class="flex flex-col justify-center gap-4 mb-6">
                <input v-model="newData" placeholder="文档信息"
                    class="mt-1 p-2 w-full outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <input v-model="newMetadata" placeholder="源信息格式"
                    class="mt-1 p-2 w-full outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-2 focus:border-gray-200 sm:text-sm sm:leading-6" />
                <div @click="addDocument"
                    class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black">添加文档</div>
            </div>
            <ul>
                <li v-for="(document, index) in documents" :key="index"
                    class="border-b border-gray-200 py-2 flex justify-between items-center">
                    <span class="text-gray-700">{{ document.page_content }} - {{ document.metadata }}</span>
                    <div @click="removeDocument(index)"
                        class="flex justify-center items-center h-10 cursor-pointer select-none bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">删除</div>
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
        const newMetadata = ref('{"tags":[]}');

        const searchDocuments = async () => {
            try {
                const results = await queryDocuments(query.value, 10);
                documents.value = results;
            } catch (error) {
                console.error('Error fetching documents:', error);
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
            try {
                const newDoc = await _addDocument(newData.value, JSON.parse(newMetadata.value));
                documents.value.push(newDoc[0]);
                newData.value = '';
            } catch (error) {
                console.error('Error adding document:', error);
            }
        };

        return {
            documents,
            query,
            newData,
            newMetadata,
            searchDocuments,
            removeDocument,
            addDocument
        };
    }
});
</script>
  
<style scoped></style>
  