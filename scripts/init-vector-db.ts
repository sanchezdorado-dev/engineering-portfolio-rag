import type { FieldType, MilvusClient } from '@zilliz/milvus2-sdk-node';
import { DataType, IndexType, MetricType } from '@zilliz/milvus2-sdk-node';
import { getMilvusClient } from '../src/lib/ai/milvus-client.ts';

const COLLECTION_NAME = process.env.MILVUS_COLLECTION_NAME ?? 'portfolio_rag';

const COLLECTION_DESCRIPTION = 'RAG collection for Santiago Dorado portfolio chatbot';

const FIELDS: FieldType[] = [
    {
        name: 'id',
        data_type: DataType.Int64,
        is_primary_key: true,
        autoID: true,
    },
    {
        name: 'vector',
        data_type: DataType.FloatVector,
        dim: 768,
    },
    {
        name: 'content',
        data_type: DataType.VarChar,
        max_length: 2048,
    },
    {
        name: 'metadata',
        data_type: DataType.JSON,
    },
];

const INDEX_CONFIG = {
    collection_name: COLLECTION_NAME,
    field_name: 'vector',
    index_type: IndexType.HNSW,
    metric_type: MetricType.COSINE,
    params: { M: 16, efConstruction: 200 },
} as const;

const collectionExists = async (client: MilvusClient): Promise<boolean> => {
    const response = await client.hasCollection({ collection_name: COLLECTION_NAME });
    return response.value === true;
};

const dropCollection = async (client: MilvusClient): Promise<void> => {
    await client.dropCollection({ collection_name: COLLECTION_NAME });
};

const createCollection = async (client: MilvusClient): Promise<void> => {
    await client.createCollection({
        collection_name: COLLECTION_NAME,
        description: COLLECTION_DESCRIPTION,
        fields: FIELDS,
    });
};

const createIndex = async (client: MilvusClient): Promise<void> => {
    await client.createIndex(INDEX_CONFIG);
};

const loadCollection = async (client: MilvusClient): Promise<void> => {
    await client.loadCollection({ collection_name: COLLECTION_NAME });
};

const main = async (): Promise<void> => {
    const client = await getMilvusClient();

    if (await collectionExists(client)) {
        await dropCollection(client);
    }

    await createCollection(client);
    await createIndex(client);
    await loadCollection(client);
};

main().then(() => process.exit(0)).catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
