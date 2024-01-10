import React, { useState, useEffect } from 'react'
import axios from 'axios';

export default function Add() {
    const [tags, setTags] = useState<string[]>([]);
    const [pageContent, setPageContent] = useState('');
    const [tagValue, setTagValue] = useState('');
    const [selectedDatetime, setSelectedDatetime] = useState(new Date().toISOString().slice(0, 16));

    async function fetchData() {
        try {
            const response = await axios.get('https://ai.app.nbpt.edu.cn/api/edit/add', {
                params: {
                    data: pageContent,
                    metadata: JSON.stringify({
                        tags: tags,
                        valid_time: getTimeDifference(selectedDatetime)
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
        return new Date(d).getTime() - currentTime;
    };

    const formatDateTime = (e: any) => {
        const time = e;
        const parsedDateTime = new Date(time);
        const formattedDateTime = `${parsedDateTime.getFullYear()}-${String(
            parsedDateTime.getMonth() + 1
        ).padStart(2, '0')}-${String(parsedDateTime.getDate()).padStart(2, '0')} ${String(
            parsedDateTime.getHours()
        ).padStart(2, '0')}:${String(parsedDateTime.getMinutes()).padStart(2, '0')}`;

        return formattedDateTime;
    };

    const handleDateTimeChange = (e: any) => {
        const selectedDateTime = e.target.value;
        console.log(selectedDateTime)
        const currentTime = new Date().toISOString().slice(0, 16);
        if (selectedDateTime < currentTime) {
            return;
        }
        setSelectedDatetime(selectedDateTime);
    };


    const handlePageContentChange = (e: any) => {
        setPageContent(e.target.value);
    };

    const handleTagChange = (e: any) => {
        setTagValue(e.target.value);
        console.log(tags)
    };

    const handleTagKeyPress = (e: any) => {
        if (e.key === 'Enter') {
            setTags([...tags, tagValue]);
            setTagValue('');
        }
    };

    const handleTagDelete = (index: any) => {
        const updatedLabels = tags.filter((_, i) => i !== index);
        setTags(updatedLabels);
    };

    return (
        <div className="relative w-full text-left rounded-tremor-default bg-tremor-background shadow-tremor-card border-0 p-4 py-6 mt-6">
            <div className="bg-white px-1 py-3 pb-2 pt-3 sm:p-0 sm:pb-2">
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                        添加数据
                    </h3>
                    <div className="mt-2">
                        <div className="space-y-12">
                            <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                <div className="col-span-full">
                                    <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                                        内容
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            id="about"
                                            name="about"
                                            value={pageContent}
                                            onChange={handlePageContentChange}
                                            rows={3}
                                            className="block w-full rounded-md border py-2 px-3 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:shadow-outline"
                                        />
                                    </div>
                                    <p className="mt-2 text-sm leading-6 text-gray-600">内容需至少有5个字符</p>

                                    <label htmlFor="tagPicker" className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                                        添加数据标签
                                    </label>
                                    <div className='mb-4'>
                                        <div>
                                            <div className='mb-2'>
                                                {tags.map((label, index) => (
                                                    <span key={index} onClick={() => handleTagDelete(index)} className="cursor-pointer inline-block bg-gray-200 hover:bg-gray-300 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-700 mr-1.5 mt-1.5">
                                                        {label}
                                                    </span>
                                                ))}
                                            </div>
                                            <input
                                                id="tagPicker"
                                                type="text"
                                                value={tagValue}
                                                onChange={handleTagChange}
                                                onKeyPress={handleTagKeyPress}
                                                className="shadow-sm appearance-none border rounded-md w-full block py-2 px-3 pl-2 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6 focus:outline-none focus:shadow-outline"
                                                placeholder="按下回车添加标签"
                                            />
                                        </div>
                                    </div>
                                    <label htmlFor="datePicker" className="mt-4 block text-sm font-medium leading-6 text-gray-900">
                                        选择截止的日期
                                    </label>
                                    <div className="pb-4">
                                        <input
                                            id="datePicker"
                                            type="datetime-local"
                                            value={selectedDatetime}
                                            onChange={handleDateTimeChange}
                                            className="shadow-sm appearance-none border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                        />
                                        {selectedDatetime && (
                                            <p className="text-gray-500 text-sm mt-2">选择的日期: {formatDateTime(selectedDatetime)}</p>
                                        )}
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
                    className="inline-flex w-full justify-center rounded-md bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 sm:ml-3 sm:w-auto"
                    onClick={() => fetchData()}
                >
                    添加
                </button>
                <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md px-5 py-2 text-sm font-semibold text-white shadow-sm bg-red-700 hover:bg-red-800 sm:mt-0 sm:w-auto"
                >
                    重置
                </button>
            </div>
        </div>
    );
}
