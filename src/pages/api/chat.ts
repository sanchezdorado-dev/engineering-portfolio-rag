import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import type { APIRoute } from 'astro';
import { GROQ_API_KEY } from 'astro:env/server';
import { extractChunks, searchKnowledge } from '../../lib/ai/rag-service.ts';
import { buildSystemPrompt } from '../../lib/ai/system-prompt.ts';
import { checkRateLimit } from '../../lib/security/rate-limiter.ts';

const MODEL_ID = 'llama-3.3-70b-versatile';
const MAX_MESSAGE_LENGTH = 500;
const RAG_TIMEOUT_MS = 30_000;

interface ChatRequestBody {
    message: string;
}

const isChatRequestBody = (body: unknown): body is ChatRequestBody =>
    typeof body === 'object' &&
    body !== null &&
    'message' in body &&
    typeof (body as Record<string, unknown>)['message'] === 'string';

const resolveClientIp = (request: Request): string =>
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';

const errorResponse = (message: string, status: number): Response =>
    new Response(JSON.stringify({ error: message }), {
        status,
        headers: { 'Content-Type': 'application/json' },
    });

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
    const timeout = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error(`Timed out after ${ms}ms`)), ms),
    );
    return Promise.race([promise, timeout]);
};

export const POST: APIRoute = async ({ request }) => {
    const ip = resolveClientIp(request);
    const rateLimitResult = checkRateLimit(ip);

    if (!rateLimitResult.allowed) {
        return new Response(JSON.stringify({ error: 'Too many requests' }), {
            status: 429,
            headers: {
                'Content-Type': 'application/json',
                'Retry-After': String(rateLimitResult.retryAfter),
            },
        });
    }

    let body: unknown;
    try {
        body = await request.json();
    } catch {
        return errorResponse('Invalid JSON body', 400);
    }

    if (!isChatRequestBody(body)) {
        return errorResponse('Field "message" is required and must be a string', 400);
    }

    const message = body.message.trim();

    if (message.length === 0) {
        return errorResponse('Message cannot be empty', 400);
    }

    if (message.length > MAX_MESSAGE_LENGTH) {
        return errorResponse(`Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`, 400);
    }

    let ragResults;
    try {
        ragResults = await withTimeout(searchKnowledge(message), RAG_TIMEOUT_MS);
    } catch {
        return errorResponse('Knowledge retrieval failed', 503);
    }

    const groq = createGroq({ apiKey: GROQ_API_KEY });

    const result = streamText({
        model: groq(MODEL_ID),
        system: buildSystemPrompt(extractChunks(ragResults)),
        messages: [{ role: 'user', content: message }],
    });

    return result.toTextStreamResponse();
};
