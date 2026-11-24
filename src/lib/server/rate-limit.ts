const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 10;

// In-memory sliding window, keyed by Clerk user ID. Resets on server restart,
// which is fine for basic per-user abuse protection at this scale.
const requestTimestamps = new Map<string, number[]>();

export function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (requestTimestamps.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    requestTimestamps.set(key, recent);
    return true;
  }

  recent.push(now);
  requestTimestamps.set(key, recent);
  return false;
}
