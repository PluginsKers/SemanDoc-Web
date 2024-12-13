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
					<h1 class="text-lg">{{ nickname }}</h1>
					<p>你的权限编号：{{ role_id }}</p>
					<div class="mt-6">
						<div
							@click="downloadDocumentsList"
							class="select-none h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
							导出知识库
						</div>
					</div>
				</div>
			</div>
			<div
				class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
				<h1 class="text-xl font-semibold">个人信息</h1>
				<div class="mt-2">
					<label>用户名</label>
					<input
						v-model="personalInfo.username"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="用户名" />
				</div>
				<div class="mt-4">
					<label>新密码</label>
					<input
						v-model="personalInfo.newPassword"
						type="password"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="新密码" />
				</div>
				<div class="mt-4">
					<label>确认密码</label>
					<input
						v-model="personalInfo.confirmPassword"
						type="password"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="确认密码" />
				</div>
				<div class="mt-6">
					<div
						@click="updatePassword"
						class="select-none h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
						保存信息
					</div>
				</div>
			</div>
			<div
				class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
				<h1 class="text-xl font-semibold">创建用户</h1>
				<div class="mt-2">
					<label>用户名</label>
					<input
						v-model="newUser.username"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="用户名" />
				</div>
				<div class="mt-4">
					<label>新用户密码</label>
					<input
						v-model="newUser.password"
						type="password"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="新用户密码" />
				</div>
				<div class="mt-4">
					<label>确认密码</label>
					<input
						v-model="newUser.confirmPassword"
						type="password"
						class="mt-1 p-2 w-full h-9 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
						placeholder="确认密码" />
				</div>
				<div class="mt-6">
					<div
						@click="createUser"
						class="select-none h-9 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
						创建用户
					</div>
				</div>
			</div>
		</div>

		<div
			class="flex flex-col w-full rounded-lg shadow-sm bg-white p-4 mt-4">
			<h1
				class="text-xl font-semibold cursor-pointer select-none"
				@click="getRecords">
				操作记录
			</h1>
			<div class="mt-2">
				<ul
					class="flex flex-col max-h-[500px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
					<li
						v-if="records.length > 0"
						v-for="(j, index) in records"
						:key="index"
						class="text-sm leading-6 break-all p-2 flex flex-col items-start justify-center border-white border-2 hover:border-dashed rounded hover:bg-gray-50 hover:border-gray-200 cursor-pointer select-all">
						<div>
							<span class="">{{ j.document.page_content }}</span>
						</div>
						<div
							class="flex flex-row w-full justify-between font-light text-zinc-400 gap-2">
							<div class="flex flex-row gap-2">
								<span class="whitespace-nowrap">{{
									j.edit_time
								}}</span>
								<span class="whitespace-nowrap">{{
									j.edit_description
								}}</span>
							</div>
							<div class="">
								<span class="whitespace-nowrap">{{
									j.editor.username
								}}</span>
							</div>
						</div>
					</li>
					<li v-else class="text-sm leading-6 break-all">
						加载中......
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useStore } from "vuex";
import { updateUserPassword, createUser as createUser_I } from "@/api/index";
import { useNotificationManager } from "@/notificationManager";
import { downloadDocumentsList } from "@/api/documents";

const { addNotification } = useNotificationManager();
const store = useStore();

const username = computed(() => store.state.user.username);
const role_id = computed(() => store.state.user.role_id);
const nickname = computed(() => store.state.user.nickname);

const personalInfo = ref({
	username: username,
	newPassword: "",
	confirmPassword: "",
});

const newUser = ref({
	username: "",
	password: "",
	confirmPassword: "",
});

const updatePassword = async () => {
	if (personalInfo.value.newPassword !== personalInfo.value.confirmPassword) {
		addNotification({
			id: new Date().getTime(),
			message: "两次输入的密码不一致",
		});
		return;
	}
	try {
		await updateUserPassword(1, personalInfo.value.newPassword);
	} catch (error) {
		console.error("Error updating password:", error);
	}
};

const createUser = async () => {
	if (newUser.value.password !== newUser.value.confirmPassword) {
		addNotification({
			id: new Date().getTime(),
			message: "两次输入的密码不一致",
		});
		return;
	}
	try {
		await createUser_I(
			newUser.value.username,
			newUser.value.password,
			2,
			newUser.value.username,
		);
	} catch (error) {
		console.error("Error creating user:", error);
	}
};

const records = computed(() => store.getters.getRecords);

const getRecords = async () => {
	await store.dispatch("fetchRecords");
};

onMounted(() => {
	if (records.value.length === 0) {
		getRecords();
	}
});
</script>

<style scoped>
b {
	margin: 0 4px;
}
</style>
