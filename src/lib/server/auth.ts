import { verifyToken } from '@clerk/backend';

// Returns the verified Clerk user ID (the token's `sub` claim), or null if
// the request has no valid session token. Never trust a client-supplied ID.
export async function getVerifiedClerkId(request: Request): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : null;
  if (!token) return null;

  const secretKey = process.env.CLERK_SECRET_KEY;
  if (!secretKey) return null;

  try {
    const payload = await verifyToken(token, { secretKey });
    return payload.sub;
  } catch {
    return null;
  }
}
