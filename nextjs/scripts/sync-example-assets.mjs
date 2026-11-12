import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
const app = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const repo = path.dirname(app);
const cases = path.join(repo, "workshop-folder/02-further-use-cases");
const assets = path.join(app, "public/example-assets");
const sims = ["index.html", "onion-caramelization-sim.html", "basil-sphere-sim.html", "coffee-sim.html", "tahini-seizing-sim.html"];
await mkdir(path.join(assets, "phet"), { recursive: true });
for (const file of sims) await copyFile(path.join(cases, "physics-interactives/outputs/sims", file), path.join(assets, "phet", file));
const reading = path.join(cases, "manuscript-transcription/german-project/01-use-cases/transcription/04-reading-room");
await mkdir(path.join(assets, "reading-room/outputs"), { recursive: true });
await mkdir(path.join(assets, "reading-room/inputs/pages"), { recursive: true });
const html = await readFile(path.join(reading, "outputs/index.html"), "utf8");
const data = JSON.parse(html.match(/<script[^>]*id="reading-data"[^>]*>([\s\S]*?)<\/script>/)?.[1] ?? "null");
if (!data?.pages?.length) throw new Error("Reading room data is missing");
for (const page of data.pages) {
  const name = path.basename(page.image);
  if (page.image !== `../inputs/pages/${name}`) throw new Error(`Unexpected image path: ${page.image}`);
  await copyFile(path.join(reading, "inputs/pages", name), path.join(assets, "reading-room/inputs/pages", name));
}
// Adapt navigation for this standalone example; canonical research artifacts stay untouched.
let embedded = html.replace(/(window\.REVIEW_CONFIG=)(\{[^;]+\})/, (_, prefix, json) => prefix + JSON.stringify({ ...JSON.parse(json), home: "/examples/german-reading-room" }));
embedded = embedded.replace("if (config.kind === 'reading') topLinks.append(link('Consensus pages', '../../03-layout-and-hybrid/outputs/consensus-print/index.html'));", "// The broader consensus explorer is not bundled in this standalone example.");
await writeFile(path.join(assets, "reading-room/outputs/index.html"), embedded);
console.log(`Prepared ${sims.length} simulation pages and reading room with ${data.pages.length} scans.`);
