import React, { useState } from 'react';
import axios from 'axios';
import { Document } from './page';
import './table.css';

export default function Table({ docs, searchValue, setDocs }: { docs: Document[], searchValue?: string, setDocs?: any }) {
    const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

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
                    console.log(result['code']);
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
        <div className="overflow-hidden relative w-full rounded-lg bg-white shadow-sm border-0 mt-6">
            {docs.length > 0 ? (
                <div className="max-w-full">
                    <ul>
                        <li className='text-left bg-gray-300/50 whitespace-no-wrap py-4 px-8 font-semibold w-full'>文档内容</li>
                        {docs.map((doc) => (
                            <li
                                className={'data-area-row relative cursor-default border-b border-gray-200 hover:bg-gray-50'}
                                key={doc.metadata['ids']}
                            >
                                <div className="w-full p-4 select-none">{doc.page_content}</div>
                                <div className='absolute control flex'>
                                    <div
                                        className={`p-4 flex flex-col content-center justify-center cursor-pointer select-none ${confirmDelete === doc.metadata['ids'] ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white`}
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
                <div className='text-gray-600 px-8 py-4'>{searchValue ? '检索中...' : '请在上方输入以检索信息'}</div>
            )}
        </div>
    );
}
