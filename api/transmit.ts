import type { VercelRequest, VercelResponse } from '@vercel/node';
import { processTransmission, TransmissionError } from '../server/transmitService';

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

  try {
    const result = await processTransmission(req.body, process.env);
    return res.status(200).json({
      success: true,
      aiFeedback: result.aiFeedback,
      priority: result.priority,
    });
  } catch (err) {
    console.error('Transmission processing failed:', err);
    if (err instanceof TransmissionError) {
      return res.status(err.status).json({ success: false, error: err.message });
    }
    return res.status(500).json({ success: false, error: 'Internal system error' });
  }
}
