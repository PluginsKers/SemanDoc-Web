"use client"

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Title, Text } from '@tremor/react';
import Search from './search';
import Table from './table';
import Add from './add';

export interface Metadata {
    ids: number;
    splitter: string;
    valid_time: number;
    related: boolean;
    start_time: number;
    tags: string[];
}

export interface Document {
    page_content: string;
    metadata: Metadata;
}

export default function IndexPage({
    searchParams,
}: {
    searchParams: { q: string };
}) {
    let search = searchParams.q ?? '';
    const [docs, setDocs] = useState<Document[]>([]);

    const memoizedDocs = useMemo(() => docs, [docs]);

    useEffect(() => {
        async function fetchData() {
            setDocs([]);
            try {
                const response = await axios.get('https://ai.app.nbpt.edu.cn/api/query', {
                    params: { query: search },
                });
                const result = response.data;
                setDocs(result.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }
        if (search.length > 0) {
            fetchData();
        } else {
            setDocs([]);
        }
    }, [search]);

    return (
        <main className="p-4 md:p-10 mx-auto max-w-7xl">
            <Title>知识库</Title>
            <Text>用于检索服务的知识库内容管理</Text>
            <Search searchValue={search} />
            <Table docs={memoizedDocs} searchValue={search} />
            <Add />
        </main>
    );
}