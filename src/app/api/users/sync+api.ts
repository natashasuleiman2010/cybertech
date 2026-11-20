import { getVerifiedClerkId } from '@/lib/server/auth';
import { prisma } from '@/lib/server/prisma';

export async function POST(request: Request) {
  const clerkId = await getVerifiedClerkId(request);
  if (!clerkId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: { clerkId },
  });

  return Response.json({ id: user.id });
}
