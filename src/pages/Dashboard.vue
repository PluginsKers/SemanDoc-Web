<template>
	<div class="py-10 pt-[64px]">
		<div
			class="flex flex-col items-start w-full md:flex-row gap-4 flex-nowrap">
			<div class="flex flex-col w-full lg:w-2/4 gap-4">
				<div class="rounded-lg shadow-sm bg-white w-full p-4">
					<h1 class="text-xl font-semibold">公告</h1>
					<p>该页面内容正在测试中，开发版本不代表最终质量。</p>
				</div>
				<div class="rounded-lg shadow-sm bg-white w-full p-4">
					<div class="mt-6">
						<div
							@click="downloadDocumentsList"
							class="select-none h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
							导出知识库
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { downloadDocumentsList } from "@/api/documents";
</script>

<style scoped>
b {
	margin: 0 4px;
}
</style>
