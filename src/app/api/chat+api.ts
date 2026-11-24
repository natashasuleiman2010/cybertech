import Anthropic from '@anthropic-ai/sdk';

import { getVerifiedClerkId } from '@/lib/server/auth';
import { isRateLimited } from '@/lib/server/rate-limit';

type IncomingMessage = {
  role: 'user' | 'assistant';
  text: string;
};

const SYSTEM_PROMPT = `You are a warm, supportive guide helping a young learner think through
whether something that happened to them might be bullying. Use simple,
age-appropriate language and a gentle, non-judgmental tone.

Ask these self-check questions one at a time, waiting for the learner's
answer before asking the next one:
1. Was it repeated?
2. Did it hurt or make you feel unsafe?
3. Was it public or witnessed by others?

Once the learner has answered all three, reply with exactly two parts and
nothing else: a short, plain-language summary of what they described, then
a new line that starts with "Next step:" followed by one clear suggestion,
such as talking to a trusted adult, teacher, parent, or school counselor.
Never state or imply that this is a diagnosis or a legal judgment - it is
only a starting point for getting support. Never minimize, blame, or judge
the learner. Only use the "Next step:" line once you are giving this final
summary, never earlier in the conversation.

Safety override: if at any point the learner mentions self-harm, suicide,
abuse, or being in immediate danger, stop the self-check immediately.
Respond with warmth, tell them to talk to a trusted adult right now, and
share this resource: Childline Kenya - call or text 116 (free, 24/7). Do not
resume the self-check after this.`;

const FALLBACK_ERROR = { error: "Something went wrong. Please try again." };

export async function POST(request: Request) {
  const clerkId = await getVerifiedClerkId(request);
  if (!clerkId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  if (isRateLimited(clerkId)) {
    return Response.json({ error: 'Too many requests. Please slow down.' }, { status: 429 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(FALLBACK_ERROR, { status: 503 });
  }

  let messages: IncomingMessage[];
  try {
    const body = await request.json();
    if (!Array.isArray(body?.messages)) throw new Error('invalid body');
    messages = body.messages;
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }

  try {
    const client = new Anthropic({ apiKey });
    const response = await client.messages.create({
      model: 'claude-opus-5-5',
      max_tokens: 1024,
      output_config: { effort: 'low' },
      system: SYSTEM_PROMPT,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.text,
      })),
    });

    const textBlock = response.content.find((block) => block.type === 'text');
    return Response.json({ reply: textBlock?.text ?? '' });
  } catch {
    return Response.json(FALLBACK_ERROR, { status: 503 });
  }
}
