const CHAT_ENDPOINT = '/api/chat';

export class ChatApiError extends Error {
    constructor(
        message: string,
        public readonly status?: number,
    ) {
        super(message);
        this.name = 'ChatApiError';
    }
}

export const streamChatMessage = async (
    message: string,
    onChunk: (chunk: string) => void,
): Promise<void> => {
    const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
    });

    if (!response.ok) {
        const payload = await response
            .json()
            .catch(() => ({ error: 'Error desconocido' }));
        throw new ChatApiError(
            (payload as { error?: string }).error ?? `HTTP ${response.status}`,
            response.status,
        );
    }

    const reader = response.body?.getReader();
    if (!reader) {
        throw new ChatApiError('No hay stream de respuesta disponible');
    }

    const decoder = new TextDecoder();
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            onChunk(decoder.decode(value, { stream: true }));
        }
    } finally {
        reader.releaseLock();
    }
};
