import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Resend } from 'resend';

// Initialize APIs
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const resend = new Resend(process.env.RESEND_API_KEY || '');

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Add basic CORS if needed for local development outside vercel dev
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Missing flight data' });
  }

  try {
    // 1. AI Analysis using Gemini
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `
      You are an AI Communications Officer on a futuristic space station. 
      Analyze the following transmission from a civilian pilot named ${name} (${email}):
      
      "${message}"
      
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

    const result = await model.generateContent(prompt);
    const aiResponse = JSON.parse(result.response.text().replace(/```json|```/g, ''));

    // 2. Send Email via Resend
    const { data, error } = await resend.emails.send({
      from: 'Portfolio Station <onboarding@resend.dev>',
      to: [process.env.DESTINATION_EMAIL || ''],
      subject: `[${aiResponse.priority}] NEW TRANSMISSION FROM ${name.toUpperCase()}`,
      html: `
        <div style="font-family: monospace; background: #0a0a0a; color: #4f46e5; padding: 20px; border: 2px solid #4f46e5;">
          <h2 style="color: #fff; border-bottom: 2px solid #4f46e5;">MISSION BRIEFING</h2>
          <p><strong>PILOT:</strong> ${name}</p>
          <p><strong>COMMS LINK:</strong> ${email}</p>
          <p><strong>PRIORITY:</strong> ${aiResponse.priority}</p>
          <p><strong>INTENT:</strong> ${aiResponse.summary}</p>
          <div style="background: #1a1a1a; padding: 15px; margin-top: 20/px; color: #cbd5e1; border-left: 4px solid #4f46e5;">
            <strong>TRANSMISSION CONTENT:</strong><br/>
            ${message}
          </div>
          <p style="margin-top: 20px; font-size: 10px; color: #64748b;">AUTHENTICATED BY SPACE COMMAND AI</p>
        </div>
      `,
    });

    if (error) {
      console.error('Resend Error:', error);
      return res.status(500).json({ success: false, error: 'Mail relay failure' });
    }

    // 3. Success Response with AI feedback
    return res.status(200).json({ 
      success: true, 
      aiFeedback: aiResponse.acknowledgment,
      priority: aiResponse.priority 
    });

  } catch (err) {
    console.error('Transmission processing failed:', err);
    return res.status(500).json({ success: false, error: 'Internal system error' });
  }
}
