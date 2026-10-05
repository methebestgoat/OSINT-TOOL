import { providers } from './providers/index.js';

export function normalizeQuery(type, raw) {
  const value = raw.trim();
  if (type === 'email') return value.toLowerCase();
  if (type === 'phone') return value.replace(/[\s().-]/g, '');
  return value.replace(/^@/, '');
}

export async function searchPublicSources(type, raw) {
  const query = normalizeQuery(type, raw);
  const list = providers[type] || [];
  const batches = await Promise.all(list.map((provider) => provider(query)));
  return { query, results: batches.flat() };
}
