import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import path from 'path';
import {defineConfig, loadEnv, type Plugin} from 'vite';
import { processTransmission, TransmissionError, type TransmissionPayload } from './server/transmitService';

const sendJson = (res: ServerResponse, statusCode: number, body: unknown) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
};

const readJsonBody = async (req: IncomingMessage) =>
  new Promise<TransmissionPayload>((resolve, reject) => {
    let rawBody = '';

    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });

    req.on('end', () => {
      try {
        resolve(JSON.parse(rawBody || '{}') as TransmissionPayload);
      } catch (error) {
        reject(error);
      }
    });

    req.on('error', reject);
  });

const localTransmitPlugin = (env: Record<string, string>): Plugin => ({
  name: 'local-transmit-endpoint',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if ((req.url?.split('?')[0] ?? '') !== '/api/transmit') {
        return next();
      }

      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        res.end();
        return;
      }

      if (req.method !== 'POST') {
        sendJson(res, 405, { success: false, error: 'Method not allowed' });
        return;
      }

      try {
        const body = await readJsonBody(req);
        const result = await processTransmission(body, env);
        sendJson(res, 200, {
          success: true,
          aiFeedback: result.aiFeedback,
          priority: result.priority,
        });
      } catch (error) {
        console.error('Local transmit handler failed:', error);
        if (error instanceof TransmissionError) {
          sendJson(res, error.status, { success: false, error: error.message });
          return;
        }
        if (error instanceof SyntaxError) {
          sendJson(res, 400, { success: false, error: 'Invalid JSON body' });
          return;
        }
        sendJson(res, 500, { success: false, error: 'Internal system error' });
      }
    });
  },
});

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react(), tailwindcss(), localTransmitPlugin(env)],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
