import { useEffect, useRef, useState } from 'preact/hooks';
import { useChatMessages } from '../../hooks/useChatMessages';
import { CHAT_UI } from '../../lib/ui/chat-ui-constants';


function ChatBubbleIcon() {
    return (
        <svg
            class="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
            />
        </svg>
    );
}

function SendIcon() {
    return (
        <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
        >
            <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
            />
        </svg>
    );
}

function BotAvatar() {
    return (
        <div
            class="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm"
            aria-hidden="true"
        >
            <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
        </div>
    );
}

function TypingIndicator() {
    return (
        <span class="inline-flex items-center gap-0.5 ml-1.5" aria-label="Escribiendo">
            {[0, 150, 300].map((delay) => (
                <span
                    key={delay}
                    class="w-1 h-1 rounded-full bg-current opacity-60 animate-bounce"
                    style={{ animationDelay: `${delay}ms` }}
                />
            ))}
        </span>
    );
}

const sanitize = (text: string): string =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const renderMarkdown = (raw: string): string => {
    const escaped = sanitize(raw);

    const lines = escaped.split('\n');
    const result: string[] = [];
    let inList = false;

    for (const line of lines) {
        const trimmed = line.trim();

        if (trimmed === '') {
            if (inList) {
                result.push('</ul>');
                inList = false;
            }
            result.push('<br/>');
            continue;
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.+)$/);

        if (bulletMatch) {
            if (!inList) {
                result.push('<ul class="list-disc pl-4 my-1 space-y-0.5">');
                inList = true;
            }
            result.push(`<li>${applyInline(bulletMatch[1] ?? '')}</li>`);
            continue;
        }

        if (inList) {
            result.push('</ul>');
            inList = false;
        }

        const h2Match = trimmed.match(/^##\s+(.+)$/);
        if (h2Match) {
            result.push(`<p class="font-semibold mt-2 mb-0.5">${applyInline(h2Match[1] ?? '')}</p>`);
            continue;
        }

        const h3Match = trimmed.match(/^###\s+(.+)$/);
        if (h3Match) {
            result.push(`<p class="font-medium mt-1.5 mb-0.5">${applyInline(h3Match[1] ?? '')}</p>`);
            continue;
        }

        result.push(`<p class="mb-1">${applyInline(trimmed)}</p>`);
    }

    if (inList) result.push('</ul>');

    return result.join('');
};

const applyInline = (text: string): string =>
    text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');

export default function ChatWindow() {
    const { messages, input, isLoading, setInput, sendMessage } = useChatMessages();

    const [isOpen, setIsOpen] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (!isOpen) return;
        const timer = setTimeout(() => inputRef.current?.focus(), 120);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const adjustTextareaHeight = (el: HTMLTextAreaElement): void => {
        el.style.height = 'auto';
        el.style.height = `${Math.min(el.scrollHeight, CHAT_UI.INPUT.MAX_TEXTAREA_HEIGHT_PX)}px`;
    };

    const handleInput = (e: Event): void => {
        const el = e.target as HTMLTextAreaElement;
        setInput(el.value);
        adjustTextareaHeight(el);
    };

    const handleSend = (): void => {
        if (inputRef.current) inputRef.current.style.height = 'auto';
        sendMessage();
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const characterCount = input.length;
    const isOverLimit = characterCount > CHAT_UI.INPUT.MAX_LENGTH;

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen((prev) => !prev)}
                aria-label={isOpen ? 'Cerrar asistente' : 'Abrir asistente de portfolio'}
                aria-expanded={isOpen}
                aria-controls="chat-window"
                style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 60 }}
                class={[
                    'w-14 h-14 rounded-full',
                    'bg-gradient-to-br from-blue-500 to-blue-600',
                    'dark:from-blue-600 dark:to-blue-700',
                    'text-white',
                    'shadow-lg shadow-blue-500/30 dark:shadow-blue-700/40',
                    'hover:scale-105 hover:shadow-xl hover:shadow-blue-500/40',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
                    'transition-all duration-200',
                    'flex items-center justify-center',
                ].join(' ')}
            >
                {isOpen ? <CloseIcon /> : <ChatBubbleIcon />}
            </button>

            <div
                id="chat-window"
                role="dialog"
                aria-label="Asistente de portfolio de Santiago"
                aria-modal="false"
                aria-hidden={!isOpen}
                class={[
                    'flex flex-col',
                    'rounded-2xl',
                    'overflow-hidden',
                    'border border-gray-200 dark:border-gray-700/60',
                    'bg-white dark:bg-[#0f172a]',
                    'shadow-2xl shadow-black/10 dark:shadow-black/50',
                    'transition-all duration-300 ease-out origin-bottom-right',
                    isOpen
                        ? 'opacity-100 scale-100 pointer-events-auto'
                        : 'opacity-0 scale-95 pointer-events-none',
                ].join(' ')}
                style={{
                    position: 'fixed',
                    bottom: `${CHAT_UI.BUTTON.SIZE_PX + CHAT_UI.BUTTON.OFFSET_BOTTOM_PX + 12}px`,
                    right: `${CHAT_UI.BUTTON.OFFSET_RIGHT_PX}px`,
                    width: `min(${CHAT_UI.WINDOW.WIDTH_PX}px, calc(100vw - 3rem))`,
                    height: `min(${CHAT_UI.WINDOW.MAX_HEIGHT_PX}px, calc(100vh - ${CHAT_UI.BUTTON.SIZE_PX + CHAT_UI.BUTTON.OFFSET_BOTTOM_PX + 28}px))`,
                    zIndex: CHAT_UI.Z_INDEX,
                }}
            >
                <header class="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-700 dark:to-blue-800 px-4 py-3 flex items-center gap-3 flex-shrink-0">
                    <div
                        class="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0"
                        aria-hidden="true"
                    >
                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                        </svg>
                    </div>

                    <div class="flex-1 min-w-0">
                        <p class="text-xs font-semibold text-white leading-tight truncate">
                            AI Software Engineer
                        </p>
                        <p class="text-xs text-blue-200 truncate">
                            Llama 3 · Groq · Milvus
                        </p>
                    </div>

                    <span class="flex items-center gap-1.5 text-xs text-blue-200 flex-shrink-0" aria-label="Estado: en línea">
                        <span
                            class="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"
                            aria-hidden="true"
                        />
                        En línea
                    </span>
                </header>

                <div
                    class="flex-1 min-h-0 overflow-y-auto p-4 space-y-4 scroll-smooth"
                    aria-live="polite"
                    aria-relevant="additions"
                    aria-label="Historial de mensajes"
                >
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            class={`flex items-end gap-2 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                        >
                            {message.role === 'assistant' && <BotAvatar />}

                            <div
                                class={
                                    message.role === 'user'
                                        ? [
                                            'max-w-[80%]',
                                            'bg-gradient-to-br from-blue-500 to-blue-600',
                                            'dark:from-blue-600 dark:to-blue-700',
                                            'text-white',
                                            'shadow-sm shadow-blue-500/25 dark:shadow-blue-700/30',
                                            'px-4 py-2.5 rounded-2xl rounded-tr-sm',
                                            'text-xs leading-relaxed',
                                        ].join(' ')
                                        : [
                                            'max-w-[80%]',
                                            'bg-gray-100 dark:bg-gray-800/80',
                                            'text-gray-800 dark:text-gray-200',
                                            'border border-gray-200/80 dark:border-gray-700/50',
                                            'shadow-sm',
                                            'px-4 py-2.5 rounded-2xl rounded-tl-sm',
                                            'text-xs leading-relaxed',
                                        ].join(' ')
                                }
                            >
                                {message.role === 'assistant' ? (
                                    <div dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }} />
                                ) : (
                                    message.content
                                )}
                                {message.isStreaming && <TypingIndicator />}
                            </div>
                        </div>
                    ))}

                    <div ref={messagesEndRef} aria-hidden="true" />
                </div>

                <div class="p-3 border-t border-gray-200 dark:border-gray-700/60 bg-white dark:bg-[#0f172a] flex-shrink-0">
                    <div class="flex gap-2 items-end">
                        <textarea
                            ref={inputRef}
                            value={input}
                            onInput={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="Escribe tu pregunta..."
                            rows={1}
                            disabled={isLoading}
                            aria-label="Escribe tu pregunta"
                            aria-describedby="chat-char-count"
                            class={[
                                'flex-1',
                                'bg-gray-100 dark:bg-gray-800/80',
                                'text-gray-900 dark:text-gray-100',
                                'placeholder-gray-400 dark:placeholder-gray-500',
                                'rounded-xl px-3 py-2.5',
                                'text-xs leading-relaxed',
                                'outline-none',
                                'focus:ring-2',
                                isOverLimit
                                    ? 'focus:ring-red-500/40 border border-red-400/60'
                                    : 'focus:ring-blue-500/40 border border-transparent focus:border-blue-500/20',
                                'resize-none',
                                'transition-all duration-150',
                                'disabled:opacity-50 disabled:cursor-not-allowed',
                            ].join(' ')}
                            style={{ maxHeight: `${CHAT_UI.INPUT.MAX_TEXTAREA_HEIGHT_PX}px` }}
                        />

                        <button
                            type="button"
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading || isOverLimit}
                            aria-label="Enviar mensaje"
                            class={[
                                'w-9 h-9 rounded-xl flex-shrink-0',
                                'bg-gradient-to-br from-blue-500 to-blue-600',
                                'dark:from-blue-600 dark:to-blue-700',
                                'text-white',
                                'flex items-center justify-center',
                                'hover:scale-105 hover:shadow-md hover:shadow-blue-500/30',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400',
                                'transition-all duration-150',
                                'disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none',
                            ].join(' ')}
                        >
                            <SendIcon />
                        </button>
                    </div>

                    <div class="flex justify-end mt-1 gap-2 items-center">
                        {isOverLimit && (
                            <p
                                class="text-xs text-red-500 dark:text-red-400"
                                role="alert"
                                aria-live="assertive"
                            >
                                Máximo {CHAT_UI.INPUT.MAX_LENGTH} caracteres
                            </p>
                        )}
                        <p
                            id="chat-char-count"
                            class={`text-xs tabular-nums ${isOverLimit
                                ? 'text-red-500 dark:text-red-400 font-medium'
                                : 'text-gray-400 dark:text-gray-600'
                                }`}
                            aria-live="polite"
                        >
                            {characterCount}/{CHAT_UI.INPUT.MAX_LENGTH}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
