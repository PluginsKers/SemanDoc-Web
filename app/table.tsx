"use client"

import React, { useState } from 'react'
import { Document } from './page'

import './table.css'

export default function Table({ docs, searchValue }: { docs: Document[], searchValue?: string }) {
    return (
        <div className="overflow-hidden relative w-full rounded-lg bg-white shadow-sm border-0 mt-6">
            {docs.length > 0 ?
                (
                    <div className="max-w-full">
                        <table className="table-fixed">
                            <thead>
                                <tr className='text-left bg-gray-300/50 whitespace-no-wrap'>
                                    <th className='py-4 px-8 font-semibold w-2/3'>文档内容</th>
                                    <th className='py-4 px-8 w-1/6 hidden'>剩余时间</th>
                                    <th className='py-4 px-8 w-1/6 hidden'>元信息</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white'>
                                {docs.map((doc) => (
                                    <tr className='cursor-default border-b max-h-fit border-gray-200 hover:bg-gray-50' key={doc.metadata['ids']}>
                                        <td
                                            className='py-4 px-8'
                                            title={doc.page_content}
                                        >
                                            {doc.page_content}
                                        </td>
                                        <td className='py-4 px-8 hidden'>
                                            {String(doc.metadata)}
                                        </td>
                                        <td
                                            className='py-4 px-8 hidden'
                                        >
                                            {String(doc.metadata)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (<div className='text-gray-600 px-8 py-4'>{searchValue ? '检索中...' : '请在上方输入以检索信息'}</div>)
            }
        </div>
    );
}
