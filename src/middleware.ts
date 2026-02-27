import { defineMiddleware } from "astro:middleware";

const generateNonce = (): string => {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    return btoa(String.fromCharCode(...bytes));
};

const buildCspPolicy = (nonce: string, isProd: boolean): string => {

    const directives: Record<string, string> = {
        "default-src": "'self'",
        "img-src": "'self' data: https:",
        "font-src": "'self' data:",
        "base-uri": "'self'",
        "form-action": "'self'",
    };

    if (isProd) {
        directives["script-src"] = `'self' 'nonce-${nonce}'`;
        directives["style-src"] = `'self' 'nonce-${nonce}'`;
        directives["connect-src"] = "'self' https://api.groq.com";
    } else {
        directives["script-src"] = "'self' 'unsafe-inline' 'unsafe-eval'";
        directives["style-src"] = "'self' 'unsafe-inline'";
        directives["connect-src"] = "'self' https://api.groq.com ws: wss:";
    }

    return Object.entries(directives)
        .map(([key, value]) => `${key} ${value}`)
        .join("; ");
};

export const onRequest = defineMiddleware(async (context, next) => {
    const nonce = generateNonce();
    const isProd = import.meta.env.PROD;

    context.locals.cspNonce = nonce;
    context.locals.isProd = isProd;

    const response = await next();

    if (response.headers.get("content-type")?.includes("text/html")) {
        const securityHeaders: Record<string, string> = {
            "Content-Security-Policy": buildCspPolicy(nonce, isProd),
            "X-Frame-Options": "DENY",
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload"
        };

        Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
        });
    }

    return response;
});