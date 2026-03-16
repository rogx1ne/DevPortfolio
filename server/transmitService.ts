import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

export interface TransmissionPayload {
  name: string;
  email: string;
  message: string;
}

export interface TransmissionResult {
  aiFeedback: string;
  priority: string;
}

export interface TransmissionEnv {
  GEMINI_API_KEY?: string;
  RESEND_API_KEY?: string;
  DESTINATION_EMAIL?: string;
}

export class TransmissionError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

const parseAiResponse = (rawText: string) => {
  const cleaned = rawText.replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(cleaned) as {
    summary?: string;
    priority?: string;
    acknowledgment?: string;
  };

  if (!parsed.summary || !parsed.priority || !parsed.acknowledgment) {
    throw new TransmissionError(502, 'AI response was incomplete');
  }

  return parsed;
};

const escapeHtml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const inferPriority = (message: string) => {
  const normalized = message.toLowerCase();

  if (/(urgent|asap|immediately|critical|production|down|security|breach|payment)/.test(normalized)) {
    return 'CRITICAL';
  }

  if (/(interview|job|hire|freelance|project|collaborate|proposal|client)/.test(normalized)) {
    return 'HIGH';
  }

  if (/(question|connect|feedback|portfolio|hello|hi)/.test(normalized)) {
    return 'MEDIUM';
  }

  return 'LOW';
};

const buildFallbackAnalysis = (name: string, message: string) => {
  const summary =
    message.length > 120
      ? `${message.slice(0, 117).trimEnd()}...`
      : message;

  const priority = inferPriority(message);

  return {
    summary,
    priority,
    acknowledgment: `Transmission received, ${name}. Space Command has logged your message and will respond soon.`,
  };
};

const analyzeTransmission = async (
  payload: { name: string; email: string; message: string },
  geminiApiKey?: string,
) => {
  const fallback = buildFallbackAnalysis(payload.name, payload.message);

  if (!geminiApiKey) {
    return fallback;
  }

  const genAI = new GoogleGenerativeAI(geminiApiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const prompt = `
    You are an AI Communications Officer on a futuristic space station.
    Analyze the following transmission from a civilian pilot named ${payload.name} (${payload.email}):

    "${payload.message}"

    Tasks:
    1. Summarize the intent of the message in 1 sentence.
    2. Categorize the priority: "LOW", "MEDIUM", "HIGH", or "CRITICAL".
    3. Draft a short, space-themed acknowledgment for the user.

    Respond in JSON format:
    {
      "summary": "...",
      "priority": "...",
      "acknowledgment": "..."
    }
  `;

  try {
    const result = await model.generateContent(prompt);
    return parseAiResponse(result.response.text());
  } catch (error) {
    console.error('Gemini processing failed, using fallback analysis:', error);
    return fallback;
  }
};

export async function processTransmission(
  payload: TransmissionPayload,
  env: TransmissionEnv,
): Promise<TransmissionResult> {
  const name = payload.name?.trim();
  const email = payload.email?.trim();
  const message = payload.message?.trim();

  if (!name || !email || !message) {
    throw new TransmissionError(400, 'Missing flight data');
  }

  if (!env.RESEND_API_KEY) {
    throw new TransmissionError(500, 'Server is missing RESEND_API_KEY');
  }

  if (!env.DESTINATION_EMAIL) {
    throw new TransmissionError(500, 'Server is missing DESTINATION_EMAIL');
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const aiResponse = await analyzeTransmission({ name, email, message }, env.GEMINI_API_KEY);

  const { error } = await resend.emails.send({
    from: 'Portfolio Station <onboarding@resend.dev>',
    to: [env.DESTINATION_EMAIL],
    subject: `[${aiResponse.priority}] NEW TRANSMISSION FROM ${name.toUpperCase()}`,
    html: `
      <div style="font-family: monospace; background: #0a0a0a; color: #4f46e5; padding: 20px; border: 2px solid #4f46e5;">
        <h2 style="color: #fff; border-bottom: 2px solid #4f46e5;">MISSION BRIEFING</h2>
        <p><strong>PILOT:</strong> ${name}</p>
        <p><strong>COMMS LINK:</strong> ${email}</p>
        <p><strong>PRIORITY:</strong> ${aiResponse.priority}</p>
        <p><strong>INTENT:</strong> ${escapeHtml(aiResponse.summary)}</p>
        <div style="background: #1a1a1a; padding: 15px; margin-top: 20px; color: #cbd5e1; border-left: 4px solid #4f46e5;">
          <strong>TRANSMISSION CONTENT:</strong><br/>
          ${escapeHtml(message)}
        </div>
        <p style="margin-top: 20px; font-size: 10px; color: #64748b;">AUTHENTICATED BY SPACE COMMAND AI</p>
      </div>
    `,
  });

  if (error) {
    console.error('Resend error:', error);
    throw new TransmissionError(502, 'Mail relay failure');
  }

  return {
    aiFeedback: aiResponse.acknowledgment,
    priority: aiResponse.priority,
  };
}
