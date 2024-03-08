<template>
    <div class="py-10 pt-[48px]" :class="{ 'w-full': documents.length > 0 }">
        <div class="flex flex-col items-center lg:justify-center mx-auto lg:flex-row-reverse lg:items-start placeholder:text-gray-400 z-0"
            :class="{ 'md:max-w-2xl md:min-w-1xl lg:max-w-3xl lg:min-w-2xl': documents.length <= 0, 'lg:w-4/5': documents.length > 0 }">
            <div class="relative bg-white border-[1px] rounded-md md:shadow-sm p-4 pb-2 mb-4 w-full"
                :class="{ 'lg:w-1/3': documents.length > 0}">
                <h1 class="text-3xl font-bold text-center mb-4">文档管理</h1>
                <div class="flex flex-col justify-center gap-4">
                    <div class="flex flex-col mb-3 text-gray-900">
                        <div class="flex h-10">
                            <div
                                class="flex w-full flex-row relative h-10 border-[1px] border-gray-200 sm:text-sm rounded-tl-md">
                                <div
                                    class="absolute h-full w-10 pointer-events-none flex justify-center items-center">
                                    <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clip-rule="evenodd" />
                                    </svg>
                                </div>
                                <input v-model="query" placeholder="检索内容"
                                    class="block p-2 pl-10 w-full h-full align-middle outline-none rounded-tl-md focus:bg-gray-50/50" />
                            </div>
                            <input v-model.number="k" type="number" min="1" placeholder="数量"
                                class="relative p-2 w-1/4 h-10 align-middle outline-none border-[1px] border-l-0 border-gray-200 sm:text-sm rounded-tr-md focus:bg-gray-50/50" />
                        </div>
                        <div class="flex h-10">
                            <input v-model.number="score_threshold" type="number" min="0" max="2" placeholder="分数阈值"
                                class="p-2 w-1/6 h-full text-center align-middle outline-none border-[1px] border-r-0 border-t-0 border-gray-200 sm:text-sm rounded-bl-md focus:bg-gray-50/50" />
                            <input v-model="filter" placeholder="条件过滤"
                                class="p-2 w-full h-full outline-none align-middle border-[1px] border-t-0 border-gray-200 sm:text-sm rounded-br-md rounded-br-md focus:bg-gray-50/50" />
                        </div>
                    </div>
                    <div @click="searchDocuments"
                        class="flex justify-center items-center h-10 w-full py-2 px-4 cursor-pointer select-none border border-transparent rounded-md shadow-sm text-sm font-medium text-white outline-none active:ring-[3px] active:ring-gray-200"
                        :class="{ 'bg-gray-800 cursor-not-allowed': queryingStatus == -1, 'bg-red-800': queryingStatus == -2, 'bg-green-700': queryingStatus == 1, 'bg-black hover:bg-gray-900': queryingStatus == 0 }">
                        <template v-if="queryingStatus == 1">
                            <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </template>

                        <template v-else-if="queryingStatus == -1">
                            <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none"
                                viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </template>

                        <template v-else-if="queryingStatus == -2">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-white" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor" stroke-width="4">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </template>

                        <template v-else>
                            检索
                        </template>
                    </div>
                    <div class="flex justify-center items-center h-10 cursor-pointer select-none w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium bg-black hover:bg-gray-900 text-white outline-none active:ring-[3px] active:ring-gray-200"
                        @click="showAddModal = true">
                        添加文档
                    </div>
                    <span class="text-center text-gray-300">注意：该系统为语义检索，调节阈值大小精确控制检索精度。</span>
                </div>
            </div>
            <ul v-show="documents.length > 0"
                class="w-full docs-list bg-white border-[1px] lg:mr-4 min-w-xl p-4 rounded-md md:shadow-sm">
                <li v-for="(document, index) in documents" :key="index" @click="openEditModel(index)"
                    class="p-2 flex flex-col cursor-pointer justify-between items-start rounded-md hover:ring-1 hover:ring-gray-200 hover:bg-gray-50/50">
                    <span class="text-gray-700">{{ document.page_content }}</span>
                    <div class="flex items-center space-x-2">
                        <span class="text-xs text-gray-500">标签:</span>
                        <span v-for="tag in document.metadata.tags" :key="tag"
                            class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-200 text-gray-700">
                            {{ tag }}
                        </span>
                    </div>
                </li>
            </ul>
            <AddModel v-show="showAddModal" @documentAdded="handleDocumentAdded" @closeAddModel="closeAddModel" />
            <EditModel v-if="index > -1 && showEditModal" :index="index" :documents="documents"
                @documentRemoved="handleDocumentRemoved" @closeEditModal="closeEditModal" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Document } from '../api/types';
import AddModel from './AddModel.vue';
import EditModel from './EditModel.vue';
import { queryDocuments } from '../api/documents';

const documents = ref<Document[]>([]);
const index = ref(-1);
const query = ref('');
const k = ref(20);
const filter = ref('{}');
const score_threshold = ref<number>(2.0)
const showAddModal = ref(false);
const showEditModal = ref(false);
const queryingStatus = ref(0);
let timer: any = null;

documents.value = [
        {
            "page_content": "我是一个知识系统的助手，名为小宁！",
            "metadata": {
                "ids": 1,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709101717.7710197,
                "tags": [
                    "初始"
                ]
            }
        },
        {
            "page_content": "图书馆座位可以在学习通，应用中心，宁职书香中预约。",
            "metadata": {
                "ids": 60,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709686644.8373976,
                "tags": [
                    "通用",
                    "图书馆"
                ]
            }
        },
        {
            "page_content": "宁波职业技术学院的王明康楼在“风雨篮球场”西面近学校第三食堂处。",
            "metadata": {
                "ids": 70,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709687012.821722,
                "tags": [
                    "通用",
                    "位置",
                    "王明康楼"
                ]
            }
        },
        {
            "page_content": "负责寝室空调的胡师傅的电话：13958038423",
            "metadata": {
                "ids": 74,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709789084.7499135,
                "tags": [
                    "通用",
                    "生活"
                ]
            }
        },
        {
            "page_content": "学校医务室：东校区18号楼一楼。北仑区人民医院：学校南大门公交站乘756、716、710到北仑中学站下车，向北步行20米即到。",
            "metadata": {
                "ids": 16,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217965.4230542,
                "tags": [
                    "通用",
                    "生活",
                    "医疗"
                ]
            }
        },
        {
            "page_content": "每寝室配有饮用水机一台，桶装水各值班室有售，每桶9元。",
            "metadata": {
                "ids": 12,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217874.777914,
                "tags": [
                    "通用",
                    "生活",
                    "饮用水"
                ]
            }
        },
        {
            "page_content": "心理健康教育与咨询中心电话：86891360；地点：东校区6号楼（创业学院三楼）；微信公众平台：宁职企业号-心灵驿站。",
            "metadata": {
                "ids": 36,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709218689.7358596,
                "tags": [
                    "通用",
                    "生活",
                    "心理",
                    "心理咨询"
                ]
            }
        },
        {
            "page_content": "寝室内装有热水洗浴装置，每天7:00-22:30学生可登入学校企业号“热水洗浴系统”操作使用。",
            "metadata": {
                "ids": 9,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217735.1727476,
                "tags": [
                    "通用",
                    "热水",
                    "生活"
                ]
            }
        },
        {
            "page_content": "寝室早上6:00开门，22:00关门，22:30熄灯。",
            "metadata": {
                "ids": 15,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217928.523612,
                "tags": [
                    "通用",
                    "生活",
                    "作息时间"
                ]
            }
        },
        {
            "page_content": "宁波职业技术学院 保卫处（校园110）电话：0574-86891337。",
            "metadata": {
                "ids": 68,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709637164.1630073,
                "tags": [
                    "联系方式"
                ]
            }
        },
        {
            "page_content": "各分院负责社区工作老师名单和联系方式： 机电学院王建勇老师联系电话是676419、机电学院袁雪梅老师联系电话是660307、机电学院赵伟欣老师联系电话是663460、工商学院老师崔好丽和赵莹莹联系电话是664335、艺术学院李锡勇老师联系方式是658805、建工学院张冰倩老师联系方式是665503、化工学院卢腾老师的联系方式是657232、人工智能学院王佳浩老师的联系方式是661437、人工智能学院的许科威老师的联系方式是671875。国际学院薛海涛老师的联系方式上654326。",
            "metadata": {
                "ids": 72,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709737145.0105453,
                "tags": [
                    "通用",
                    "联系方式"
                ]
            }
        },
        {
            "page_content": "校园网登录出现用户暂停等情况，请前往校内对应营业厅。营业厅上班时间为周一至周五早上8点到晚上17点。",
            "metadata": {
                "ids": 48,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709535264.9311934,
                "tags": [
                    "通用",
                    "生活",
                    "校园网"
                ]
            }
        },
        {
            "page_content": "学分查询方法：学校官网-校园门户-教务系统-信息查询-学生学业情况查询。",
            "metadata": {
                "ids": 63,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709702867.5312433,
                "tags": [
                    "通用",
                    "学分",
                    "教务"
                ]
            }
        },
        {
            "page_content": "每栋公寓中配置了微信扫码自助洗衣机。咨询地点：各楼值班室  咨询电话：86891000",
            "metadata": {
                "ids": 14,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217902.4573154,
                "tags": [
                    "通用",
                    "生活",
                    "自助洗衣"
                ]
            }
        },
        {
            "page_content": "每寝室配有网络端口，无线网络覆盖，开通网络可到创业街上电信、移动营业厅咨询 关于网络问题具体咨询网管中心电话：86891580",
            "metadata": {
                "ids": 11,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709217855.7900958,
                "tags": [
                    "通用",
                    "生活",
                    "网络"
                ]
            }
        },
        {
            "page_content": "宁波职业技术学院 党委办公室电话：0574-86891367。",
            "metadata": {
                "ids": 56,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709637178.4166305,
                "tags": [
                    "联系方式"
                ]
            }
        },
        {
            "page_content": "非“到梦空间”的活动如果有相关材料证明，可以自行前往“到梦空间APP”-成长记录-申请记录-填写申请表单自行申请。主办方可能在“到梦空间”同步申请的活动奖励，活动的具体信息还需要亲自联系活动主办方得知。",
            "metadata": {
                "ids": 61,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709686912.2163906,
                "tags": [
                    "通用",
                    "到梦空间"
                ]
            }
        },
        {
            "page_content": "本学期教务系统公选课【限选3门】选课安排如下：面授选课：3月6日13:00-3月7日16:00；网络选课：3月14日13:00-3月15日16:00；选课平台：教务系统；考试时间：教学周第18周。本学期尔雅选课【限选2门】安排如下：尔雅选课：03月18日13:00-03月20日16:00；选课平台：超星平台/学习通app；考试时间：4月30日（全天）和6月25日（全天）。",
            "metadata": {
                "ids": 71,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709720273.6393921,
                "tags": [
                    "通用",
                    "公选课"
                ]
            }
        },
        {
            "page_content": "寝室缴费##寝室支付##寝室微信付款在什么地方##哪里有寝室微信支付##宿舍微信支付在哪个位置\n企业微信：工作台（微信：企业号）-学生中心-缴费大厅-选择对应寝室类型进行缴费。",
            "metadata": {
                "ids": 81,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709821348.844404,
                "tags": [
                    "通用"
                ]
            }
        },
        {
            "page_content": "宁波职业技术学院 教务处电话：0574-86891368。",
            "metadata": {
                "ids": 53,
                "splitter": "default",
                "valid_time": -1,
                "related": false,
                "start_time": 1709637140.1077516,
                "tags": [
                    "联系方式"
                ]
            }
        }
    ]

const openEditModel = (t_idx: number) => {
    index.value = t_idx;
    showEditModal.value = true;
}

const closeAddModel = () => {
    showAddModal.value = false;
}

const closeEditModal = () => {
    showEditModal.value = false;
}

const handleDocumentAdded = (newDocument: Document) => {
    documents.value.push(newDocument);
}

const handleDocumentRemoved = (removed_index: number) => {
    documents.value.splice(removed_index, 1);
}

const searchDocuments = async () => {
    if (queryingStatus.value == -1) return;
    queryingStatus.value = -1;
    clearTimeout(timer);
    try {
        const results = await queryDocuments(query.value, k.value, JSON.parse(filter.value), Number(score_threshold.value));
        documents.value = results;
        queryingStatus.value = 1;
        timer = setTimeout(() => {
            queryingStatus.value = 0;
        }, 3000);
    } catch (error) {
        queryingStatus.value = -2;
        console.error('检索文档错误:', error);
    }
};
</script>

<style scoped>
* {
    transition: all .2s !important;
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
        animation: slideIn .4s cubic-bezier(0.5, 0, 0, 1) forwards;
    }
}
</style>./AddModel.vue./EditModel.vue
