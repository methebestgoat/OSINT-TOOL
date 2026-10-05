import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import pino from 'pino';
import { z } from 'zod';
import { searchPublicSources } from './src/search.js';

const app = express();
const port = Number(process.env.PORT || 3000);
const logger = pino({ level: process.env.LOG_LEVEL || 'info' });
const allowedOrigin = process.env.ALLOWED_ORIGIN || `http://localhost:${port}`;

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: allowedOrigin }));
app.use(express.json({ limit: '16kb' }));
app.use(rateLimit({ windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000), max: Number(process.env.RATE_LIMIT_MAX || 60), standardHeaders: true, legacyHeaders: false, message: { error: 'Rate limit reached. Please wait before trying again.' } }));
app.use((req, res, next) => { const started = Date.now(); res.on('finish', () => logger.info({ method: req.method, path: req.path, status: res.statusCode, durationMs: Date.now() - started }, 'request')); next(); });

const searchSchema = z.object({
  type: z.enum(['username', 'email', 'phone']),
  query: z.string().trim().min(2).max(320)
});

function isValidQuery(type, query) {
  if (type === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(query);
  if (type === 'phone') return /^\+?[0-9]{7,15}$/.test(query.replace(/[\s().-]/g, ''));
  return /^[a-zA-Z0-9._-]{2,64}$/.test(query.replace(/^@/, ''));
}

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'osint-scope', mode: 'public-sources-only' }));
app.post('/api/search', async (req, res) => {
  const parsed = searchSchema.safeParse(req.body);
  if (!parsed.success || !isValidQuery(parsed.data.type, parsed.data.query)) return res.status(400).json({ error: 'Enter a valid username, email address, or phone number.' });
  try {
    const started = Date.now();
    const data = await searchPublicSources(parsed.data.type, parsed.data.query);
    logger.info({ type: parsed.data.type, resultCount: data.results.length, durationMs: Date.now() - started }, 'public-source search');
    res.json({ ...data, type: parsed.data.type, generatedAt: new Date().toISOString(), demoMode: true, safety: 'Only public URLs and documented provider placeholders are shown.' });
  } catch (error) {
    logger.error({ err: error }, 'search failed');
    res.status(500).json({ error: 'The search could not be completed. No private sources were accessed.' });
  }
});

app.use(express.static('public'));
app.use((req, res) => res.sendFile('index.html', { root: 'public' }));
app.listen(port, '0.0.0.0', () => logger.info({ port, allowedOrigin }, 'OSINT Scope listening'));
