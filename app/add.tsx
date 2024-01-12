import React, { useState, useEffect } from 'react'
import axios from 'axios';
import moment from 'moment';

export default function Add() {
    const [tags, setTags] = useState<string[]>([]);
    const [pageContent, setPageContent] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [selectedDatetime, setSelectedDatetime] = useState(moment().format('YYYY-MM-DD HH:mm'));

    const clearFormData = () => {
        setPageContent('');
        setTagValue('');
        setTags([]);
        setSelectedDatetime(moment().format('YYYY-MM-DD HH:mm'));
    }

    async function fetchData() {
        try {
            const valid_time = Math.round(getTimeDifference(selectedDatetime) / 1000);
            if (valid_time <= 0) throw new Error('有效时间必须大于0秒');
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
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    const getTimeDifference = (d: any) => {
        const currentTime = Date.now();
        return moment(d).diff(currentTime, 'milliseconds');
    };

    const handleDateTimeChange = (e: any) => {
        const selectedDateTime = e.target.value;
        const currentTime = moment().format('YYYY-MM-DDTHH:mm');

        if (selectedDateTime < currentTime) {
            return;
        }

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
                                            id="about"
                                            name="about"
                                            value={pageContent}
                                            placeholder='请填写 文档/知识 内容，不少于5个字符...'
                                            onChange={handlePageContentChange}
                                            rows={3}
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
                                                    className="shadow-sm border rounded-md w-full block py-2 px-3 pl-2 text-gray-900 placeholder:text-gray-400 sm:leading-6 focus:bg-gray-50"
                                                    placeholder="按下回车添加标签"
                                                />
                                                <div className='mt-3'>
                                                    {tags.map((label, index) => (
                                                        <span key={index} onClick={() => handleTagDelete(index)} className="cursor-pointer select-none inline-block bg-slate-600 hover:bg-slate-500 rounded-sm px-1.5 py-1 font-semibold text-white mr-1 mb-1">
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
                                        <div className="pb-4">
                                            <input
                                                id="datePicker"
                                                type="datetime-local"
                                                value={selectedDatetime}
                                                onChange={handleDateTimeChange}
                                                className="shadow-sm border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:bg-gray-50"
                                            />
                                            {selectedDatetime && (
                                                <p className="text-gray-500 mt-2">选择的日期: {formatDateTime(selectedDatetime)}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="py-3 sm:flex sm:flex-row-reverse sm:px-1">
                <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md bg-slate-500 px-5 py-2 text-white shadow-sm hover:bg-slate-600 sm:ml-3 sm:w-auto"
                    onClick={() => fetchData()}
                >
                    添加
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md px-5 py-2 text-white shadow-sm bg-red-500 hover:bg-red-600 sm:mt-0 sm:w-auto"
                    onClick={() => clearFormData()}
                >
                    重置
                </button>
            </div>
        </div>
    );
}
