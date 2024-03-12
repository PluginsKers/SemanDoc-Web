<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start md:py-4 z-20">
        <!-- 模态窗口内容，小屏幕设备全屏，大屏幕占据屏幕的绝大部分 -->
        <div
            class="bg-white w-screen h-full rounded-none md:rounded-md lg:max-w-lg w-full shadow-lg sm:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl overflow-auto">
            <!-- 模态窗口的子元素，如输入框、按钮等 -->
            <div class="flex flex-col justify-center h-full gap-4 p-6">
                <textarea v-model="newData" placeholder="文档信息"
                    class="flex-1 mt-1 p-2 w-full min-h-40 h-40 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:border-gray-50 text-sm leading-6">
                </textarea>
                <input v-model="newMetadata" placeholder="源信息格式"
                    class="shrink-0 mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:border-gray-50 text-sm leading-6" />
                <div class="flex flex-wrap">
                    <div class="cursor-pointer select-none bg-gray-200 rounded-md p-2 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
                        v-for="metadata, name in presets" :key="name" @click="newMetadata = JSON.stringify(metadata)">{{
                    name
                }}</div>
                </div>
                <div class="flex-none flex justify-between items-center">
                    <div @click="addDocument"
                        class="cursor-pointer select-none h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100"
                        :class="{ 'bg-gray-800 cursor-not-allowed': addingStatus == -1, 'bg-green-700': addingStatus == 1, 'bg-red-800': addingStatus == -2, 'bg-black hover:bg-gray-900': addingStatus == 0 }">
                        <template v-if="addingStatus == 1">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </template>
                        <template v-else-if="addingStatus == -1">
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
                        <template v-else-if="addingStatus == -2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </template>
                        <template v-else>
                            添加文档
                        </template>
                    </div>
                    <div @click="closeAddModel"
                        class="flex justify-center items-center h-10 cursor-pointer select-none py-2 px-4 bg-gray-200 h-10 rounded-md text-sm font-medium text-gray-800 outline-none hover:ring-[3px] hover:ring-gray-100">
                        取消
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';
import { addDocument as _addDocument } from '../api/documents';

const newData = ref('');
const newMetadata = ref('{"tags":[]}');
const addingStatus = ref(0);
const emit = defineEmits(['documentAdded', 'closeAddModel']);
let timer: any = null;

const presets = {
    "通用": { "tags": ["通用"] },
    "人工智能学院": { "tags": ["人工智能学院"] },
    "机电工程学院": { "tags": ["机电工程学院"] },
    "化学工程学院": { "tags": ["化学工程学院"] },
    "建筑与艺术学院": { "tags": ["建筑与艺术学院"] },
    "国际商旅学院": { "tags": ["国际商旅学院"] },
    "供应链管理学院": { "tags": ["供应链管理学院"] },
    "阳明学院": { "tags": ["阳明学院"] },
    "数字商贸学院": { "tags": ["数字商贸学院"] },
    "马克思主义学院": { "tags": ["马克思主义学院"] },
    "继续教育学院": { "tags": ["继续教育学院"] },
    "公共基础学院": { "tags": ["公共基础学院"] }
}

const closeAddModel = () => {
    emit('closeAddModel');
}

const addDocument = async () => {
    if (addingStatus.value == -1) return;
    addingStatus.value = -1;
    clearTimeout(timer);
    try {
        const newDoc = await _addDocument(newData.value, JSON.parse(newMetadata.value));
        addingStatus.value = 1;
        emit('documentAdded', newDoc[0]);
        emit('closeAddModel');
        timer = setTimeout(() => {
            addingStatus.value = 0;
        }, 3000);
    } catch (error) {
        console.error('添加文档错误:', error);
        addingStatus.value = -2;
    }
};
</script>
