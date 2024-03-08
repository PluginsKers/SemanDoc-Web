<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start md:py-4 z-20">
        <!-- 模态窗口内容，小屏幕设备全屏，大屏幕占据屏幕的绝大部分 -->
        <div
            class="bg-white w-screen h-full rounded-none md:rounded-md lg:max-w-lg w-full shadow-lg sm:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl overflow-auto">
            <!-- 模态窗口的子元素，如输入框、按钮等 -->
            <div class="flex flex-col justify-center h-full gap-4 p-6">
                <textarea
                    class="flex-1 mt-1 p-2 w-full min-h-40 h-40 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:border-gray-100 text-sm leading-6"
                    :value="documents[index].page_content">
                </textarea>
                <input
                    class="shrink-0 mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:border-gray-100 text-sm leading-6"
                    :value="JSON.stringify(documents[index].metadata)" />
                <div class="flex flex-wrap">
                    <div @click="removeDocument()"
                        class="flex justify-center items-center h-10 cursor-pointer select-none text-white font-bold py-1 px-4 rounded text-xs outline-none active:ring-[3px] active:ring-gray-200"
                        :class="{ 'bg-gray-800 cursor-not-allowed': removingStatus == -1, 'bg-red-800': removingStatus == -2, 'bg-orange-500 hover:bg-orange-600': removingStatus == -3, 'bg-green-700': removingStatus == 1, 'bg-red-500 hover:bg-red-700': removingStatus == 0 }">
                        <template v-if="removingStatus == 1">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </template>

                        <template v-else-if="removingStatus == -1">
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

                        <template v-else-if="removingStatus == -2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </template>

                        <template v-else-if="removingStatus == -3">
                            <div @click="confirmRemoval = true">确认删除</div>
                        </template>

                        <template v-else>
                            删除
                        </template>
                    </div>
                </div>
                <div @click="closeEditModal"
                    class="flex justify-center items-center h-10 cursor-pointer select-none py-2 px-4 bg-gray-200 h-10 hover:bg-gray-300 rounded-md text-sm font-medium text-gray-800 outline-none active:ring-[3px] active:ring-gray-100">
                    取消
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';
import { Document } from '../api/types';
import { removeDocuments } from '../api/documents';

const removingStatus = ref(0);
const confirmRemoval = ref(false);
const emit = defineEmits(['documentRemoved', 'closeEditModal']);

const closeEditModal = () => {
    confirmRemoval.value = false;
    emit('closeEditModal');
}

const { index, documents } = defineProps({
    index: {
        type: Number,
        default: -1
    },
    documents: {
        type: Array<Document>,
        default: [],
    }
});

const removeDocument = async () => {
    if (removingStatus.value == -1) return;
    if (confirmRemoval.value === false) {
        removingStatus.value = -3;
        return;
    }
    if (index < 0) {
        removingStatus.value = -2;
        return;
    }
    removingStatus.value = -1;
    const docId = documents[index].metadata['ids'];
    try {
        await removeDocuments([docId]);
        emit('documentRemoved', index);
        removingStatus.value = 2;
        closeEditModal();
    } catch (error) {
        removingStatus.value = -2;
        console.error('删除文档错误:', error);
    }
};
</script>
