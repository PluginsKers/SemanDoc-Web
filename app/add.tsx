"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';
import { Document } from './page';

export default function Add({ docs, setDocs }: { docs: Document[], setDocs?: any }) {
    const [tags, setTags] = useState<string[]>([]);
    const [pageContent, setPageContent] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [selectedDatetime, setSelectedDatetime] = useState(moment().format('YYYY-MM-DD HH:mm'));
    const [tip, setTip] = useState<{ status: 'success' | 'error' | 'loading' | null, msg: string }>({ status: null, msg: '' });

    const clearFormData = () => {
        setPageContent('');
        setTagValue('');
        setTags([]);
        setSelectedDatetime(moment().format('YYYY-MM-DD HH:mm'));
    }

    const addMinutesToSelectedDatetime = (minutesToAdd: number) => {
        const newDatetime = moment().add(minutesToAdd, 'minutes').format('YYYY-MM-DD HH:mm');
        setSelectedDatetime(newDatetime);
    };

    async function fetchData() {
        setTip({ status: 'loading', msg: '添加中...' });
        try {
            const valid_time = Math.round(getTimeDifference(selectedDatetime) / 1000);
            if (valid_time <= 0) throw '有效时间必须大于0秒';
            const response = await axios.get('https://ai.app.nbpt.edu.cn/api/edit/add', {
                params: {
                    data: pageContent,
                    metadata: JSON.stringify({
                        tags: tags,
                        valid_time: valid_time
                    })
                },
            });
            const result = response.data;
            if (result['code'] === 200) {
                setTip({ status: 'success', msg: '添加成功' });
                setDocs([...docs, ...result['data']]);
            } else {
                setTip({ status: 'error', msg: result['msg'] });
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setTip({ status: 'error', msg: `出现错误：${error}` });
        }
    }

    const getTimeDifference = (d: any) => {
        const currentTime = Date.now();
        return moment(d).diff(currentTime, 'milliseconds');
    };

    const handleDateTimeChange = (e: any) => {
        const selectedDateTime = e.target.value;
        const currentTime = moment().format('YYYY-MM-DDTHH:mm');

        // if (selectedDateTime < currentTime) {
        //     return;
        // }

        setSelectedDatetime(selectedDateTime);
    };

    const formatDateTime = (dateTime: string) => {
        return moment(dateTime).format('YYYY-MM-DD HH:mm');
    };

    const handlePageContentChange = (e: any) => {
        setPageContent(e.target.value);
    };

    const handleTagChange = (e: any) => {
        setTagValue(e.target.value);
    };

    const handleTagKeyDown = (e: any) => {
        if (e.key === 'Enter') {
            if (tagValue.length == 0) return;
            for (let i = 0; i < tags.length; i++) {
                if (tags[i] == tagValue) return;
            }
            setTags([...tags, tagValue]);
            setTagValue('');
        }
    };

    const handleTagDelete = (index: any) => {
        const updatedLabels = tags.filter((_, i) => i !== index);
        setTags(updatedLabels);
    };

    return (
        <div className="relative w-full text-sm text-left rounded-lg bg-white shadow-sm p-4 py-4 mt-6">
            <div className="bg-white px-1 py-3 pb-2 pt-3 sm:p-0 sm:pb-2">
                <div className="sm:ml-4 sm:mt-0 text-left">
                    <div className="mt-2">
                        <div className="space-y-12">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <div className="mt-4">
                                        <textarea
                                            id="page_content"
                                            value={pageContent}
                                            rows={5}
                                            placeholder='请填写 文档/知识 内容，不少于5个字符...'
                                            onChange={handlePageContentChange}
                                            className="block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 sm:leading-6 focus:bg-gray-50"
                                        />
                                    </div>

                                    <div className="mt-8">
                                        <label htmlFor="tagPicker" className="my-2 mt-4 text-base block font-medium leading-6 text-gray-900">
                                            数据标签
                                        </label>
                                        <div className='mb-2'>
                                            <div>
                                                <input
                                                    id="tagPicker"
                                                    type="text"
                                                    value={tagValue}
                                                    onChange={handleTagChange}
                                                    onKeyDown={handleTagKeyDown}
                                                    className="shadow-sm border rounded-md w-full block py-2 px-3 pl-2 text-gray-900 placeholder:text-gray-400 focus:bg-gray-50"
                                                    placeholder="按下回车添加标签"
                                                />
                                                <div className='mt-3'>
                                                    {tags.map((label, index) => (
                                                        <span key={index} onClick={() => handleTagDelete(index)} className="cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-1.5 py-1 text-white mr-1 mb-1">
                                                            {label}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-8">
                                        <label htmlFor="datePicker" className="my-2 mt-4 text-base block font-medium leading-6 text-gray-900">
                                            截止日期
                                        </label>
                                        <div className="mb-2">
                                            <input
                                                id="datePicker"
                                                type="datetime-local"
                                                value={selectedDatetime}
                                                onChange={handleDateTimeChange}
                                                className="shadow-sm border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:bg-gray-50"
                                            />
                                            {selectedDatetime && (
                                                <p className="text-gray-400 mt-2">选择的日期: {formatDateTime(selectedDatetime)}</p>
                                            )}
                                        </div>
                                        <div className="mb-4">
                                            <div onClick={() => addMinutesToSelectedDatetime(30)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>30分钟</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(60)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>1小时</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(360)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>6小时</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(1440)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>1天</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(10080)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>7天</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(43200)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>30天</div>
                                            <div onClick={() => addMinutesToSelectedDatetime(518400)} className='cursor-pointer shadow-sm select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-2 py-1 text-white mr-1 mb-1'>365天</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-3 mt-3 sm:flex sm:flex-row-reverse sm:px-1 select-none   ">
                <button
                    disabled={tip.status === 'loading'}
                    className={"cursor-pointer border inline-flex w-full justify-center rounded px-5 py-2 text-white sm:ml-3 sm:w-auto " + (tip.status === 'loading' ? 'opacity-80 cursor-not-allowed bg-black px-6 ' : (tip.status === 'error' ? 'bg-red-500 hover:bg-red-600 border-red-600  ' : tip.status === 'success' ? 'bg-green-500 hover:bg-green-600 border-green-600 ' : 'bg-sky-400 hover:bg-sky-500 border-sky-500 '))}
                    onClick={() => fetchData()}
                >
                    {tip.status === 'loading' ? (<svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                    </svg>) : (tip.status !== null ? tip.msg : '添加')}
                </button>
                <button
                    className="cursor-pointer border border-gray-300 mt-3 inline-flex w-full justify-center rounded px-5 py-2 text-black bg-gray-200 hover:bg-gray-300/90 sm:mt-0 sm:w-auto"
                    onClick={() => clearFormData()}
                >
                    重置
                </button>
            </div>
        </div>
    );
}
