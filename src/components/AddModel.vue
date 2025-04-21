<template>
	<div
		class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start md:py-4 z-40"
		@dragover.prevent="handleDragOver"
		@mouseout="handleMouseLeave"
		@drop.prevent="handleDrop">
		<div
			@click="closeAddModel"
			class="absolute justify-center items-center align-middle font-bold top-2 right-2 ring-1 ring-gray-300 bg-gray-100 p-[2px] text-[9px] rounded-sm shadow-sm cursor-pointer text-gray-700 hidden md:block">
			ESC
		</div>
		<!-- 模态窗口内容，小屏幕设备全屏，大屏幕占据屏幕的绝大部分 -->
		<div
			class="relative bg-white w-screen h-full rounded-none md:rounded-md shadow-lg sm:w-full md:max-w-2xl lg:max-w-3xl xl:max-w-5xl overflow-auto">
			<!-- 添加遮罩层，当文件被拖拽到组件上时显示 -->
			<div
				v-if="showOverlay"
				class="absolute flex flex-col justify-center items-center inset-0 border-4 border-dashed border-gray-200 bg-gray-800/50 z-10">
				<p class="text-xl font-semibold text-white">上传文件</p>
			</div>
			<!-- 模态窗口的子元素，如输入框、按钮等 -->
			<div class="flex flex-col justify-center h-full gap-2 p-6">
				<textarea
					v-model="newData"
					placeholder="文档信息"
					class="flex-1 mt-1 p-2 w-full min-h-40 h-40 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6">
				</textarea>
				<input
					v-model="newMetadataString"
					placeholder="源信息"
					class="shrink-0 mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-400 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" />

				<div
					class="relative flex flex-wrap"
					:class="{
						'control-disabled before:bg-gray-100/40 before:rounded-md before:cursor-not-allowed':
							newMetadataManagerDisabled,
					}">
					<!-- 标签和分类组 -->
					<div class="w-full space-y-2">
						<!-- 标签输入 -->
						<div
							class="shrink-0 flex-col mb-2 p-0 w-full rounded-md text-gray-900 ring-1 ring-gray-100 hover:ring-[3px] hover:ring-gray-50 text-xs leading-6">
							<input
								v-model="tags_input"
								@keydown.enter.prevent="addTag"
								@keydown.delete="checkForDelete"
								placeholder="添加标签"
								class="tags-input outline-none rounded-md h-9 text-sm px-2 w-full border-b-2"
								:class="{
									'border-dashed border-gray-200 rounded-b-none':
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

						<!-- 分类输入 -->
						<div
							class="shrink-0 flex-col mb-2 p-0 w-full rounded-md text-gray-900 ring-1 ring-gray-100 hover:ring-[3px] hover:ring-gray-50 text-xs leading-6">
							<input
								v-model="categories_input"
								@keydown.enter.prevent="addCategory"
								@keydown.delete="checkForDeleteCategory"
								placeholder="添加分类"
								class="categories-input outline-none rounded-md h-9 text-sm px-2 w-full border-b-2"
								:class="{
									'border-dashed border-gray-200 rounded-b-none':
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
									class="cursor-pointer select-none bg-gray-200 text-black text-xs px-2.5 py-1 rounded-sm hover:bg-gray-300">
									{{ category }}
								</div>
							</div>
							<p
								v-if="duplicateCategory"
								class="m-1 text-red-500 text-xs italic">
								分类已存在，不能重复添加。
							</p>
						</div>
					</div>

					<!-- 预设选择 -->
					<div
						class="cursor-pointer select-none bg-gray-200 rounded-sm px-2.5 text-xs py-1 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
						v-for="(metadata, name) in JSON.parse(presets)"
						:key="name"
						@click="newMetadata = metadata">
						{{ name }}
					</div>
				</div>
				<div class="flex-none flex justify-between items-center">
					<div
						@click="addDocument"
						class="flex justify-center items-center select-none h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100"
						:class="{
							'bg-gray-800 cursor-not-allowed':
								addingStatus == -1,
							'bg-green-700 cursor-pointer': addingStatus == 1,
							'bg-red-800 cursor-pointer': addingStatus == -2,
							'bg-black hover:bg-gray-900 cursor-pointer':
								addingStatus == 0,
						}">
						<template v-if="addingStatus == 1">
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
						<template v-else-if="addingStatus == -1">
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
						<template v-else-if="addingStatus == -2">
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
						<template v-else> 添加文档 </template>
					</div>
					<div
						@click="closeAddModel"
						class="flex justify-center items-center cursor-pointer select-none py-1.5 px-4 bg-gray-200 h-9 rounded-md text-sm font-medium text-gray-800 outline-none hover:ring-[3px] hover:ring-gray-100">
						取消
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import moment from "moment-timezone";
import { ref, onMounted, onUnmounted, watch } from "vue";
import { addDocument as _addDocument, uploadDocuments } from "@/api/documents";
import { useNotificationManager } from "@/notificationManager";
const { addNotification } = useNotificationManager();

const { presets } = defineProps({
	presets: {
		type: String,
		default: "{}",
	},
});

const newData = ref("");
const newMetadata = ref<Record<string, any>>({ tags: [], categories: [] });
const newMetadataString = ref(JSON.stringify(newMetadata.value));
const newMetadataManagerDisabled = ref(false);
const cleanedData = ref("");
const addingStatus = ref(0);
const tags = ref<string[]>(newMetadata.value.tags);
const tags_input = ref("");
const categories = ref<string[]>(newMetadata.value.categories);
const categories_input = ref("");
const showOverlay = ref(false);
const duplicate = ref(false);
const duplicateCategory = ref(false);
const emit = defineEmits(["documentAdded", "closeAddModel"]);
let timer: any = null;

watch(
	newData,
	(newValue) => {
		const regex =
			/<(\d{4}[-\/年]\d{1,2}[-\/月]\d{1,2}日? \d{1,2}:\d{2});(.*?)(?:;(\d{4}[-\/年]\d{1,2}[-\/月]\d{1,2}日? \d{1,2}:\d{2}))?;>/g;
		let matches;
		let lastMatch;

		while ((matches = regex.exec(newValue)) !== null) {
			lastMatch = matches; // 保留最后一个匹配项
		}

		if (lastMatch) {
			newMetadataManagerDisabled.value = true;
			const endTime = lastMatch[1]
				.replace(/年|月/g, "-")
				.replace(/日/, "")
				.trim();
			const tags = lastMatch[2].split(",").map((tag) => tag.trim());
			const startTime = lastMatch[3]
				? lastMatch[3].replace(/年|月/g, "-").replace(/日/, "").trim()
				: null;

			// 尝试解析时间，如果失败则清除时间信息
			const endTimeMoment = moment.tz(
				endTime,
				"YYYY-MM-DD HH:mm",
				"Asia/Shanghai",
			);
			const startTimeMoment = startTime
				? moment.tz(startTime, "YYYY-MM-DD HH:mm", "Asia/Shanghai")
				: null;

			if (!endTimeMoment.isValid()) {
				delete newMetadata.value.valid_time;
			} else {
				newMetadata.value.valid_time = endTimeMoment.unix();
				if (startTimeMoment && startTimeMoment.isValid()) {
					newMetadata.value.start_time = startTimeMoment.unix();
					// 计算valid_time为结束时间减去开始时间的差值
					newMetadata.value.valid_time -=
						newMetadata.value.start_time;
				} else {
					delete newMetadata.value.start_time;
					newMetadata.value.valid_time -= moment
						.tz("Asia/Shanghai")
						.unix();
				}
			}

			newMetadata.value.tags = tags;

			// 更新JSON字符串表示
			newMetadataString.value = JSON.stringify(newMetadata.value);

			cleanedData.value = newValue.replace(regex, "").trim();
		} else {
			newMetadataManagerDisabled.value = false;
			cleanedData.value = newValue;
		}
	},
	{ deep: true },
);

watch(
	tags,
	(newTag) => {
		newMetadata.value.tags = newTag;
	},
	{ deep: true },
);

watch(
	categories,
	(newCategories) => {
		newMetadata.value.categories = newCategories;
	},
	{ deep: true },
);

watch(
	newMetadata,
	(newValue) => {
		newMetadataString.value = JSON.stringify(newValue);
		tags.value = newValue.tags;
		categories.value = newValue.categories;
		duplicate.value = false;
		duplicateCategory.value = false;
	},
	{ deep: true },
);

const handleDragOver = () => {
	showOverlay.value = true;
};

const handleMouseLeave = () => {
	showOverlay.value = false;
};

const handleDrop = async (event: any) => {
	showOverlay.value = false;
	const files = event.dataTransfer.files;
	if (files.length > 0) {
		try {
			addNotification({
				id: new Date().getTime(),
				message: "正在上传文件...",
			});
			const result = await uploadDocuments(files[0]);
			for (let i = 0; i < result.data.length; i++) {
				addNotification({
					id: new Date().getTime(),
					message: `上传成功：${result.statistics.success_count}，失败：${result.statistics.failure_count}`,
				});
				emit("documentAdded", result.data[i]);
			}
			emit("closeAddModel");
			console.log("上传成功:", result.data);
		} catch (error) {
			console.error("上传失败:", error);
		}
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

// 分类管理逻辑
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

const handleEsc = (event: { key: string }) => {
	if (event.key === "Escape") {
		closeAddModel();
	}
};

onMounted(() => {
	window.addEventListener("keydown", handleEsc);
});

onUnmounted(() => {
	window.removeEventListener("keydown", handleEsc);
});

const closeAddModel = () => {
	if (addingStatus.value != -1) {
		emit("closeAddModel");
	}
	showOverlay.value = false;
};

const addDocument = async () => {
	if (addingStatus.value == -1) return;
	addingStatus.value = -1;
	clearTimeout(timer);
	try {
		const content = cleanedData.value || newData.value;
		const newDoc = await _addDocument(content, newMetadata.value);
		addingStatus.value = 1;
		emit("documentAdded", newDoc);
		emit("closeAddModel");
		timer = setTimeout(() => {
			addingStatus.value = 0;
		}, 3000);
	} catch (error) {
		addingStatus.value = -2;
		addNotification({
			id: new Date().getTime(),
			message: "文档添加失败",
		});
		console.error("添加错误:", error);
	}
};
</script>

<style scoped>
.control-disabled:before {
	content: "";
	position: absolute;
	width: 100%;
	height: 100%;
	background-image: repeating-linear-gradient(
		45deg,
		transparent,
		transparent 10px,
		rgba(0, 0, 0, 0.1) 10px,
		rgba(0, 0, 0, 0.1) 20px
	);
}
</style>
