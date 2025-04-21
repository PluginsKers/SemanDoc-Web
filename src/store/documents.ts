import { defineStore } from "pinia";
import { searchDocuments } from "@/api/documents";
import { Document } from "@/types";

export const useDocumentsStore = defineStore("documents", {
	state: () => ({
		searchResults: [] as Document[],
	}),
	actions: {
		async searchDocuments(
			query: string,
			k: number = 5,
			tags?: string[],
			categories?: string[],
		) {
			try {
				const results = await searchDocuments(
					query,
					k,
					tags,
					categories,
				);
				this.searchResults = results;
			} catch (error) {
				console.error("Failed to search documents:", error);
				throw error;
			}
		},
	},
	getters: {
		getSearchResults: (state) => state.searchResults,
	},
});
