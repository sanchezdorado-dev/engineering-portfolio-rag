import { MilvusClient } from '@zilliz/milvus2-sdk-node';

const CONFIG = {
    CONNECTION_TIMEOUT: 10000,
    IDLE_TIMEOUT: 30000,
    MAX_RETRIES: 3,
    RETRY_DELAY_BASE: 1000,
} as const;

interface ConnectionState {
    client: MilvusClient | null;
    lastUsed: number;
    isHealthy: boolean;
    cleanupTimer: ReturnType<typeof setTimeout> | null;
}

const state: ConnectionState = {
    client: null,
    lastUsed: 0,
    isHealthy: false,
    cleanupTimer: null,
};

const resolveConfig = (): { address: string; token?: string } => {
    const address = process.env.MILVUS_URL;
    const token = process.env.MILVUS_TOKEN;

    if (!address) throw new Error('MILVUS_URL is required');

    return token !== undefined ? { address, token } : { address };
};

const healthCheck = async (client: MilvusClient): Promise<boolean> => {
    try {
        await client.checkHealth();
        return true;
    } catch {
        return false;
    }
};

const withRetry = async <T>(fn: () => Promise<T>, attempts: number = CONFIG.MAX_RETRIES): Promise<T> => {
    try {
        return await fn();
    } catch (error) {
        if (attempts <= 1) throw error;
        const delay = CONFIG.RETRY_DELAY_BASE * (CONFIG.MAX_RETRIES - attempts + 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
        return withRetry(fn, attempts - 1);
    }
};

const scheduleCleanup = (): void => {
    if (state.cleanupTimer !== null) clearTimeout(state.cleanupTimer);

    state.cleanupTimer = setTimeout(() => {
        state.client = null;
        state.isHealthy = false;
        state.lastUsed = 0;
        state.cleanupTimer = null;
    }, CONFIG.IDLE_TIMEOUT);
};

export const getMilvusClient = async (): Promise<MilvusClient> => {
    if (state.client !== null && state.isHealthy && Date.now() - state.lastUsed < CONFIG.IDLE_TIMEOUT) {
        state.lastUsed = Date.now();
        scheduleCleanup();
        return state.client;
    }

    const config = resolveConfig();

    const client = await withRetry(async () => {
        const instance = new MilvusClient({ ...config, timeout: CONFIG.CONNECTION_TIMEOUT });
        if (!(await healthCheck(instance))) throw new Error('Milvus health check failed');
        return instance;
    });

    state.client = client;
    state.isHealthy = true;
    state.lastUsed = Date.now();
    scheduleCleanup();

    return client;
};

export const closeMilvusConnection = (): void => {
    state.client = null;
    state.isHealthy = false;
    state.lastUsed = 0;
    if (state.cleanupTimer !== null) {
        clearTimeout(state.cleanupTimer);
        state.cleanupTimer = null;
    }
};
