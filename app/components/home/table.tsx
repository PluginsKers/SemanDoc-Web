import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment';
import { Document } from '../../pages/home/page';
import '../../styles/table.css';

export default function Table({ docs, searchValue, setDocs }: { docs: Document[], searchValue?: string, setDocs?: any }) {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

    function calculateTimePercentage(start_time: number, valid_time: number) {
        return valid_time == -1 ? 0 : Math.round(((moment().unix() - start_time) / valid_time) * 100);
    }


    const handleDelete = async (docId: number) => {
        if (confirmDelete === docId) {
            const index = docs.findIndex(doc => doc.metadata['ids'] === docId);
            const ids = docId;
            let successed = false;
            const deleteData = async (ids: number) => {
                try {
                    const response = await axios.get('https://ai.app.nbpt.edu.cn/api/edit/remove', {
                        params: { type: 'ids', target: JSON.stringify([ids]) },
                    });
                    const result = response.data;
                    if (result['code'] == 200) {
                        successed = true;
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            await deleteData(ids);
            if (index !== -1 && successed) {
                const newDocs = [...docs.slice(0, index), ...docs.slice(index + 1)];
                setDocs(newDocs);
                setConfirmDelete(null);
            }
        } else {
            setConfirmDelete(docId);
        }
    };

    return (
        <div className="overflow-hidden relative w-full text-sm rounded-lg bg-white shadow-sm mt-6">
            {docs.length > 0 ? (
                <div className="max-w-full">
                    <ul>
                        {docs.map((doc) => (
                            <li
                                className={'data-area-row relative cursor-default border-b border-gray-200 hover:bg-gray-50 py-4'}
                                key={doc.metadata['ids']}
                            >
                                <div className="w-full px-4 sm:px-8">
                                    <div
                                        className={"absolute bg-gray-200/20 bottom-0 right-0 h-full z-1 " + (calculateTimePercentage(doc.metadata.start_time, doc.metadata.valid_time) != 0 ? 'border-l border-l-gray-200 ' : '')}
                                        style={{
                                            width: `${calculateTimePercentage(doc.metadata.start_time, doc.metadata.valid_time)}%`
                                        }}
                                    ></div>
                                    <div className='relative select-all z-2'>{doc.page_content}</div>
                                    </div>
                                <div className='absolute control flex z-2'>
                                    <div
                                        className={`flex px-4 flex-col content-center justify-center cursor-pointer select-none ${confirmDelete === doc.metadata['ids'] ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
                                        onClick={() => handleDelete(doc.metadata['ids'])}
                                    >
                                        {confirmDelete === doc.metadata['ids'] ? '确认' : '删除'}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className='text-gray-600 px-5 sm:px-8 py-4'>{searchValue ? (
                    <div className="flex items-center justify-center">
                        <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-700"
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
                        </svg>
                        检索中
                    </div>
                ) : '请在上方输入以检索信息'}</div>
            )}
        </div>
    );
}
