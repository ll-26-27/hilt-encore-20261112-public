import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { voices } from "./voices";

// The interview script, written by CX in content/examples/simulated-interview-script.md and read on every request, so an
// edit shows on reload. Frontmatter: speakers [{id, name, role}], duration (seconds). Body lines: **<id>** [mm:ss] text.
// Lines from `producer-ai` are the AI producer's pre-written notes, not speech.
export type Speaker = { id: string; name: string; role: string };
export type Line = { id: string; start: number; text: string; voice?: { src: string; duration: number } };
export type Script = { title: string; speakers: Speaker[]; producer: Speaker; duration: number; lines: Line[]; notes: Line[]; placeholder: boolean };

export const PRODUCER = "producer-ai";

// Must match hashLine() in _tools/make-assets.mjs.
export function hashLine(id: string, text: string) {
  let h = 0x811c9dc5;
  const s = `${id}|${text}`;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(36);
}

const PLACEHOLDER = `---
speakers:
  - { id: ari, name: Ari, role: host (invented) }
  - { id: jo, name: Jo, role: guest (invented) }
  - { id: producer-ai, name: AI producer, role: suggests only when asked }
duration: 30
---
**ari** [00:00] The script for this example hasn't been written yet.
**jo** [00:05] So this is a placeholder, four lines long.
**producer-ai** [00:10] When the script lands, my notes will cite files in the folder (see README.md).
**ari** [00:15] Reload the page once it's there.
`;

export async function loadScript(): Promise<Script> {
  let raw = PLACEHOLDER;
  let placeholder = true;
  try {
    raw = await readFile(path.join(/* turbopackIgnore: true */ process.cwd(), "..", "content", "examples", "simulated-interview-script.md"), "utf8");
    placeholder = false;
  } catch {}
  let parsed: { data: Record<string, unknown>; content: string };
  try {
    parsed = matter(raw);
  } catch {
    parsed = matter(PLACEHOLDER);
    placeholder = true;
  }
  const { data, content } = parsed;
  const all: Speaker[] = Array.isArray(data.speakers)
    ? (data.speakers as Array<Record<string, unknown>>).map((s) => ({ id: String(s.id ?? ""), name: String(s.name ?? s.id ?? ""), role: String(s.role ?? "") })).filter((s) => s.id)
    : [];
  const lines: Line[] = [];
  for (const rawLine of content.split("\n")) {
    const m = rawLine.trim().match(/^\*\*([\w-]+)\*\*\s*\[(\d+):(\d{2})\]\s*(.+)$/);
    if (!m) continue;
    const id = m[1];
    const text = m[4].trim();
    const voice = id === PRODUCER ? undefined : voices[hashLine(id, text)];
    lines.push({ id, start: Number(m[2]) * 60 + Number(m[3]), text, ...(voice ? { voice } : {}) });
  }
  lines.sort((a, b) => a.start - b.start);
  // Anyone who speaks but isn't in the frontmatter still gets a channel.
  for (const l of lines) if (!all.some((s) => s.id === l.id)) all.push({ id: l.id, name: l.id, role: "" });
  const last = lines.at(-1);
  const duration = Number(data.duration) || (last ? last.start + 12 : 30);
  return {
    title: typeof data.title === "string" ? data.title : "",
    speakers: all.filter((s) => s.id !== PRODUCER),
    producer: all.find((s) => s.id === PRODUCER) ?? { id: PRODUCER, name: "AI producer", role: "" },
    duration,
    lines: lines.filter((l) => l.id !== PRODUCER),
    notes: lines.filter((l) => l.id === PRODUCER),
    placeholder,
  };
}
