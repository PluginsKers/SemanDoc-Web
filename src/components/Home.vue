<template>
    <div class="mx-auto py-10 pt-20">
        <h1 class="text-3xl font-bold text-center mb-6">文档管理</h1>
        <div class="flex flex-col justify-center gap-4 mb-6">
            <input v-model="query" placeholder="相关检索"
                class="border-2 border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none" />
            <button @click="searchDocuments"
                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">检索</button>
        </div>
        <div class="flex flex-col justify-center gap-4 mb-6">
            <input v-model="newData" placeholder="文档信息"
                class="border-2 border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none" />
            <input v-model="newMetadata" placeholder="源信息格式"
                class="border-2 border-gray-200 rounded-lg p-2 focus:border-blue-500 focus:outline-none" />
            <button @click="addDocument" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">添加文档</button>
        </div>
        <ul>
            <li v-for="(document, index) in documents" :key="index"
                class="border-b border-gray-200 py-2 flex justify-between items-center">
                <span class="text-gray-700">{{ document.page_content }} - {{ document.metadata }}</span>
                <button @click="removeDocument(index)"
                    class="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">删除</button>
            </li>
        </ul>
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
        const newMetadata = ref('');

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
                newMetadata.value = '';
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
  