import { useState } from 'preact/hooks';
import { streamChatMessage } from '../lib/ai/chat-stream-client';
import { CHAT_UI } from '../lib/ui/chat-ui-constants';

export interface Message {
    readonly id: string;
    readonly role: 'user' | 'assistant';
    content: string;
    isStreaming?: boolean;
}

export interface UseChatMessagesReturn {
    messages: Message[];
    input: string;
    isLoading: boolean;
    setInput: (value: string) => void;
    sendMessage: () => Promise<void>;
}

const generateId = (): string =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const INITIAL_MESSAGE: Message = {
    id: 'init',
    role: 'assistant',
    content:
        '¡Hola! Soy el agente de conocimiento de Santiago. He sido indexado con toda la información sobre su perfil como Software Engineer. ¿Qué te gustaría descubrir hoy?',
};

const trimHistory = (messages: Message[]): Message[] =>
    messages.length >= CHAT_UI.MESSAGES.MAX_VISIBLE
        ? messages.slice(messages.length - CHAT_UI.MESSAGES.MAX_VISIBLE + 2)
        : messages;

export const useChatMessages = (): UseChatMessagesReturn => {
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const appendStreamChunk = (botId: string, chunk: string): void => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === botId ? { ...m, content: m.content + chunk } : m,
            ),
        );
    };

    const finalizeMessage = (botId: string): void => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === botId ? { ...m, isStreaming: false } : m,
            ),
        );
    };

    const markMessageAsError = (botId: string, errorText: string): void => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === botId
                    ? { ...m, content: `Lo siento, ocurrió un error: ${errorText}`, isStreaming: false }
                    : m,
            ),
        );
    };

    const sendMessage = async (): Promise<void> => {
        const trimmed = input.trim();

        if (!trimmed || isLoading || trimmed.length > CHAT_UI.INPUT.MAX_LENGTH) return;

        const userMessage: Message = {
            id: generateId(),
            role: 'user',
            content: trimmed,
        };
        const botId = generateId();

        setMessages((prev) => [
            ...trimHistory(prev),
            userMessage,
            { id: botId, role: 'assistant', content: '', isStreaming: true },
        ]);

        setInput('');
        setIsLoading(true);

        try {
            await streamChatMessage(trimmed, (chunk) => appendStreamChunk(botId, chunk));
        } catch (error) {
            const msg = error instanceof Error ? error.message : 'Error de conexión';
            markMessageAsError(botId, msg);
        } finally {
            finalizeMessage(botId);
            setIsLoading(false);
        }
    };

    return { messages, input, isLoading, setInput, sendMessage };
};
