<template>
    <div class="home-container">
        <h1>Document Dashboard</h1>
        <div class="search-panel">
            <input v-model="query" placeholder="Enter search query" />
            <button @click="searchDocuments">Search</button>
        </div>
        <div class="add-document-form">
            <input v-model="newData" placeholder="Enter new data" />
            <input v-model="newMetadata" placeholder="Enter new metadata" />
            <button @click="addDocument">Add Document</button>
        </div>
        <ul class="document-list">
            <li v-for="(document, index) in documents" :key="index">
                {{ document.page_content }} - {{ document.metadata }}
                <button @click="removeDocument(index)">Delete</button>
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
  
<style>
.home-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
}

.search-panel,
.add-document-form {
    margin-bottom: 20px;
}

.document-list {
    list-style: none;
    padding: 0;
}

.document-list li {
    margin: 10px 0;
}
</style>
  