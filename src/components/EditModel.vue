<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start md:py-4 z-20">
        <!-- 模态窗口内容，小屏幕设备全屏，大屏幕占据屏幕的绝大部分 -->
        <div
            class="bg-white w-screen h-full rounded-none md:rounded-md lg:max-w-lg w-full shadow-lg sm:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl overflow-auto">
            <!-- 模态窗口的子元素，如输入框、按钮等 -->
            <div class="flex flex-col justify-center h-full gap-4 p-6">
                <textarea
                    class="flex-1 mt-1 p-2 w-full min-h-40 h-40 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-[3px] focus:border-gray-100 text-sm leading-6"
                    :value="documents[index].page_content">
                </textarea>
                <input
                    class="shrink-0 mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-200 focus:ring-[3px] focus:border-gray-100 text-sm leading-6"
                    :value="JSON.stringify(documents[index].metadata)" />
                <div class="flex flex-wrap">
                    <div @click="removeDocument()"
                        class="flex justify-center items-center h-10 cursor-pointer select-none bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-xs">
                        删除
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
import { defineProps, defineEmits } from 'vue';
import { Document } from '../api/types';
import { removeDocuments } from '../api/documents';

const emit = defineEmits(['documentRemoved', 'closeEditModal']);

const closeEditModal = () => {
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
    if (index < 0) {
        return;
    }
    const docId = documents[index].metadata['ids'];
    try {
        await removeDocuments([docId]);
        emit('documentRemoved', index);
        closeEditModal();
    } catch (error) {
        console.error('删除文档错误:', error);
    }
};
</script>
