<template>
	<div class="py-10 pt-[64px]">
		<div
			class="flex flex-col items-start w-full md:flex-row gap-4 flex-nowrap">
			<div class="flex flex-col w-full lg:w-2/4 gap-4">
				<div class="rounded-lg shadow-sm bg-white w-full p-4">
					<h1 class="text-xl font-semibold">公告</h1>
					<p>
						该后台暂无鉴权，可以通过调用中间件实现对接OAuth和JWT鉴权。
					</p>
				</div>
				<div class="rounded-lg shadow-sm bg-white w-full">
					<div
						@click="downloadDocumentsList"
						class="select-none h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
						导出知识库
					</div>
				</div>
			</div>

			<!-- 统计信息概览 -->
			<div class="flex flex-col w-full lg:w-2/4 gap-4">
				<transition name="fade" mode="out-in">
					<!-- 骨架屏 -->
					<div
						v-if="statsLoading"
						class="rounded-lg shadow-sm bg-white w-full p-4">
						<div class="animate-pulse">
							<div
								class="h-8 w-32 bg-gray-200 rounded mb-4"></div>

							<!-- 文档总数骨架 -->
							<div class="mb-6 bg-gray-50 rounded-lg p-4">
								<div class="flex items-center">
									<div
										class="rounded-full bg-gray-200 p-6 mr-4"></div>
									<div>
										<div
											class="h-4 w-20 bg-gray-200 rounded mb-2"></div>
										<div
											class="h-8 w-16 bg-gray-200 rounded"></div>
									</div>
								</div>
							</div>

							<!-- 分类和标签统计骨架 -->
							<div
								class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
								<div class="bg-gray-50 rounded-lg p-4">
									<div class="flex items-center mb-2">
										<div
											class="rounded-full bg-gray-200 p-4 mr-2"></div>
										<div
											class="h-4 w-20 bg-gray-200 rounded"></div>
									</div>
									<div
										class="h-6 w-12 bg-gray-200 rounded ml-1"></div>
								</div>
								<div class="bg-gray-50 rounded-lg p-4">
									<div class="flex items-center mb-2">
										<div
											class="rounded-full bg-gray-200 p-4 mr-2"></div>
										<div
											class="h-4 w-20 bg-gray-200 rounded"></div>
									</div>
									<div
										class="h-6 w-12 bg-gray-200 rounded ml-1"></div>
								</div>
							</div>
						</div>
					</div>

					<!-- 实际内容 -->
					<div
						v-else-if="stats"
						class="rounded-lg shadow-sm bg-white w-full p-4">
						<h1 class="text-xl font-semibold mb-4">知识库概览</h1>

						<!-- 文档总数 -->
						<div
							class="mb-6 bg-gray-50 rounded-lg p-4 flex items-center">
							<div class="rounded-full bg-blue-100 p-3 mr-4">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6 text-blue-600"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div>
							<div>
								<h2 class="text-sm text-gray-500">文档总数</h2>
								<p class="text-2xl font-bold">
									{{ stats.total_documents }}
								</p>
							</div>
						</div>

						<!-- 分类和标签统计卡片 -->
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
							<div class="bg-gray-50 rounded-lg p-4">
								<div class="flex items-center mb-2">
									<div
										class="rounded-full bg-green-100 p-2 mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-green-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
										</svg>
									</div>
									<h2 class="text-sm text-gray-500">
										标签数量
									</h2>
								</div>
								<p class="text-xl font-bold ml-1">
									{{ stats.unique_tags.length }}
								</p>
							</div>

							<div class="bg-gray-50 rounded-lg p-4">
								<div class="flex items-center mb-2">
									<div
										class="rounded-full bg-purple-100 p-2 mr-2">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-purple-600"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
										</svg>
									</div>
									<h2 class="text-sm text-gray-500">
										分类数量
									</h2>
								</div>
								<p class="text-xl font-bold ml-1">
									{{ stats.unique_categories.length }}
								</p>
							</div>
						</div>

						<!-- 热门分类 -->
						<div v-if="topCategories.length > 0" class="mb-6">
							<h2 class="text-md font-semibold mb-2">热门分类</h2>
							<div class="flex flex-wrap gap-2">
								<div
									v-for="(count, category) in topCategories"
									:key="category"
									class="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm flex items-center">
									<span>{{ category }}</span>
									<span
										class="ml-2 bg-purple-200 rounded-full w-5 h-5 flex items-center justify-center text-xs"
										>{{ count }}</span
									>
								</div>
							</div>
						</div>

						<!-- 热门标签 -->
						<div v-if="topTags.length > 0">
							<h2 class="text-md font-semibold mb-2">热门标签</h2>
							<div class="flex flex-wrap gap-2">
								<div
									v-for="(count, tag) in topTags"
									:key="tag"
									class="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm flex items-center">
									<span>{{ tag }}</span>
									<span
										class="ml-2 bg-green-200 rounded-full w-5 h-5 flex items-center justify-center text-xs"
										>{{ count }}</span
									>
								</div>
							</div>
						</div>
					</div>
				</transition>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { downloadDocumentsList } from "@/api/documents";
import { useDocumentsStore, StatsOverview } from "@/store/documents";
import { ref, onMounted, computed } from "vue";

const documentsStore = useDocumentsStore();
const statsLoading = ref(true);
const stats = ref<StatsOverview | null>(null);

// 获取热门标签（最多5个）
const topTags = computed(() => {
	if (!stats.value) return [];

	const sortedTags = Object.entries(stats.value.documents_per_tag)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return Object.fromEntries(sortedTags);
});

// 获取热门分类（最多5个）
const topCategories = computed(() => {
	if (!stats.value) return [];

	const sortedCategories = Object.entries(stats.value.documents_per_category)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 5);

	return Object.fromEntries(sortedCategories);
});

onMounted(async () => {
	try {
		stats.value = await documentsStore.fetchStatsOverview();
	} catch (error) {
		console.error("Failed to load stats:", error);
	} finally {
		statsLoading.value = false;
	}
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}

.animate-pulse {
	animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.5;
	}
}
</style>
