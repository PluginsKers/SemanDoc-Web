<template>
	<div
		class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start md:py-4 z-20">
		<div
			@click="closeEditModal"
			class="absolute align-middle font-bold top-2 right-2 ring-1 ring-gray-300 bg-gray-100 p-[2px] text-[9px] rounded-sm shadow-sm cursor-pointer text-gray-700 hidden md:block">
			ESC
		</div>
		<!-- 模态窗口内容，小屏幕设备全屏，大屏幕占据屏幕的绝大部分 -->
		<div
			class="bg-white w-screen h-full rounded-none md:rounded-md lg:max-w-lg shadow-lg sm:w-full md:max-w-2xl xl:max-w-5xl overflow-auto">
			<!-- 模态窗口的子元素，如输入框、按钮等 -->
			<div class="flex flex-col justify-center h-full gap-2 p-6">
				<textarea
					class="flex-1 mt-1 p-2 w-full min-h-40 h-40 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6"
					v-model="documents[index].content">
				</textarea>
				<input
					class="shrink-0 mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-400 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6"
					:value="JSON.stringify(documents[index].metadata)" />
				<div
					class="bg-gray-100 rounded-md p-2 text-sm grid grid-cols-2 gap-2">
					<!-- 标签和分类组 -->
					<div class="col-span-2 space-y-2">
						<!-- 标签输入 -->
						<div class="flex flex-col">
							<input
								v-model="tags_input"
								@keydown.enter.prevent="addTag"
								@keydown.delete="checkForDelete"
								placeholder="添加标签"
								class="outline-none rounded-sm h-9 px-2 w-full text-sm border-b-2"
								:class="{
									'border-dashed rounded-b-none border-gray-200':
										tags.length > 0,
									'border-white': tags.length <= 0,
								}" />
							<div
								class="flex flex-row flex-wrap ml-1 gap-1"
								:class="{ 'py-1': tags.length > 0 }">
								<div
									v-for="(tag, index) in tags"
									:key="index"
									@click="removeTag(index)"
									class="tag-item cursor-pointer select-none bg-gray-100 text-black text-xs px-2.5 py-1 rounded-md hover:bg-gray-200 hover:scale-105 flex items-center gap-1 border border-gray-200 shadow-sm">
									<span>{{ tag }}</span>
									<svg
										class="w-3 h-3 text-gray-500"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd" />
									</svg>
								</div>
							</div>
						</div>
						<!-- 分类输入 -->
						<div class="flex flex-col">
							<input
								v-model="categories_input"
								@keydown.enter.prevent="addCategory"
								@keydown.delete="checkForDeleteCategory"
								placeholder="添加分类"
								class="outline-none rounded-sm h-9 px-2 w-full text-sm border-b-2"
								:class="{
									'border-dashed rounded-b-none border-gray-200':
										categories.length > 0,
									'border-white': categories.length <= 0,
								}" />
							<div
								class="flex flex-row flex-wrap ml-1 gap-1"
								:class="{ 'py-1': categories.length > 0 }">
								<div
									v-for="(category, index) in categories"
									:key="index"
									@click="removeCategory(index)"
									class="category-item cursor-pointer select-none bg-black text-white text-xs px-2.5 py-1 rounded-md hover:bg-gray-800 hover:scale-105 flex items-center gap-1 shadow-sm">
									<span>{{ category }}</span>
									<svg
										class="w-3 h-3 text-gray-300"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
											clip-rule="evenodd" />
									</svg>
								</div>
							</div>
						</div>
					</div>

					<div
						@click="removeDocument()"
						class="flex relative justify-center shadow-sm items-center h-9 select-none py-1.5 px-4 rounded outline-none active:ring-[3px] active:ring-gray-50"
						:class="{
							'bg-gray-800 cursor-not-allowed text-white':
								removingStatus == -1,
							'bg-red-800 text-white cursor-pointer':
								removingStatus == -2,
							'bg-orange-600 hover:bg-orange-600/90 text-white cursor-pointer':
								removingStatus == -3,
							'bg-green-700 text-white cursor-pointer':
								removingStatus == 1,
							'bg-black hover:bg-gray-900 text-white cursor-pointer':
								removingStatus == 0,
						}">
						<template v-if="removingStatus == 1">
							<svg
								class="w-5 h-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
						</template>

						<template v-else-if="removingStatus == -1">
							<svg
								class="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</template>

						<template v-else-if="removingStatus == -2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="4">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</template>

						<template v-else-if="removingStatus == -3">
							<div
								class="absolute top-0 left-0 h-full w-full flex justify-center items-center"
								@click="confirmRemoval = true">
								确认删除
							</div>
						</template>

						<template v-else> 删除 </template>
					</div>

					<div
						@click="updateDocument()"
						class="flex justify-center shadow-sm items-center h-9 select-none py-1.5 px-4 rounded outline-none active:ring-[3px] active:ring-gray-50"
						:class="{
							'bg-gray-800 cursor-not-allowed text-white':
								modifyingStatus == -1,
							'bg-green-700 text-white cursor-pointer':
								modifyingStatus == 1,
							'bg-red-800 text-white cursor-pointer':
								modifyingStatus == -2,
							'bg-black hover:bg-gray-900 text-white cursor-pointer':
								modifyingStatus == 0,
						}">
						<template v-if="modifyingStatus == 1">
							<svg
								class="w-5 h-5"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
									clip-rule="evenodd" />
							</svg>
						</template>

						<template v-else-if="modifyingStatus == -1">
							<svg
								class="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24">
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"></circle>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
						</template>

						<template v-else-if="modifyingStatus == -2">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-5 w-5 text-white"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								stroke-width="4">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									d="M6 18L18 6M6 6l12 12" />
							</svg>
						</template>

						<template v-else> 修改 </template>
					</div>

					<div
						@click="closeEditModal"
						class="col-span-2 flex justify-center shadow-sm items-center h-9 cursor-pointer select-none py-2 px-4 rounded-md bg-black hover:bg-gray-900 text-white outline-none active:ring-[3px] active:ring-gray-100">
						关闭
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import { Document } from "../types";
import {
	deleteDocument,
	updateDocument as updateDocumentApi,
} from "@/api/documents";
import { useNotificationManager } from "@/notificationManager";

const { addNotification } = useNotificationManager();

const removingStatus = ref(0);
const modifyingStatus = ref(0);
const confirmRemoval = ref(false);
const emit = defineEmits([
	"documentRemoved",
	"documentModify",
	"closeEditModal",
]);
let timer: any = null;

const handleEsc = (event: { key: string }) => {
	if (event.key === "Escape") {
		closeEditModal();
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleEsc);
});

const closeEditModal = () => {
	confirmRemoval.value = false;
	if (removingStatus.value != -1 && modifyingStatus.value != -1) {
		emit("closeEditModal");
	}
};

const { index, documents } = defineProps({
	index: {
		type: Number,
		default: -1,
	},
	documents: {
		type: Array<Document>,
		default: [],
	},
});

// 标签和分类管理
const tags = ref<string[]>(documents[index]?.metadata?.tags || []);
const tags_input = ref("");
const categories = ref<string[]>(documents[index]?.metadata?.categories || []);
const categories_input = ref("");

// 标签管理逻辑
const addTag = () => {
	if (
		tags_input.value.trim() !== "" &&
		!tags.value.includes(tags_input.value)
	) {
		tags.value.push(tags_input.value);
		tags_input.value = "";
	}
};

const removeTag = (index: number) => {
	tags.value.splice(index, 1);
};

const checkForDelete = () => {
	if (tags_input.value === "") {
		tags.value.pop();
	}
};

// 分类管理逻辑
const addCategory = () => {
	if (
		categories_input.value.trim() !== "" &&
		!categories.value.includes(categories_input.value)
	) {
		categories.value.push(categories_input.value);
		categories_input.value = "";
	}
};

const removeCategory = (index: number) => {
	categories.value.splice(index, 1);
};

const checkForDeleteCategory = () => {
	if (categories_input.value === "") {
		categories.value.pop();
	}
};

const updateDocument = async () => {
	if (modifyingStatus.value == -1 || removingStatus.value == -1) return;
	modifyingStatus.value = -1;
	const data = documents[index].content;
	const metadata = {
		...documents[index].metadata,
		tags: tags.value,
		categories: categories.value,
	};
	const docId = metadata["id"];
	if (!docId) {
		modifyingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "更新失败：文档ID不存在",
		});
		return;
	}
	try {
		const updatedDoc = await updateDocumentApi(docId, data, metadata);
		emit("documentModify", updatedDoc);
		modifyingStatus.value = 1;
	} catch (error) {
		modifyingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "文档更新失败",
		});
		console.error("Update failed:", error);
	}
};

const removeDocument = async () => {
	if (removingStatus.value == -1 || modifyingStatus.value == -1) return;
	clearTimeout(timer);
	if (confirmRemoval.value === false) {
		removingStatus.value = -3;
		timer = setTimeout(() => {
			removingStatus.value = 0;
			confirmRemoval.value = false;
		}, 5000);
		return;
	}
	if (index < 0) {
		removingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "删除失败：文档索引无效",
		});
		return;
	}
	removingStatus.value = -1;
	const docId = documents[index].metadata["id"];
	if (!docId) {
		removingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "删除失败：文档ID不存在",
		});
		return;
	}
	try {
		await deleteDocument(docId);
		emit("documentRemoved", index);
		removingStatus.value = 1;
		closeEditModal();
	} catch (error) {
		removingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "文档删除失败",
		});
		console.error("Delete failed:", error);
	}
};
</script>

<style scoped>
.tag-item {
	transition: all 0.15s ease-in-out !important;
}

.category-item {
	transition: all 0.15s ease-in-out !important;
}

@keyframes pop-in {
	0% {
		opacity: 0;
		transform: scale(0.8);
	}
	70% {
		transform: scale(1.1);
	}
	100% {
		opacity: 1;
		transform: scale(1);
	}
}

.tag-item,
.category-item {
	animation: pop-in 0.3s forwards;
}
</style>
