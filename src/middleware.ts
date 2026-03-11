import { defineMiddleware } from "astro:middleware";

const buildCspPolicy = (isProd: boolean): string => {

    const directives: Record<string, string> = {
        "default-src": "'self'",
        "img-src": "'self' data: https:",
        "font-src": "'self' data:",
        "base-uri": "'self'",
        "form-action": "'self'",
        "style-src": "'self' 'unsafe-inline'",
        "script-src": "'self' 'unsafe-inline'",
    };

    if (isProd) {
        directives["connect-src"] = "'self' https://api.groq.com";
    } else {
        directives["script-src"] += " 'unsafe-eval'";
        directives["connect-src"] = "'self' https://api.groq.com ws: wss:";
    }

    return Object.entries(directives)
        .map(([key, value]) => `${key} ${value}`)
        .join("; ");
};

export const onRequest = defineMiddleware(async (_context, next) => {
    const response = await next();

    if (response.headers.get("content-type")?.includes("text/html")) {
        const securityHeaders: Record<string, string> = {
            "Content-Security-Policy": buildCspPolicy(import.meta.env.PROD),
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