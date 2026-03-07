const CONFIG = {
    MAX_REQUESTS: 20,
    WINDOW_MS: 60_000,
} as const;

interface RateLimitEntry {
    readonly count: number;
    readonly resetAt: number;
}

type RateLimitResult =
    | { allowed: true }
    | { allowed: false; retryAfter: number };

const store = new Map<string, RateLimitEntry>();

const purgeExpired = (now: number): void => {
    for (const [ip, entry] of store) {
        if (now > entry.resetAt) store.delete(ip);
    }
};

export const checkRateLimit = (ip: string): RateLimitResult => {
    const now = Date.now();

    if (store.size > 1000) purgeExpired(now);

    const entry = store.get(ip);

    if (entry === undefined || now > entry.resetAt) {
        store.set(ip, { count: 1, resetAt: now + CONFIG.WINDOW_MS });
        return { allowed: true };
    }

    if (entry.count >= CONFIG.MAX_REQUESTS) {
        return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
    }

    store.set(ip, { count: entry.count + 1, resetAt: entry.resetAt });
    return { allowed: true };
};
