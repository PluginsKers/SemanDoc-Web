<template>
    <div class="py-10 pt-[64px]">
        <div class="flex flex-col items-start md:flex-row gap-4 flex-wrap">
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">公告</h1>
                正在开发中，该页面功能均不可用。
            </div>
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">个人信息</h1>
                <div class="mt-2">
                    <label>用户名</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" placeholder="admin"/>
                </div>
                <div class="mt-4">
                    <label>新密码</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" />
                </div>
                <div class="mt-4">
                    <label>确认密码</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" />
                </div>
                <div class="mt-6">
                    <div class="select-none h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">保存信息</div>
                </div>
            </div>
            <div class="flex flex-col w-full lg:w-1/4 rounded-lg shadow-sm bg-white p-4">
                <h1 class="text-xl font-semibold">创建用户</h1>
                <div class="mt-2">
                    <label>用户名</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6"/>
                </div>
                <div class="mt-4">
                    <label>新用户密码</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" />
                </div>
                <div class="mt-4">
                    <label>确认密码</label>
                    <input class="mt-1 p-2 w-full h-10 outline-none rounded-md text-gray-900 ring-1 ring-gray-100 focus:ring-[3px] focus:ring-gray-50 text-sm leading-6" />
                </div>
                <div class="mt-6">
                    <div class="select-none h-10 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-100 bg-black hover:bg-gray-900 cursor-pointer">创建用户</div>
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
</script>
