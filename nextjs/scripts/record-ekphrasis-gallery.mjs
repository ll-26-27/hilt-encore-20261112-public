// Replay the installation's own API route against prepared tile crops.
// node --env-file=/path/to/cv-installation/site/.env.local scripts/record-ekphrasis-gallery.mjs /path/to/cv-installation/site /path/to/input.json /path/to/output.json
// Input is an array of image metadata plus {request: {tiles: base64JPEG[], indices, cols, rows}}.
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
const [siteArg, input, output] = process.argv.slice(2);
if (!siteArg || !input || !output) throw new Error('Usage: record-ekphrasis-gallery.mjs <installation-site> <input.json> <output.json>');
const site = resolve(siteArg);
const require = createRequire(`${site}/package.json`);
const originalHelper = await readFile(`${site}/lib/claude.mjs`, 'utf8');
const moduleURL = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`;
const helper = originalHelper.replace('import "server-only";', '').replace('"@anthropic-ai/sdk"', JSON.stringify(pathToFileURL(require.resolve('@anthropic-ai/sdk')).href));
const originalRoute = await readFile(`${site}/app/api/ekphrasis/route.js`, 'utf8');
const route = originalRoute.replace('"../../../lib/claude.mjs"', JSON.stringify(moduleURL(helper)));
const { POST } = await import(moduleURL(route));
const inputs = JSON.parse(await readFile(input, 'utf8'));
const results = [];
for (const {request, ...metadata} of inputs) {
  console.log(`Describing ${metadata.id} (${request.tiles.length} tiles)…`);
  const response = await POST(new Request('http://localhost/api/ekphrasis', {method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(request)}));
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || `HTTP ${response.status}`);
  if (data.tiles.length !== request.indices.length || new Set(data.tiles.map(t => t.index)).size !== request.indices.length || data.tiles.some(t => !request.indices.includes(t.index) || typeof t.caption !== 'string' || typeof t.ekphrasis !== 'string')) throw new Error(`Incomplete tile response: ${metadata.id}`);
  data.tiles.sort((a,b) => a.index-b.index);
  results.push({...metadata, cols:request.cols, rows:request.rows, recordedAt:new Date().toISOString(), routeSHA256:createHash('sha256').update(originalRoute).digest('hex'), ...data});
  await writeFile(output, JSON.stringify(results, null, 2)+'\n');
  console.log(`${metadata.id}: saved ${data.tiles.length} tiles, ${data.model}, ${data.seconds.toFixed(1)} s.`);
}
