import { Document, DocumentMetadata } from "@/types";
import http from "@/api/http";

// 查询文档列表
export const getDocuments = async (): Promise<Document[]> => {
	const response = await http.get(`/documents`);
	return response.data.data;
};

// 搜索文档
export const searchDocuments = async (
	query: string,
	k: number = 5,
	tags?: string[],
	categories?: string[],
	score_threshold?: number,
): Promise<Document[]> => {
	const response = await http.post(`/documents/search/`, {
		query,
		k,
		tags: tags || [],
		categories: categories || [],
		score_threshold: score_threshold || 2.0,
	});
	return response.data;
};

// 通过ID查询文档
export const getDocumentById = async (id: string): Promise<Document> => {
	const response = await http.get(`/documents/${id}`);
	return response.data.data;
};

// 通过ID删除文档
export const deleteDocument = async (id: string): Promise<void> => {
	await http.delete(`/documents/${id}`);
};

// 添加文档
export const addDocument = async (
	content: string,
	metadata: DocumentMetadata,
): Promise<Document> => {
	const response = await http.post(`/documents`, {
		content,
		metadata,
	});
	return response.data;
};

// 批量添加文档
export const addDocuments = async (
	documents: {
		content: string;
		metadata: DocumentMetadata;
	}[],
): Promise<Document[]> => {
	const response = await http.post(`/documents/batch`, {
		documents,
	});
	return response.data;
};

export const uploadDocuments = async (file: File): Promise<Document[]> => {
	const formData = new FormData();
	formData.append("file", file);

	try {
		const response = await http.post(`/documents/upload/xlsx`, formData, {
			headers: {
				"Content-Type": "multipart/form-data",
			},
			transformRequest: [],
		});
		return response.data;
	} catch (error) {
		console.error("Upload failed:", error);
		throw error;
	}
};

export const removeDocument = async (target: string[]) => {
	const response = await http.delete(`/document/${target[0]}`);
	return response.data;
};

export const removeDocuments = async (target: string[]) => {
	const response = await http.delete(`/documents`, {
		data: {
			ids: target,
		},
	});
	return response.data;
};

export const updateDocument = async (
	target: string,
	content: string,
	metadata: DocumentMetadata,
) => {
	const response = await http.put(`/documents/${target}`, {
		content,
		metadata,
	});
	return response.data;
};

export const downloadDocumentsList = async () => {
	try {
		const response = await http.get(`/documents/export/xlsx`, {
			responseType: "blob",
		});

		const url = window.URL.createObjectURL(
			new Blob([response.data], { type: "text/csv;charset=utf-8;" }),
		);
		const link = document.createElement("a");
		link.href = url;
		link.setAttribute("download", "output.xlsx");

		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
	} catch (error) {
		console.error("Download failed:", error);
		throw error;
	}
};

// 获取文档统计概览信息
export const getDocumentStats = async () => {
	const response = await http.get(`/documents/stats/overview`);
	return response.data;
};
