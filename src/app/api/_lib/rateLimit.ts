// Minimal in-memory fixed-window rate limiter.
//
// Caveat: this only works as a real guard when the app runs as a single, long-lived
// Node process (e.g. `next start` on one server) — it resets on restart and gives no
// protection when scaled across multiple instances/processes. That's an acceptable
// stopgap here (there's currently zero throttling on auth-sensitive routes), but a
// production deployment behind more than one instance needs a shared store (e.g. Redis)
// instead.

const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
    const now = Date.now();
    const entry = hits.get(key);

    if (!entry || entry.resetAt < now) {
        hits.set(key, { count: 1, resetAt: now + windowMs });
        return true;
    }

    if (entry.count >= limit) return false;

    entry.count++;
    return true;
}

export function clientKey(req: Request): string {
    const fwd = req.headers.get("x-forwarded-for");
    return (fwd ? fwd.split(",")[0].trim() : null) || "unknown";
}
