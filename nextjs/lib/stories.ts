import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// The story cards: Marlon's planning board for the talk, one micro-story per card. Like the made slide, the code is
// public and the data stays private: the cards are Markdown files in the private repo's _context/plan/stories/, named
// by STORIES_DIR in the gitignored nextjs/.env.local. With it unset (deployed, or any other machine), /stories is empty.
//   <slug>.md     frontmatter: title, part (0-5 or unplaced), kind, who, minutes, show (show / say), status; body 2-4 lines
//   order.json    { "columns": { "0": [slug, ...], ..., "5": [...], "unplaced": [...] } }
const appRoot = /* turbopackIgnore: true */ process.cwd();

export const COLUMNS = ["0", "1", "2", "3", "4", "5", "unplaced"] as const;
export type Column = (typeof COLUMNS)[number];
export const KINDS = ["story", "set piece", "demo", "moment", "takeaway", "question"] as const;

export type Card = { id: string; title: string; part: Column; kind: string; who: string; minutes: number; show: string; status: string; body: string };
export type Board = { enabled: boolean; cards: Card[]; columns: Record<Column, string[]> };

async function envValue(name: string) {
  if (process.env[name]?.trim()) return process.env[name]!.trim();
  try {
    const text = await readFile(/* turbopackIgnore: true */ path.join(appRoot, ".env.local"), "utf8");
    return text.match(new RegExp(`^\\s*${name}\\s*=\\s*(.*?)\\s*$`, "m"))?.[1]?.replace(/^(['"])(.*)\1$/, "$2") ?? "";
  } catch {
    return "";
  }
}

export async function storiesDir() {
  return envValue("STORIES_DIR");
}

const ID = /^[a-z0-9][a-z0-9-]*$/;
const str = (v: unknown) => (typeof v === "string" ? v.trim() : typeof v === "number" ? String(v) : "");

function toColumn(value: unknown): Column {
  const s = str(value).toLowerCase();
  return (COLUMNS as readonly string[]).includes(s) ? (s as Column) : "unplaced";
}

function emptyColumns(): Record<Column, string[]> {
  return Object.fromEntries(COLUMNS.map((c) => [c, []])) as unknown as Record<Column, string[]>;
}

export async function getBoard(): Promise<Board> {
  const dir = await storiesDir();
  if (!dir) return { enabled: false, cards: [], columns: emptyColumns() };
  let names: string[] = [];
  try {
    names = (await readdir(/* turbopackIgnore: true */ dir)).filter((n) => n.endsWith(".md") && !/^readme\.md$/i.test(n) && ID.test(n.slice(0, -3)));
  } catch {
    return { enabled: true, cards: [], columns: emptyColumns() };
  }
  const cards: Card[] = await Promise.all(
    names.map(async (name) => {
      const raw = await readFile(/* turbopackIgnore: true */ path.join(dir, name), "utf8");
      let data: Record<string, unknown> = {};
      let content = raw;
      try {
        ({ data, content } = matter(raw));
      } catch {}
      return {
        id: name.slice(0, -3),
        title: str(data.title) || name.slice(0, -3),
        part: toColumn(data.part),
        kind: str(data.kind) || "story",
        who: str(data.who),
        minutes: Number(data.minutes) || 0,
        show: str(data.show),
        status: str(data.status),
        body: content.trim(),
      };
    }),
  );

  // order.json gives the sequence; a card it doesn't list goes at the end of its own part's column.
  let saved: Partial<Record<Column, string[]>> = {};
  try {
    saved = JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(dir, "order.json"), "utf8")).columns ?? {};
  } catch {}
  const byId = new Map(cards.map((c) => [c.id, c]));
  const columns = emptyColumns();
  const placed = new Set<string>();
  for (const col of COLUMNS) {
    for (const id of saved[col] ?? []) {
      if (byId.has(id) && !placed.has(id)) {
        columns[col].push(id);
        placed.add(id);
      }
    }
  }
  for (const card of [...cards].sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }))) {
    if (!placed.has(card.id)) columns[card.part].push(card.id);
  }
  // The column a card sits in is its part.
  for (const col of COLUMNS) for (const id of columns[col]) byId.get(id)!.part = col;
  return { enabled: true, cards, columns };
}

// Write the order and each moved card's part back to the private folder. Only the `part:` line of a card's frontmatter
// is rewritten, so the rest of the file stays exactly as written.
export async function saveBoard(columns: Record<string, unknown>) {
  const dir = await storiesDir();
  if (!dir) throw new Error("STORIES_DIR is not set");
  const board = await getBoard();
  const known = new Set(board.cards.map((c) => c.id));
  const clean = emptyColumns();
  const seen = new Set<string>();
  for (const col of COLUMNS) {
    const ids = Array.isArray(columns[col]) ? (columns[col] as unknown[]) : [];
    for (const id of ids) {
      if (typeof id === "string" && known.has(id) && !seen.has(id)) {
        clean[col].push(id);
        seen.add(id);
      }
    }
  }
  // Cards the request left out keep their place, so a stale page can't drop one.
  for (const col of COLUMNS) for (const id of board.columns[col]) if (!seen.has(id)) clean[col].push(id);

  const current = new Map(board.cards.map((c) => [c.id, c.part]));
  for (const col of COLUMNS) {
    for (const id of clean[col]) {
      if (current.get(id) === col) continue;
      const file = path.join(dir, `${id}.md`);
      const raw = await readFile(/* turbopackIgnore: true */ file, "utf8");
      const fm = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
      if (!fm) continue;
      const value = col === "unplaced" ? "unplaced" : col;
      const block = /^part:.*$/m.test(fm[1]) ? fm[1].replace(/^part:.*$/m, `part: ${value}`) : `${fm[1]}\npart: ${value}`;
      await writeFile(/* turbopackIgnore: true */ file, raw.replace(fm[1], block));
    }
  }
  await writeFile(/* turbopackIgnore: true */ path.join(dir, "order.json"), JSON.stringify({ columns: clean }, null, 2) + "\n");
  return getBoard();
}

// The board is Marlon's planning on his own laptop: cards are served and saved only for a request to localhost, and
// never on Vercel.
export function isLocalHost(host: string | null) {
  const name = (host ?? "").replace(/:\d+$/, "");
  return !process.env.VERCEL && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(name);
}

// The network view (/stories/network): the same cards as nodes, with positions and labelled links between them, kept
// in network.json beside the cards: { "positions": { id: { x, y } }, "links": [{ id, source, target, label }] }.
export type Link = { id: string; source: string; target: string; label: string };
export type Network = { positions: Record<string, { x: number; y: number }>; links: Link[] };

function cleanNetwork(input: unknown, known: Set<string>): Network {
  const raw = (input ?? {}) as { positions?: Record<string, unknown>; links?: unknown[] };
  const positions: Network["positions"] = {};
  for (const [id, p] of Object.entries(raw.positions ?? {})) {
    const { x, y } = (p ?? {}) as { x?: unknown; y?: unknown };
    if (known.has(id) && Number.isFinite(x) && Number.isFinite(y)) positions[id] = { x: Math.round(x as number), y: Math.round(y as number) };
  }
  const links: Link[] = [];
  const seen = new Set<string>();
  for (const l of raw.links ?? []) {
    const { source, target, label } = (l ?? {}) as Partial<Link>;
    if (typeof source !== "string" || typeof target !== "string" || !known.has(source) || !known.has(target) || source === target) continue;
    const id = `${source}->${target}`;
    if (seen.has(id)) continue;
    seen.add(id);
    links.push({ id, source, target, label: typeof label === "string" ? label.slice(0, 60).trim() : "" });
  }
  return { positions, links };
}

export async function getNetwork(): Promise<Network> {
  const dir = await storiesDir();
  const board = await getBoard();
  const known = new Set(board.cards.map((c) => c.id));
  try {
    return cleanNetwork(JSON.parse(await readFile(/* turbopackIgnore: true */ path.join(dir, "network.json"), "utf8")), known);
  } catch {
    return { positions: {}, links: [] };
  }
}

export async function saveNetwork(input: unknown) {
  const dir = await storiesDir();
  if (!dir) throw new Error("STORIES_DIR is not set");
  const board = await getBoard();
  const network = cleanNetwork(input, new Set(board.cards.map((c) => c.id)));
  await writeFile(/* turbopackIgnore: true */ path.join(dir, "network.json"), JSON.stringify(network, null, 2) + "\n");
  return network;
}

// A demo that opens a private, local-only page (the story views). Its button shows only where those pages work.
export const isLocalOnlyDemo = (href: string) => /^\/stories(?:[/?#]|$)/.test(href);

export async function localViewsAvailable(host: string | null) {
  return isLocalHost(host) && Boolean(await storiesDir());
}
