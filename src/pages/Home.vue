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
				class="relative lg:sticky lg:top-[48px] bg-white rounded-md md:shadow-sm p-4 pb-2 mb-4 w-full"
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
								class="relative p-2 w-1/6 h-9 text-center align-middle outline-none border-[1px] border-l-0 border-gray-200 text-sm rounded-tr-md focus:bg-gray-50/50 hover:bg-gray-50/50" />
						</div>
						<div class="flex h-9">
							<input
								id="input-score-threshold"
								v-model="score_threshold"
								placeholder="分数阈值"
								@wheel="handleWheelSH($event, 0, 2, 0.02)"
								class="p-2 w-1/6 h-full text-center align-middle outline-none border-[1px] border-r-0 border-t-0 border-gray-200 text-sm rounded-bl-md focus:bg-gray-50/50 hover:bg-gray-50/50" />
							<input
								id="input-filter-string"
								v-model="filterString"
								placeholder="条件过滤"
								class="p-2 w-full h-full outline-none align-middle border-[1px] border-t-0 text-gray-400 border-gray-200 text-sm rounded-br-md focus:bg-gray-50/50 hover:bg-gray-50/50" />
						</div>
					</div>
					<h1 class="text-2xl ml-1">更多配置</h1>
					<div id="btn-presets" class="flex flex-wrap">
						<div
							class="shrink-0 flex-col mb-2 p-0 w-full rounded-md text-gray-900 ring-1 ring-gray-100 hover:ring-[3px] hover:ring-gray-50 text-xs leading-6">
							<input
								v-model="tags_input"
								@keydown.enter.prevent="addTag"
								@keydown.delete="checkForDelete"
								placeholder="添加标签"
								class="tags-input outline-none rounded-md h-9 px-2 w-full text-sm border-b-2"
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
									class="cursor-pointer select-none bg-gray-200 text-black text-xs px-2.5 py-1 rounded-sm hover:bg-gray-300">
									{{ tag }}
								</div>
							</div>
							<p
								v-if="duplicate"
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
						id="btn-strict"
						class="flex-1 flex items-center space-x-2">
						<div
							@click="isPowerSet = !isPowerSet"
							:class="{
								'bg-black': isPowerSet,
								'bg-gray-200': !isPowerSet,
							}"
							class="w-6 h-6 flex justify-center items-center rounded-sm cursor-pointer">
							<svg
								v-show="isPowerSet"
								class="w-4 h-4 text-white"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
								xmlns="http://www.w3.org/2000/svg">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"></path>
							</svg>
						</div>
						<label
							@click="isPowerSet = !isPowerSet"
							class="cursor-pointer select-none"
							>非严格检索模式</label
						>
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
								class="w-5 h-5 mb-[-1.5px]"
								viewBox="0 0 1024 1024"
								version="1.1"
								xmlns="http://www.w3.org/2000/svg"
								p-id="1921">
								<path
									d="M810.666667 256a42.666667 42.666667 0 0 0-42.666667 42.666667v170.666666a42.666667 42.666667 0 0 1-42.666667 42.666667H316.16l55.466667-55.04a42.666667 42.666667 0 0 0-60.586667-60.586667l-128 128a42.666667 42.666667 0 0 0-8.96 14.08 42.666667 42.666667 0 0 0 0 32.426667 42.666667 42.666667 0 0 0 8.96 14.08l128 128a42.666667 42.666667 0 0 0 60.586667 0 42.666667 42.666667 0 0 0 0-60.586667L316.16 597.333333H725.333333a128 128 0 0 0 128-128V298.666667a42.666667 42.666667 0 0 0-42.666666-42.666667z"
									p-id="1922"
									fill="#ffffff"></path>
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
					<span class="text-center text-gray-300"
						>注意：该系统为语义检索，调节阈值大小精确控制检索精度。</span
					>
				</div>
			</div>
			<ul
				ref="docsList"
				v-show="documents.length > 0"
				class="w-full docs-list bg-white lg:mr-4 min-w-xl p-4 rounded-md shadow-sm"
				@mousedown="handleMouseDown"
				@mousemove="handleMouseMove"
				@mouseup="handleMouseUp"
				@mouseleave="handleMouseLeave">
				<li
					v-for="(document, index) in documents"
					:key="index"
					@click="openEditModel(index)"
					:class="{
						'select-none bg-gray-100 rounded-none hover:bg-gray-200':
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
					class="document-item p-2 flex flex-col cursor-pointer justify-between items-start rounded-md">
					<span class="text-gray-700">{{
						document.page_content
					}}</span>
					<div class="flex items-center space-x-2">
						<span class="text-xs text-gray-500">标签:</span>
						<span
							v-for="tag in document.metadata.tags"
							:key="tag"
							class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
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
import { useStore } from "vuex";
import { Document } from "@/types";
import AddModel from "@/components/AddModel.vue";
import EditModel from "@/components/EditModel.vue";
import { removeDocuments } from "@/api/documents";

import introJs from "intro.js";
import "intro.js/introjs.css";

const intro = introJs();
const INTRO_VERSION = "1.0.0";
const INTRO_COMPLETED_KEY = "intro_completed_version";

const store = useStore();
const searchResults = computed(() => store.getters.getSearchResults);

onMounted(() => {
	const storedIntroVersion = localStorage.getItem(INTRO_COMPLETED_KEY);
	if (storedIntroVersion !== INTRO_VERSION) {
		intro.setOptions({
			nextLabel: "下一步",
			prevLabel: "上一步",
			doneLabel: "完成",
			hidePrev: false,
			hideNext: false,
			exitOnEsc: true,
			exitOnOverlayClick: true,
			showStepNumbers: false,
			disableInteraction: true,
			showBullets: true,
			overlayOpacity: 0.8,
			steps: [
				{
					element: "#ctlpanel",
					intro: "这是用于管理数据的控制面板。 您可以在这里搜索、过滤和管理文档。",
					position: "right",
				},
				{
					element: "#input-search",
					intro: "检索使用的关键词，留空可以进行泛检索。",
					position: "right",
				},
				{
					element: "#input-max-documents",
					intro: "最大检索数，如果检索结果过少，可以调高该参数。",
					position: "right",
				},
				{
					element: "#input-score-threshold",
					intro: "语义相关的阈值，越低相关性越高。",
					position: "right",
				},
				{
					element: "#input-filter-string",
					intro: "检索条件参数可视化，无需更改。",
					position: "right",
				},
				{
					element: "#btn-presets",
					intro: "检索使用的标签，点击预设可以快速切换标签。",
					position: "right",
				},
				{
					element: "#btn-strict",
					intro: "严格模式下只能检索到与标签完全匹配的文档，非严格模式下会匹配包含关系的所有标签的文档。",
					position: "right",
				},
				{
					element: "#btn-query",
					intro: "点击根据进行知识库检索，按下回车键可以快捷检索。",
					position: "right",
				},
			],
		});
		intro.start();
		intro.oncomplete(() => {
			localStorage.setItem(INTRO_COMPLETED_KEY, INTRO_VERSION);
		});
	}
	document.addEventListener("click", handleClickOutside);

	const presetsKey = "presets";
	const storedPresets = localStorage.getItem(presetsKey);
	if (!storedPresets) {
		const defaultPresets = JSON.stringify({
			通用: { tags: ["通用"] },
			人工智能学院: { tags: ["人工智能学院"] },
		});
		localStorage.setItem(presetsKey, defaultPresets);
		presets.value = defaultPresets;
	} else {
		presets.value = storedPresets;
	}
});

onBeforeUnmount(() => {
	document.removeEventListener("click", handleClickOutside);
});

const presets = ref("{}");

const documents = ref<any>(searchResults);
const index = ref(-1);
const query = ref("");
const k = ref(20);
const docsList = ref<any>(null);
const excludeRef = ref<any>(null);
const filter = ref<any>({ tags: [] });
const filterString = ref(JSON.stringify(filter.value));
const score_threshold = ref<string>("2.0");
const showAddModal = ref(false);
const showEditModal = ref(false);
const queryingStatus = ref(0);
const tags = ref<string[]>(filter.value.tags);
const tags_input = ref("");
const duplicate = ref(false); // 用于跟踪重复标签的状态
const confirmDelete = ref(false); // 用于确认删除状态

let timer: any = null;

const isPowerSet = ref<boolean>(true);
const selectedDocuments = ref<number[]>([]);
let isSelecting = ref(false);
let startDocument = ref<number | null>(null);

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
		duplicate.value = false;
	} else {
		duplicate.value = true; // 标记为重复，不添加标签
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
};

const handleDocumentAdded = async (newDocument: Document) => {
	documents.value.unshift(newDocument);
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
};

const searchDocuments = async () => {
	if (queryingStatus.value == -1) return;
	queryingStatus.value = -1;
	clearTimeout(timer);
	try {
		await store.dispatch("searchDocuments", {
			query: query.value,
			k: k.value,
			filter: filter.value,
			score_threshold: score_threshold.value,
			isPowerSet: isPowerSet.value,
		});
		queryingStatus.value = 1;
		timer = setTimeout(() => {
			queryingStatus.value = 0;
		}, 3000);
	} catch (error) {
		queryingStatus.value = -2;
		console.error("搜索错误:", error);
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
	filter,
	(newFilter) => {
		filterString.value = JSON.stringify(newFilter);
		tags.value = newFilter.tags;
		duplicate.value = false;
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
		(index) => documents.value[index].metadata["ids"],
	);
	try {
		await removeDocuments(ids);
		// 从后往前删除元素
		selectedDocuments.value
			.sort((a, b) => b - a)
			.forEach((index) => {
				documents.value.splice(index, 1);
			});
		selectedDocuments.value = [];
	} catch (error) {
		console.error("删除错误:", error);
	}
};
</script>

<style scoped>
* {
	transition: all 0.2s !important;
}

.tags-input {
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
</style>
