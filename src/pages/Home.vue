<template>
	<div class="py-10 pt-[48px]" :class="{ 'w-full': documents.length > 0 }">
		<div
			class="flex flex-col items-center lg:justify-center lg:flex-row-reverse lg:items-start placeholder:text-gray-400 z-0"
			:class="{
				'md:max-w-2xl md:min-w-1xl lg:max-w-3xl lg:min-w-2xl mx-auto':
					documents.length <= 0,
				'w-full': documents.length > 0,
			}">
			<div
				id="ctlpanel"
				class="relative lg:sticky lg:top-[48px] bg-white rounded-md md:shadow-sm p-4 mb-4 w-full"
				:class="{ 'lg:w-1/3': documents.length > 0 }">
				<h1 class="text-3xl font-bold text-center mb-4">数据管理</h1>
				<div class="flex flex-col justify-center gap-2">
					<div class="flex flex-col mb-3 text-gray-900">
						<div class="flex h-9">
							<div
								class="flex w-full flex-row relative h-9 border-[1px] border-gray-200 text-sm rounded-tl-md">
								<div
									class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
									<svg
										class="h-5 w-5 text-gray-400"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
											clip-rule="evenodd" />
									</svg>
								</div>
								<input
									ref="searchInput"
									id="input-search"
									@keydown.enter.prevent="searchDocuments"
									v-model="query"
									placeholder="检索关键词"
									class="block p-2 pl-10 w-full h-full align-middle outline-none rounded-tl-md focus:bg-gray-50/50 hover:bg-gray-50/50" />
							</div>
							<input
								id="input-max-documents"
								v-model="k"
								placeholder="数量"
								@wheel="handleWheelK($event, 0, 50, 1)"
								class="relative p-2 w-1/6 h-9 text-center align-middle outline-none border-[1px] border-l-0 border-gray-200 text-sm rounded-tr-md focus:bg-gray-50/50 hover:bg-gray-50/50"
								title="设置要返回的最大文档数量（1-50）" />
						</div>
						<div class="flex h-9">
							<input
								id="input-score-threshold"
								v-model="score_threshold"
								placeholder="分数阈值"
								@wheel="handleWheelSH($event, 0, 2, 0.02)"
								class="p-2 w-1/6 h-full text-center align-middle outline-none border-[1px] border-r-0 border-t-0 border-gray-200 text-sm rounded-bl-md focus:bg-gray-50/50 hover:bg-gray-50/50"
								title="设置文档相似度的最低阈值（0-2），值越低匹配越严格" />
							<input
								id="input-filter-string"
								v-model="filterString"
								placeholder="条件过滤"
								class="p-2 w-full h-full outline-none align-middle border-[1px] border-t-0 text-gray-400 border-gray-200 text-sm rounded-br-md focus:bg-gray-50/50 hover:bg-gray-50/50" />
						</div>
					</div>
					<h1 class="text-2xl ml-1">更多配置</h1>
					<div id="btn-presets" class="flex flex-wrap">
						<!-- 标签和分类管理 -->
						<div
							class="shrink-0 flex-col mb-2 p-0 w-full rounded-md text-gray-900 ring-1 ring-gray-200 text-xs leading-6">
							<div class="flex flex-row gap-2">
								<div class="w-1/2 relative">
									<input
										v-model="tags_input"
										@keydown.enter.prevent="addTag"
										@keydown.delete="checkForDelete"
										placeholder="添加标签"
										class="tags-input outline-none rounded-md h-9 px-2 w-full text-sm pl-8 border-b-2 mt-[2px]"
										:class="{
											'border-dashed rounded-b-none border-gray-200':
												tags.length > 0 ||
												categories.length > 0,
											'border-transparent':
												tags.length <= 0 &&
												categories.length <= 0,
										}" />
									<svg
										class="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
											clip-rule="evenodd" />
									</svg>
								</div>
								<div class="h-9 flex items-center">
									<div
										class="h-full w-px bg-gray-200 border-l border-dashed"></div>
								</div>
								<div class="w-1/2 relative">
									<input
										v-model="categories_input"
										@keydown.enter.prevent="addCategory"
										@keydown.delete="checkForDeleteCategory"
										placeholder="添加分类"
										class="categories-input outline-none rounded-md h-9 px-2 w-full text-sm pl-8 border-b-2 mt-[2px]"
										:class="{
											'border-dashed rounded-b-none border-gray-200':
												categories.length > 0 ||
												tags.length > 0,
											'border-transparent':
												categories.length <= 0 &&
												tags.length <= 0,
										}" />
									<svg
										class="absolute left-2 top-2.5 h-4 w-4 text-gray-400"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
									</svg>
								</div>
							</div>

							<div
								class="flex flex-row flex-wrap"
								:class="{
									'py-1.5 ml-1 gap-1.5 mt-1':
										tags.length > 0 ||
										categories.length > 0,
								}">
								<div
									v-for="(tag, index) in tags"
									:key="'tag-' + index"
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
								<div
									v-for="(category, index) in categories"
									:key="'category-' + index"
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
							<p
								v-if="duplicateTag || duplicateCategory"
								class="m-1 text-red-500 text-xs italic">
								标签已存在，不能重复添加。
							</p>
						</div>

						<!-- 预设选择 -->
						<div
							class="cursor-pointer select-none bg-gray-200 rounded-sm text-xs px-2.5 py-1 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
							v-for="(metadata, name) in JSON.parse(presets)"
							:key="name"
							@click="filter = metadata">
							{{ name }}
						</div>
					</div>
					<div
						id="btn-query"
						@click="searchDocuments"
						class="relative flex justify-center items-center h-9 w-full py-1.5 px-4 select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-200"
						:class="{
							'bg-gray-800 cursor-not-allowed':
								queryingStatus == -1,
							'bg-red-800 cursor-pointer': queryingStatus == -2,
							'bg-green-700 cursor-pointer': queryingStatus == 1,
							'bg-black hover:bg-gray-900 cursor-pointer':
								queryingStatus == 0,
						}">
						<template v-if="queryingStatus == 1">
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

						<template v-else-if="queryingStatus == -1">
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

						<template v-else-if="queryingStatus == -2">
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

						<template v-else>
							检索
							<svg
								t="1710430252577"
								class="w-6 h-5 ml-1 mb-[-1.5px] bg-gray-50 rounded-sm"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="1921">
								<path
									d="M810.666667 256a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H316.16l55.466667-55.04a42.666667 42.666667 0 0 0-60.586667-60.586667l-128 128a42.666667 42.666667 0 0 0-8.96 14.08 42.666667 42.666667 0 0 0 0 32.426667 42.666667 42.666667 0 0 0 8.96 14.08l128 128a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667L316.16 597.333333H725.333333a128 128 0 0 0 128-128V298.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z"
									p-id="1922"
									fill="#000"></path>
							</svg>
						</template>
					</div>
					<div
						id="btn-adddoc"
						class="flex justify-center items-center h-9 cursor-pointer select-none w-full py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-black hover:bg-gray-900 text-white outline-none active:ring-[3px] active:ring-gray-200"
						@click="showAddModal = true">
						添加文档
					</div>
					<div
						ref="excludeRef"
						class="flex justify-center items-center h-9 cursor-pointer select-none w-full py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium"
						:class="
							confirmDelete
								? 'bg-red-900 hover:bg-red-800 text-white'
								: 'bg-red-700 hover:bg-red-800 text-white'
						"
						@click="handleDeleteClick"
						v-if="selectedDocuments.length > 0">
						{{ confirmDelete ? "确认删除?" : "删除文档" }}
					</div>
				</div>
			</div>
			<ul
				ref="docsList"
				v-show="documents.length > 0"
				class="w-full docs-list bg-white lg:mr-4 min-w-xl p-4 rounded-md shadow-sm overflow-hidden"
				@mousedown="handleMouseDown"
				@mousemove="handleMouseMove"
				@mouseup="handleMouseUp"
				@mouseleave="handleMouseLeave">
				<li
					v-for="(document, index) in documents"
					:key="index"
					@click="openEditModel(index)"
					:class="{
						'select-none bg-gray-200 rounded-none hover:bg-gray-200':
							selectedDocuments.includes(index),
						'hover:ring-1 hover:ring-gray-200 hover:bg-gray-50/50':
							!selectedDocuments.includes(index),
						'rounded-t-md':
							index === selectedDocuments[0] &&
							selectedDocuments.includes(index),
						'rounded-b-md':
							index ===
								selectedDocuments[
									selectedDocuments.length - 1
								] && selectedDocuments.includes(index),
					}"
					class="document-item p-2 flex flex-col cursor-pointer justify-between items-start rounded-md w-full">
					<span
						class="text-gray-700 break-all whitespace-pre-wrap w-full overflow-hidden"
						>{{ document.content || document }}</span
					>
					<div
						v-if="
							document.metadata?.categories &&
							document.metadata.categories.length > 0
						"
						class="flex flex-wrap items-center gap-1.5 mt-1.5">
						<span class="text-xs text-gray-500">分类:</span>
						<span
							v-for="category in document.metadata.categories"
							:key="category"
							class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-black text-white">
							{{ category }}
						</span>
					</div>
					<div
						v-if="
							document.metadata?.tags &&
							document.metadata.tags.length > 0
						"
						class="flex flex-wrap items-center gap-1.5 mt-1.5">
						<span class="text-xs text-gray-500">标签:</span>
						<span
							v-for="tag in document.metadata.tags"
							:key="tag"
							class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
							{{ tag }}
						</span>
					</div>
				</li>
			</ul>
			<AddModel
				v-show="showAddModal"
				@documentAdded="handleDocumentAdded"
				@closeAddModel="closeAddModel"
				:presets="presets" />
			<EditModel
				v-if="index > -1 && showEditModal"
				:index="index"
				:documents="documents"
				@documentRemoved="handleDocumentRemoved"
				@documentModify="handleDocumentModified"
				@closeEditModal="closeEditModal" />
		</div>
	</div>
</template>

<script setup lang="ts">
import {
	nextTick,
	ref,
	watch,
	onMounted,
	onBeforeUnmount,
	computed,
} from "vue";
import { useDocumentsStore } from "@/store/documents";
import { Document } from "@/types";
import AddModel from "@/components/AddModel.vue";
import EditModel from "@/components/EditModel.vue";
import { deleteDocument } from "@/api/documents";
import { useNotificationManager } from "@/notificationManager";

const store = useDocumentsStore();
const searchResults = computed(() => store.getSearchResults);

const { addNotification } = useNotificationManager();

const presets = ref("{}");

const documents = ref<Document[]>(searchResults.value);
const index = ref(-1);
const query = ref("");
const k = ref(20);
const docsList = ref<any>(null);
const excludeRef = ref<any>(null);
const filter = ref<any>({ tags: [], categories: [] });
const filterString = ref(JSON.stringify(filter.value));
const score_threshold = ref<string>("2.0");
const showAddModal = ref(false);
const showEditModal = ref(false);
const queryingStatus = ref(0);
const tags = ref<string[]>(filter.value.tags);
const tags_input = ref("");
const duplicateTag = ref(false);
const confirmDelete = ref(false);
const categories = ref<string[]>(filter.value.categories);
const categories_input = ref("");
const duplicateCategory = ref(false);

let timer: any = null;

const selectedDocuments = ref<number[]>([]);
let isSelecting = ref(false);
let startDocument = ref<number | null>(null);

const searchInput = ref<HTMLInputElement | null>(null);

const handleKeyDown = (event: KeyboardEvent) => {
	if (event.ctrlKey && event.key === "f") {
		event.preventDefault();
		searchInput.value?.focus();
	}
};

onMounted(() => {
	document.addEventListener("click", handleClickOutside);
	document.addEventListener("keydown", handleKeyDown);
	const presetsKey = "presets";
	const storedPresets = localStorage.getItem(presetsKey);
	if (!storedPresets) {
		const defaultPresets = JSON.stringify({
			通用: { categories: ["通用"] },
		});
		localStorage.setItem(presetsKey, defaultPresets);
		presets.value = defaultPresets;
	} else {
		presets.value = storedPresets;
	}
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
	document.removeEventListener("keydown", handleKeyDown);
});

// 鼠标滚轮逻辑实现
const handleWheelK = (
	event: any,
	min: number,
	max: number,
	step: number = 1,
) => {
	event.preventDefault();
	const delta = event.deltaY;
	let value = Number(k.value);
	if (delta < 0 && value < max) {
		k.value = value + step;
	} else if (delta > 0 && value > min) {
		k.value = value - step;
	}
};

const handleWheelSH = (
	event: any,
	min: number,
	max: number,
	step: number = 1,
) => {
	event.preventDefault();
	const delta = event.deltaY;
	let value = Number(score_threshold.value);
	if (delta < 0 && value < max) {
		score_threshold.value = (Number(value) + step).toFixed(2);
	} else if (delta > 0 && value > min) {
		score_threshold.value = (Number(value) - step).toFixed(2);
	}
};

// 标签管理逻辑实现
const addTag = () => {
	if (
		tags_input.value.trim() !== "" &&
		!tags.value.includes(tags_input.value)
	) {
		tags.value.push(tags_input.value);
		tags_input.value = "";
		duplicateTag.value = false;
	} else {
		duplicateTag.value = true;
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

// 分类管理逻辑实现
const addCategory = () => {
	if (
		categories_input.value.trim() !== "" &&
		!categories.value.includes(categories_input.value)
	) {
		categories.value.push(categories_input.value);
		categories_input.value = "";
		duplicateCategory.value = false;
	} else {
		duplicateCategory.value = true;
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

// 编辑模态框实现
const openEditModel = (t_idx: number) => {
	confirmDelete.value = false;
	index.value = t_idx;
	showEditModal.value = true;
	selectedDocuments.value = [];
};

const closeEditModal = () => {
	showEditModal.value = false;
};

const closeAddModel = () => {
	showAddModal.value = false;
};

const handleDocumentModified = (newDocument: Document) => {
	documents.value[index.value] = newDocument;
	addNotification({
		id: new Date().getTime(),
		message: "文档更新成功",
	});
};

const handleDocumentAdded = async (newDocument: Document) => {
	documents.value.unshift(newDocument);
	addNotification({
		id: new Date().getTime(),
		message: "文档添加成功",
	});
	await nextTick();
	const liElements = document.querySelectorAll(".document-item");
	liElements[0].classList.remove("new");
	setTimeout(() => {
		liElements[0].classList.add("new");
	}, 0);
};

const handleDocumentRemoved = (removed_index: number) => {
	selectedDocuments.value = [];
	documents.value.splice(removed_index, 1);
	addNotification({
		id: new Date().getTime(),
		message: "文档删除成功",
	});
};

const searchDocuments = async () => {
	if (queryingStatus.value == -1) return;
	queryingStatus.value = -1;
	clearTimeout(timer);
	try {
		await store.searchDocuments(
			query.value,
			k.value,
			tags.value,
			filter.value.categories,
			Number(score_threshold.value),
		);
		queryingStatus.value = 1;
		addNotification({
			id: new Date().getTime(),
			message: "搜索成功",
		});
		timer = setTimeout(() => {
			queryingStatus.value = 0;
		}, 3000);
	} catch (error) {
		queryingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "搜索失败",
		});
		console.error("Search failed:", error);
	}
};

watch(
	tags,
	(newTag: string[]) => {
		filter.value.tags = newTag;
	},
	{ deep: true },
);

watch(
	categories,
	(newCategories: string[]) => {
		filter.value.categories = newCategories;
	},
	{ deep: true },
);

watch(
	filter,
	(newFilter) => {
		filterString.value = JSON.stringify(newFilter);
		tags.value = newFilter.tags;
		categories.value = newFilter.categories;
		duplicateTag.value = false;
		duplicateCategory.value = false;
	},
	{ deep: true },
);

// 处理鼠标选择和多选删除
const handleMouseDown = (event: MouseEvent) => {
	if (event.button !== 0) return; // 只处理左键点击
	confirmDelete.value = false;
	isSelecting.value = true;
	startDocument.value = getDocumentIndexFromEvent(event);
	if (!event.ctrlKey) {
		selectedDocuments.value =
			startDocument.value !== null ? [startDocument.value] : [];
	} else {
		if (
			startDocument.value !== null &&
			!selectedDocuments.value.includes(startDocument.value)
		) {
			selectedDocuments.value.push(startDocument.value);
		}
	}
};

const handleMouseMove = (event: MouseEvent) => {
	if (!isSelecting.value) return;
	const currentDocument = getDocumentIndexFromEvent(event);
	if (
		startDocument.value !== null &&
		currentDocument !== null &&
		currentDocument !== startDocument.value
	) {
		const range = [startDocument.value, currentDocument].sort(
			(a, b) => a - b,
		);
		selectedDocuments.value = Array.from(
			{ length: range[1] - range[0] + 1 },
			(_, i) => i + range[0],
		);
	}
};

const handleMouseUp = () => {
	isSelecting.value = false;
	startDocument.value = null;
};

const handleMouseLeave = () => {
	isSelecting.value = false;
	startDocument.value = null;
};

const handleClickOutside = (event) => {
	if (
		docsList.value &&
		!docsList.value.contains(event.target) &&
		excludeRef.value &&
		!excludeRef.value.contains(event.target)
	) {
		clearSelected();
	}
};

const clearSelected = () => {
	isSelecting.value = false;
	startDocument.value = null;
	selectedDocuments.value = [];
};

const getDocumentIndexFromEvent = (event: MouseEvent): number | null => {
	const element = event.target as HTMLElement;
	const listItem = element.closest(".document-item");
	if (listItem) {
		const list = listItem.parentElement;
		if (list) {
			return Array.from(list.children).indexOf(listItem);
		}
	}
	return null;
};

const handleDeleteClick = async () => {
	if (confirmDelete.value) {
		await deleteSelectedDocuments();
		confirmDelete.value = false;
	} else {
		confirmDelete.value = true;
	}
};

const deleteSelectedDocuments = async () => {
	const ids = selectedDocuments.value.map(
		(index) => documents.value[index].metadata.id,
	);
	try {
		for (const id of ids) {
			if (id) {
				await deleteDocument(id);
			}
		}
		// 从后往前删除元素
		selectedDocuments.value
			.sort((a, b) => b - a)
			.forEach((index) => {
				documents.value.splice(index, 1);
			});
		selectedDocuments.value = [];
		addNotification({
			id: new Date().getTime(),
			message: `成功删除 ${ids.length} 个文档`,
		});
	} catch (error) {
		addNotification({
			id: new Date().getTime(),
			message: "删除文档失败",
		});
		console.error("Delete failed:", error);
	}
};

watch(searchResults, (newResults) => {
	documents.value = newResults;
});
</script>

<style scoped>
* {
	transition: all 0.2s !important;
}

.tags-input,
.categories-input {
	transition: border 0s !important;
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
		animation: slideIn 0.4s cubic-bezier(0.5, 0, 0, 1) forwards;
	}
}

@keyframes fadeToTransparent {
	from {
		background-color: #fffb00;
	}

	to {
		background-color: unset;
	}
}

.new {
	animation: fadeToTransparent 0.4s forwards;
}

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
