export interface Document {
	content: string;
	metadata: DocumentMetadata;
}

export interface DocumentMetadata {
	id?: string;
	tags?: string[];
	categories?: string[];
}

export interface Notification {
	id: number;
	message: string;
}
