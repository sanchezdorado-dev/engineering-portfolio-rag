import type { MilvusClient } from '@zilliz/milvus2-sdk-node';
import { generateEmbedding } from './embedding-service.ts';
import { getMilvusClient } from './milvus-client.ts';

const SEARCH_CONFIG = {
    TOP_K: 4,
    HNSW_EF: 64,
    MIN_SCORE: 0.3,
    MAX_QUERY_LENGTH: 500,
    VECTOR_FIELD: 'vector',
    OUTPUT_FIELDS: ['content', 'metadata'] as const,
} as const;

const resolveCollectionName = (): string =>
    process.env.MILVUS_COLLECTION_NAME ?? 'portfolio_rag';

export interface RagSearchResult {
    readonly content: string;
    readonly score: number;
    readonly metadata: Record<string, unknown>;
}

const validateQuery = (query: string): void => {
    const trimmed = query.trim();
    if (trimmed.length === 0) throw new Error('Query cannot be empty');
    if (trimmed.length > SEARCH_CONFIG.MAX_QUERY_LENGTH) {
        throw new Error(`Query exceeds maximum length of ${SEARCH_CONFIG.MAX_QUERY_LENGTH} characters`);
    }
};

const normalizeMetadata = (raw: unknown): Record<string, unknown> => {
    if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
        return raw as Record<string, unknown>;
    }
    return {};
};

const extractContent = (hit: Record<string, unknown>): string => {
    const content = hit['content'];
    return typeof content === 'string' ? content : '';
};

const executeSearch = async (
    client: MilvusClient,
    vector: number[],
    collectionName: string,
): Promise<RagSearchResult[]> => {
    const response = await client.search({
        collection_name: collectionName,
        data: [vector],
        anns_field: SEARCH_CONFIG.VECTOR_FIELD,
        limit: SEARCH_CONFIG.TOP_K,
        output_fields: [...SEARCH_CONFIG.OUTPUT_FIELDS],
        params: { ef: SEARCH_CONFIG.HNSW_EF },
    });

    const hits = response.results as unknown as Array<Record<string, unknown>>;

    return hits
        .filter((hit) => {
            const score = hit['score'];
            return typeof score === 'number' && score >= SEARCH_CONFIG.MIN_SCORE;
        })
        .map((hit) => ({
            content: extractContent(hit),
            score: hit['score'] as number,
            metadata: normalizeMetadata(hit['metadata']),
        }))
        .filter((result) => result.content.length > 0);
};

export const searchKnowledge = async (query: string): Promise<RagSearchResult[]> => {
    validateQuery(query);

    const [embeddingResult, client] = await Promise.all([
        generateEmbedding(query.trim()),
        getMilvusClient(),
    ]);

    return executeSearch(client, embeddingResult.embedding, resolveCollectionName());
};

export const extractChunks = (results: RagSearchResult[]): string[] =>
    results.map((result) => result.content);
