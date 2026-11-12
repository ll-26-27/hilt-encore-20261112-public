// env.mjs: find a key in the environment, falling back to the repo's .env file.
//
// `node --env-file=.env script.mjs` fills process.env before the script runs.
// Without it, we read <repo root>/.env ourselves, so `node script.mjs` also works.

import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const REPO_ENV = fileURLToPath(new URL('../../.env', import.meta.url))

export function env(name) {
  if (!process.env[name] && existsSync(REPO_ENV)) process.loadEnvFile(REPO_ENV)
  return process.env[name]
}

// What a dry run shows instead of the key: never any of its characters.
export function mask(key) {
  return key ? `[hidden, ${key.length} characters]` : '[NOT SET]'
}

export function fail(script, message) {
  console.error(`${script}: ${message}`)
  process.exit(1)
}
