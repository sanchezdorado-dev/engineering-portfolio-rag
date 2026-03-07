import type { MilvusClient, RowData } from '@zilliz/milvus2-sdk-node';
import {
    portfolioKnowledgeBase,
    type PersonalProfile,
    type Project,
    type TechnologyCategory,
    type TrajectoryEntry,
} from '../src/data/portfolio-knowledge-base.ts';
import { getMilvusClient } from '../src/lib/ai/milvus-client.ts';

const COLLECTION_NAME = process.env.MILVUS_COLLECTION_NAME ?? 'portfolio_rag';
const EMBEDDING_BATCH_SIZE = 10;
const INSERT_BATCH_SIZE = 100;
const MAX_CONTENT_LENGTH = 2048;

type MetadataSection = 'profile' | 'trajectory' | 'project' | 'technologies';

interface DocumentMetadata {
    readonly section: MetadataSection;
    readonly source: string;
    readonly type?: string;
}

interface DocumentChunk {
    readonly content: string;
    readonly metadata: DocumentMetadata;
}

interface MilvusRecord {
    readonly vector: number[];
    readonly content: string;
    readonly metadata: DocumentMetadata;
}

interface EmbeddingConfig {
    readonly apiUrl: string;
    readonly apiKey: string;
}

interface HuggingFaceEmbeddingItem {
    embedding?: number[];
}

interface OpenAIEmbeddingResponse {
    data?: HuggingFaceEmbeddingItem[];
}

const resolveEmbeddingConfig = (): EmbeddingConfig => {
    const apiUrl = process.env.EMBEDDING_API_URL;
    const apiKey = process.env.EMBEDDING_API_KEY;

    if (!apiUrl || !apiKey) {
        throw new Error('EMBEDDING_API_URL and EMBEDDING_API_KEY are required');
    }

    return { apiUrl, apiKey };
};

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

const fetchEmbeddings = async (texts: string[], config: EmbeddingConfig): Promise<number[][]> => {
    const response = await fetch(config.apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({ inputs: texts }),
    });

    if (!response.ok) {
        const payload = await response.text();
        throw new Error(`Embedding request failed: ${response.status} ${payload}`);
    }

    const json: unknown = await response.json();
    const embeddings = normalizeEmbeddingResponse(json, texts.length);

    if (embeddings.length !== texts.length || embeddings.some((vec) => vec.length === 0)) {
        throw new Error('Embedding response has missing or empty vectors');
    }

    return embeddings;
};

const truncate = (text: string): string =>
    text.length > MAX_CONTENT_LENGTH ? text.slice(0, MAX_CONTENT_LENGTH - 3) + '...' : text;

const buildProfileChunks = (profile: PersonalProfile): DocumentChunk[] => {
    const summary = truncate(
        `${profile.fullName} es un ${profile.role} ubicado en ${profile.location}. ` +
        `Email: ${profile.email}. Teléfono: ${profile.phone}. ` +
        `Idiomas: ${profile.languages.map((l) => `${l.name} (${l.level})`).join(', ')}. ` +
        profile.bio,
    );

    return [
        {
            content: summary,
            metadata: { section: 'profile', source: 'personal_profile', type: 'summary' },
        },
    ];
};

const buildTrajectoryChunks = (trajectory: readonly TrajectoryEntry[]): DocumentChunk[] => {
    const chunks: DocumentChunk[] = [];

    for (const entry of trajectory) {
        const context = `${entry.institution} (${entry.period}) — ${entry.role}`;

        if (entry.description.length > 0) {
            for (const bullet of entry.description) {
                chunks.push({
                    content: truncate(`${context}: ${bullet}`),
                    metadata: {
                        section: 'trajectory',
                        source: entry.institution,
                        type: entry.type,
                    },
                });
            }
        }

        if (entry.skills.length > 0) {
            chunks.push({
                content: truncate(
                    `${context}. Tecnologías y habilidades aplicadas: ${entry.skills.join(', ')}.`,
                ),
                metadata: {
                    section: 'trajectory',
                    source: entry.institution,
                    type: 'skills',
                },
            });
        }
    }

    return chunks;
};

const buildProjectChunks = (projects: readonly Project[]): DocumentChunk[] =>
    projects.map((project) => ({
        content: truncate(
            `Proyecto: ${project.title}. Estado: ${project.status}. ` +
            `${project.description} ` +
            `Tecnologías: ${project.skills.join(', ')}.`,
        ),
        metadata: { section: 'project', source: project.title, type: project.status },
    }));

const buildTechnologyChunks = (
    categories: readonly TechnologyCategory[],
): DocumentChunk[] =>
    categories.map((category) => ({
        content: truncate(
            `Área de conocimiento: ${category.name}. ` +
            `Tecnologías dominadas: ${category.technologies.join(', ')}.`,
        ),
        metadata: { section: 'technologies', source: category.name },
    }));

const buildAllChunks = (): DocumentChunk[] => [
    ...buildProfileChunks(portfolioKnowledgeBase.profile),
    ...buildTrajectoryChunks(portfolioKnowledgeBase.trajectory),
    ...buildProjectChunks(portfolioKnowledgeBase.projects),
    ...buildTechnologyChunks(portfolioKnowledgeBase.technologyCategories),
];

const embedChunks = async (
    chunks: DocumentChunk[],
    config: EmbeddingConfig,
): Promise<MilvusRecord[]> => {
    const records: MilvusRecord[] = [];

    for (let i = 0; i < chunks.length; i += EMBEDDING_BATCH_SIZE) {
        const batch = chunks.slice(i, i + EMBEDDING_BATCH_SIZE);
        const texts = batch.map((chunk) => chunk.content);
        const embeddings = await fetchEmbeddings(texts, config);

        for (let j = 0; j < batch.length; j++) {
            const chunk = batch[j];
            const embedding = embeddings[j];

            if (chunk === undefined || embedding === undefined) {
                throw new Error(`Missing chunk or embedding at batch index ${j}`);
            }

            records.push({ vector: embedding, content: chunk.content, metadata: chunk.metadata });
        }
    }

    return records;
};

const insertRecords = async (
    client: MilvusClient,
    records: MilvusRecord[],
): Promise<void> => {
    for (let i = 0; i < records.length; i += INSERT_BATCH_SIZE) {
        const batch = records.slice(i, i + INSERT_BATCH_SIZE);
        await client.insert({
            collection_name: COLLECTION_NAME,
            data: batch as unknown as RowData[],
        });
    }
};

const main = async (): Promise<void> => {
    const config = resolveEmbeddingConfig();
    const chunks = buildAllChunks();

    const client = await getMilvusClient();
    const records = await embedChunks(chunks, config);
    await insertRecords(client, records);

    await client.flushSync({ collection_names: [COLLECTION_NAME] });
};

main().then(() => process.exit(0)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
