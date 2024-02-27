export interface Document {
    id: number;
    page_content: string;
    metadata: Record<string, any>;
}