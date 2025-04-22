<template>
	<div
		class="py-10 pt-[64px] bg-gray-50 min-h-screen"
		@click="handleClickOutside">
		<div class="container mx-auto px-0 md:px-4">
			<div class="bg-white rounded-md shadow p-5 mb-6">
				<h1 class="text-3xl font-bold mb-6">预设管理</h1>
				<div
					class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<div
						v-for="(preset, key) in presetData"
						:key="key"
						class="bg-white cursor-pointer border rounded-lg shadow-sm p-4 transition-transform transform h-fit hover:bg-gray-50"
						@mouseover="hoverPreset = key"
						@mouseleave="hoverPreset = null"
						@click="togglePreset(key)"
						:class="{
							' bg-gray-50': expandedPresets.includes(key),
						}">
						<h2 class="text-xl font-semibol">{{ key }}</h2>
						<div v-if="expandedPresets.includes(key)">
							<div class="my-4">
								<h3
									class="text-sm font-medium text-gray-500 mb-2">
									标签:
								</h3>
								<ul class="flex flex-row flex-wrap gap-1">
									<li
										v-for="tag in preset.tags"
										:key="tag"
										class="bg-gray-200 rounded-sm text-xs px-2.5 py-1 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
										@click.stop="
											removeTagFromPreset(
												key,
												tag,
												'tags',
											)
										">
										{{ tag }}
									</li>
								</ul>
							</div>
							<div class="my-4">
								<h3
									class="text-sm font-medium text-gray-500 mb-2">
									分类:
								</h3>
								<ul class="flex flex-row flex-wrap gap-1">
									<li
										v-for="category in preset.categories"
										:key="category"
										class="bg-gray-300 rounded-sm text-xs px-2.5 py-1 mr-1 mb-1 outline-none active:ring-[3px] active:ring-gray-50"
										@click.stop="
											removeTagFromPreset(
												key,
												category,
												'categories',
											)
										">
										{{ category }}
									</li>
								</ul>
							</div>
							<button
								@click.stop="removePreset(key)"
								class="flex justify-center items-center select-none h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
								删除预设
							</button>
						</div>
					</div>
					<div
						@click.stop="toggleAddPresetPanel"
						class="border-2 border-dashed border-gray-300 flex justify-center items-center rounded-lg cursor-pointer min-h-[64px] h-fit hover:bg-gray-50"
						:class="{
							'bg-gray-50 hover:bg-gray-50': showAddPresetPanel,
						}">
						<div
							v-if="!showAddPresetPanel"
							class="text-gray-400 text-3xl">
							+
						</div>
						<div
							v-if="showAddPresetPanel"
							class="w-full p-4"
							@click.stop>
							<h2
								class="text-xl font-semibold border-b pb-2 mb-4">
								添加新预设
							</h2>
							<div class="flex flex-col mb-3 text-gray-900">
								<div class="flex h-9 relative">
									<input
										v-model="newPresetName"
										placeholder="预设名称"
										class="block p-2 pl-10 w-full h-full align-middle outline-none rounded-md ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6" />
									<div
										class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
										<svg
											class="h-5 w-5 text-gray-400"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
										</svg>
									</div>
								</div>
							</div>

							<div class="mb-4">
								<h3
									class="text-sm font-medium text-gray-500 mb-2">
									标签:
								</h3>
								<div
									class="flex flex-row items-center mb-2 relative">
									<div
										class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
										<svg
											class="h-5 w-5 text-gray-400"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z"
												clip-rule="evenodd" />
										</svg>
									</div>
									<input
										v-model="newPresetTagInput"
										@keyup.enter="addTag"
										placeholder="按回车添加标签"
										class="flex-1 p-2 pl-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6" />
								</div>
								<ul class="flex flex-row flex-wrap gap-1 mb-4">
									<li
										v-for="(tag, index) in newPresetTags"
										:key="index"
										class="cursor-pointer select-none bg-gray-200 text-black text-xs px-2.5 py-1 rounded-sm hover:bg-gray-300"
										@click.stop="removeTag(index)">
										{{ tag }}
									</li>
								</ul>
							</div>

							<div class="mb-4">
								<h3
									class="text-sm font-medium text-gray-500 mb-2">
									分类:
								</h3>
								<div
									class="flex flex-row items-center mb-2 relative">
									<div
										class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
										<svg
											class="h-5 w-5 text-gray-400"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
										</svg>
									</div>
									<input
										v-model="newPresetCategoryInput"
										@keyup.enter="addCategory"
										placeholder="按回车添加分类"
										class="flex-1 p-2 pl-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-100 text-sm leading-6" />
								</div>
								<ul class="flex flex-row flex-wrap gap-1 mb-4">
									<li
										v-for="(
											category, index
										) in newPresetCategories"
										:key="index"
										class="cursor-pointer select-none bg-gray-300 text-black text-xs px-2.5 py-1 rounded-sm hover:bg-gray-400"
										@click.stop="removeCategory(index)">
										{{ category }}
									</li>
								</ul>
							</div>

							<button
								@click="confirmAddPreset"
								class="flex justify-center items-center select-none w-full h-9 py-1.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
								确定
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useNotificationManager } from "@/notificationManager";

interface Preset {
	tags: string[];
	categories: string[];
}

const presetsKey = "presets";

const initialPresets = JSON.stringify({
	通用: { tags: ["通用"], categories: ["通用"] },
	人工智能学院: { tags: ["人工智能学院"], categories: ["学院"] },
});

const presetData = ref<Record<string, Preset>>({});
const newPresetName = ref("");
const newPresetTagInput = ref("");
const newPresetTags = ref<string[]>([]);
const newPresetCategoryInput = ref("");
const newPresetCategories = ref<string[]>([]);
const expandedPresets = ref<string[]>([]);
const hoverPreset = ref<string | null>(null);
const showAddPresetPanel = ref(false);

const { addNotification } = useNotificationManager();

onMounted(() => {
	let storedPresets = localStorage.getItem(presetsKey);
	if (!storedPresets) {
		localStorage.setItem(presetsKey, initialPresets);
		storedPresets = initialPresets;
	}

	if (storedPresets) {
		presetData.value = JSON.parse(storedPresets);
	}
});

const savePresets = () => {
	localStorage.setItem(presetsKey, JSON.stringify(presetData.value));
};

const removePreset = (key: string) => {
	delete presetData.value[key];
	savePresets();
	addNotification({
		id: new Date().getTime(),
		message: `预设 ${key} 已删除`,
	});
	const index = expandedPresets.value.indexOf(key);
	if (index > -1) {
		expandedPresets.value.splice(index, 1);
	}
};

const addTag = () => {
	const newTag = newPresetTagInput.value.trim();
	if (newTag !== "" && !newPresetTags.value.includes(newTag)) {
		newPresetTags.value.push(newTag);
		newPresetTagInput.value = "";
	}
};

const removeTag = (index: number) => {
	newPresetTags.value.splice(index, 1);
};

const addCategory = () => {
	const newCategory = newPresetCategoryInput.value.trim();
	if (
		newCategory !== "" &&
		!newPresetCategories.value.includes(newCategory)
	) {
		newPresetCategories.value.push(newCategory);
		newPresetCategoryInput.value = "";
	}
};

const removeCategory = (index: number) => {
	newPresetCategories.value.splice(index, 1);
};

const removeTagFromPreset = (
	key: string,
	value: string,
	type: "tags" | "categories",
) => {
	const items = presetData.value[key][type];
	const index = items.indexOf(value);
	if (index > -1) {
		items.splice(index, 1);
		if (
			items.length === 0 &&
			presetData.value[key].tags.length === 0 &&
			presetData.value[key].categories.length === 0
		) {
			removePreset(key);
		} else {
			savePresets();
			addNotification({
				id: new Date().getTime(),
				message: `从预设 ${key} 中删除${type === "tags" ? "标签" : "分类"} ${value}`,
			});
		}
	}
};

const confirmAddPreset = () => {
	if (
		newPresetName.value.trim() !== "" &&
		(newPresetTags.value.length > 0 || newPresetCategories.value.length > 0)
	) {
		presetData.value[newPresetName.value.trim()] = {
			tags: newPresetTags.value,
			categories: newPresetCategories.value,
		};
		savePresets();
		addNotification({
			id: new Date().getTime(),
			message: `预设 ${newPresetName.value.trim()} 添加成功`,
		});
		showAddPresetPanel.value = false;
		newPresetName.value = "";
		newPresetTagInput.value = "";
		newPresetTags.value = [];
		newPresetCategoryInput.value = "";
		newPresetCategories.value = [];
	}
};

const toggleAddPresetPanel = () => {
	showAddPresetPanel.value = !showAddPresetPanel.value;
	if (!showAddPresetPanel.value) {
		newPresetName.value = "";
		newPresetTagInput.value = "";
		newPresetTags.value = [];
		newPresetCategoryInput.value = "";
		newPresetCategories.value = [];
	}
};

const handleClickOutside = (_event: MouseEvent) => {
	if (showAddPresetPanel.value && !isAddPresetPanelContentPresent()) {
		showAddPresetPanel.value = false;
		newPresetName.value = "";
		newPresetTagInput.value = "";
		newPresetTags.value = [];
		newPresetCategoryInput.value = "";
		newPresetCategories.value = [];
	}
};

const isAddPresetPanelContentPresent = () => {
	return (
		newPresetName.value.trim() !== "" ||
		newPresetTags.value.length > 0 ||
		newPresetTagInput.value.trim() !== "" ||
		newPresetCategories.value.length > 0 ||
		newPresetCategoryInput.value.trim() !== ""
	);
};

const togglePreset = (key: string) => {
	const index = expandedPresets.value.indexOf(key);
	if (index > -1) {
		expandedPresets.value.splice(index, 1);
	} else {
		expandedPresets.value.push(key);
	}
};
</script>

<style scoped></style>
