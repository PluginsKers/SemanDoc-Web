export interface Document {
    id: number;
    page_content: string;
    metadata: Record<string, any>;
}

export interface Notification {
    id: number;
    message: string;
}