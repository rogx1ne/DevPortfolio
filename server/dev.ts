import 'dotenv/config';
import express from 'express';
import { processTransmission, TransmissionError } from './transmitService';

const app = express();
const port = Number(process.env.PORT || 3001);

app.use(express.json());
app.use((_, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.options('/api/transmit', (_, res) => {
  res.sendStatus(200);
});

app.post('/api/transmit', async (req, res) => {
  try {
    const result = await processTransmission(req.body, process.env);
    res.status(200).json({
      success: true,
      aiFeedback: result.aiFeedback,
      priority: result.priority,
    });
  } catch (error) {
    console.error('Standalone transmit handler failed:', error);
    if (error instanceof TransmissionError) {
      res.status(error.status).json({ success: false, error: error.message });
      return;
    }
    res.status(500).json({ success: false, error: 'Internal system error' });
  }
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Transmit API listening on http://0.0.0.0:${port}`);
});
