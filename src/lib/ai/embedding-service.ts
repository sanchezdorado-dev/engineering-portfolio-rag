import {
    EMBEDDING_API_KEY,
    EMBEDDING_API_MODEL,
    EMBEDDING_API_URL,
} from 'astro:env/server';

export interface EmbeddingResult {
    embedding: number[];
    text: string;
    model: string;
}

interface RemoteEmbeddingItem {
    embedding?: number[];
}

interface OpenAIEmbeddingResponse {
    data?: RemoteEmbeddingItem[];
}

const normalizeEmbeddingResponse = (json: unknown, expectedCount: number): number[][] => {
    if (Array.isArray(json)) {
        if (json.length > 0 && typeof json[0] === 'number') {
            return [json as number[]];
        }
        return json as number[][];
    }

    if (typeof json === 'object' && json !== null && 'data' in json) {
        const openAI = json as OpenAIEmbeddingResponse;
        return (openAI.data ?? []).map((item) => item.embedding ?? []);
    }

    throw new Error(`Unrecognized embedding response format for ${expectedCount} inputs`);
};

interface ResolvedConfig {
    apiUrl: string;
    apiKey: string;
    model: string;
}

const resolveConfig = (): ResolvedConfig => {
    const apiUrl = EMBEDDING_API_URL;
    const apiKey = EMBEDDING_API_KEY;

    if (!apiUrl || !apiKey) {
        throw new Error('EMBEDDING_API_URL and EMBEDDING_API_KEY are required');
    }

    return {
        apiUrl,
        apiKey,
        model: EMBEDDING_API_MODEL ?? 'text-embedding-3-small',
    };
};

const requestEmbeddings = async (
    inputs: string[],
    config: ResolvedConfig,
): Promise<number[][]> => {
    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
        },

        body: JSON.stringify({ inputs }),
    });

    if (!response.ok) {
        const payload = await response.text();
        throw new Error(`Embedding request failed: ${response.status} ${payload}`);
    }

    const json: unknown = await response.json();
    const embeddings = normalizeEmbeddingResponse(json, inputs.length);

    if (embeddings.length !== inputs.length || embeddings.some((vec) => vec.length === 0)) {
        throw new Error('Embedding response has missing or empty vectors');
    }

    return embeddings;
};

export const generateEmbedding = async (text: string): Promise<EmbeddingResult> => {
    const config = resolveConfig();
    const embeddings = await requestEmbeddings([text], config);
    const embedding = embeddings[0];

    if (embedding === undefined || embedding.length === 0) {
        throw new Error('Embedding response returned no vector');
    }

    return { embedding, text, model: config.model };
};

export const generateEmbeddings = async (texts: string[]): Promise<EmbeddingResult[]> => {
    if (texts.length === 0) return [];

    const config = resolveConfig();
    const embeddings = await requestEmbeddings(texts, config);

    return texts.map((text, index) => {
        const embedding = embeddings[index];

        if (embedding === undefined || embedding.length === 0) {
            throw new Error(`Missing embedding vector at index ${index}`);
        }

        return { embedding, text, model: config.model };
    });
};
