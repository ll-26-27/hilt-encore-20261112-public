// gateways.mjs: HUIT's three AI API gateways, and how each expects its key.
// Base URLs and headers are from HUIT's documentation (see _context/huit/).

import { env } from './env.mjs'

export const GATEWAYS = {
  openai: {
    label: 'OpenAI Direct (v2)',
    keyEnv: 'HUIT_OPENAI_API_KEY',
    baseEnv: 'HUIT_OPENAI_BASE_URL',
    base: 'https://apis.huit.harvard.edu/ais-openai-direct/v2',
    header: 'api-key',
  },
  gemini: {
    label: 'Google Gemini',
    keyEnv: 'HUIT_GEMINI_API_KEY',
    baseEnv: 'HUIT_GEMINI_BASE_URL',
    base: 'https://apis.huit.harvard.edu/ais-google-gemini',
    header: 'api-key',
  },
  bedrock: {
    label: 'Amazon Bedrock',
    keyEnv: 'HUIT_BEDROCK_API_KEY',
    baseEnv: 'HUIT_BEDROCK_BASE_URL',
    base: 'https://apis.huit.harvard.edu/ais-bedrock-llm',
    header: 'x-api-key', // Bedrock's gateway uses x-api-key; the other two use api-key
  },
}

// The gateway's settings with this person's key and base URL filled in.
export function gateway(name) {
  const g = GATEWAYS[name]
  if (!g) throw new Error(`unknown gateway "${name}" (use ${Object.keys(GATEWAYS).join(', ')})`)
  return { name, ...g, key: env(g.keyEnv), base: (env(g.baseEnv) || g.base).replace(/\/+$/, '') }
}
