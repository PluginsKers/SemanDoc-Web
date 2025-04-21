import { defineStore } from "pinia";
import { searchDocuments, getDocumentStats } from "@/api/documents";
import { Document } from "@/types";

export interface StatsOverview {
	total_documents: number;
	unique_tags: string[];
	unique_categories: string[];
	documents_per_tag: Record<string, number>;
	documents_per_category: Record<string, number>;
}

export const useDocumentsStore = defineStore("documents", {
	state: () => ({
		searchResults: [] as Document[],
		statsOverview: null as StatsOverview | null,
	}),
	actions: {
		async searchDocuments(
			query: string,
			k: number = 5,
			tags?: string[],
			categories?: string[],
			score_threshold?: number,
		) {
			try {
				const results = await searchDocuments(
					query,
					k,
					tags,
					categories,
					score_threshold,
				);
				this.searchResults = results;
			} catch (error) {
				console.error("Failed to search documents:", error);
				throw error;
			}
		},

		async fetchStatsOverview() {
			try {
				const stats = await getDocumentStats();
				this.statsOverview = stats;
				return stats;
			} catch (error) {
				console.error("Failed to fetch document stats:", error);
				throw error;
			}
		},
	},
	getters: {
		getSearchResults: (state) => state.searchResults,
		getStatsOverview: (state) => state.statsOverview,
	},
});
