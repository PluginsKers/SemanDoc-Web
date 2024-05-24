<template>
    <div class="py-10 pt-[64px]">
        <div class="flex flex-col items-start md:flex-row gap-4 flex-wrap">
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">公告</h1>
                <p>该页面内容正在测试中，如有问题请联系<b>张哲屹</b>，邮箱：<a href="mailto:ikers@foxmail.com">ikers@foxmail.com</a></p>
                <p>当前数据库正在<b>测试中</b>，你可以打开添加文档尝试将 <b>xlsx</b> 表格拖入进行批量上传。</p>
                <p><b>USER权限</b>的用户无法创建新用户，仅仅操作数据库。</p>
                <p><b>2024/5/24</b> 多选内容可以进行批量删除。</p>
            </div>
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">个人信息</h1>
                <div class="mt-2">
                    <label>用户名</label>
                    <input v-model="personalInfo.username"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="用户名" />
                </div>
                <div class="mt-4">
                    <label>新密码</label>
                    <input v-model="personalInfo.newPassword" type="password"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="新密码" />
                </div>
                <div class="mt-4">
                    <label>确认密码</label>
                    <input v-model="personalInfo.confirmPassword" type="password"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="确认密码" />
                </div>
                <div class="mt-6">
                    <div @click="updatePassword"
                        class="select-none h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
                        保存信息</div>
                </div>
            </div>
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">创建用户</h1>
                <div class="mt-2">
                    <label>用户名</label>
                    <input v-model="newUser.username"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="用户名" />
                </div>
                <div class="mt-4">
                    <label>新用户密码</label>
                    <input v-model="newUser.password" type="password"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="新用户密码" />
                </div>
                <div class="mt-4">
                    <label>确认密码</label>
                    <input v-model="newUser.confirmPassword" type="password"
                        class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"
                        placeholder="确认密码" />
                </div>
                <div class="mt-6">
                    <div @click="createUser"
                        class="select-none h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">
                        创建用户</div>
                </div>
            </div>
            <div class="flex flex-col w-full rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">添加记录</h1>
                <div class="mt-2">
                    <ul class="flex flex-col gap-4 max-h-[500px] overflow-y-auto">
                        <li class="text-sm leading-6 break-all">测试添加信息记录</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useStore } from 'vuex';
import { updateUserPassword, createUser as createUserApi } from '@/api/index';
import { useNotificationManager } from '@/notificationManager';
const { addNotification } = useNotificationManager();
const store = useStore();

const username = computed(() => store.state.user.username);

const personalInfo = ref({
    username: username,
    newPassword: '',
    confirmPassword: ''
});

const newUser = ref({
    username: '',
    password: '',
    confirmPassword: ''
});

const updatePassword = async () => {
    if (personalInfo.value.newPassword !== personalInfo.value.confirmPassword) {
        addNotification({
            id: new Date().getTime(),
            message: "两次输入的密码不一致"
        });
        return;
    }
    try {
        await updateUserPassword(1, personalInfo.value.newPassword);
    } catch (error) {
        console.error('Error updating password:', error);
    }
};

const createUser = async () => {
    if (newUser.value.password !== newUser.value.confirmPassword) {
        return;
    }
    try {
        await createUserApi(newUser.value.username, newUser.value.password, 2, newUser.value.username);
    } catch (error) {
        console.error('Error creating user:', error);
    }
};
</script>

<style scoped>
b {
    margin: 0 4px;
}
</style>