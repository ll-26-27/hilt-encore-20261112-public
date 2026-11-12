// Reads a script in the 1966 format (see doctor.ts) into the structures the engine uses. Ported to TypeScript from
// ll-26-27/eng298ai-20261020 nextjs/lib/eliza/script.mjs. The format is described in the paper, pp. 38-41.

type Item = string | Item[];

export type PatternElement = number | string | { any: string[] } | { tags: string[] };

export type Reassembly = {
  source: string;
  words?: string[];
  link?: string | null;
  newkey?: boolean;
  pre?: string[];
};

export type Transformation = { pattern: PatternElement[]; source: string; reassemblies: Reassembly[] };

export type KeywordRule = {
  keyword: string;
  substitute: string | null;
  tags: string[];
  rank: number;
  transformations: Transformation[];
  link: string | null;
  source: string;
};

export type MemoryRule = {
  keyword: string;
  source: string;
  transformations: { pattern: PatternElement[]; source: string; reassembly: { words: string[]; source: string } }[];
};

export type Script = {
  greeting: string;
  keywords: Map<string, KeywordRule>;
  none: KeywordRule;
  memory: MemoryRule;
  tags: Map<string, string[]>;
};

// Split script text into "(", ")" and words, dropping ; comments, and read them into nested arrays.
function readLists(text: string): Item[] {
  const tokens: string[] = [];
  for (const line of text.split("\n"))
    for (const m of line.replace(/;.*/, "").matchAll(/[()]|[^\s()]+/g)) tokens.push(m[0]);
  let i = 0;
  function read(): Item {
    const token = tokens[i++];
    if (token !== "(") return token;
    const list: Item[] = [];
    while (tokens[i] !== ")") {
      if (i >= tokens.length) throw new Error("script error: unbalanced parentheses");
      list.push(read());
    }
    i++;
    return list;
  }
  const items: Item[] = [];
  while (i < tokens.length) items.push(read());
  return items;
}

// Lisp-style printing, for showing rules: [["0", "YOUR", "0"]] -> "(0 YOUR 0)"
export function show(item: Item): string {
  return Array.isArray(item) ? `(${item.map(show).join(" ")})` : item;
}

const flat = (list: Item[]): string[] => list.map(x => (Array.isArray(x) ? show(x) : x));

function readPatternElement(element: Item): PatternElement {
  if (!Array.isArray(element)) return /^\d+$/.test(element) ? Number(element) : element;
  const words = flat(element).join(" ").replace(/^\s*([*/])\s*/, "$1 ").trim().split(/\s+/);
  const kind = words.shift();
  if (kind === "*") return { any: words };
  if (kind === "/") return { tags: words };
  throw new Error(`script error: unknown pattern element ${show(element)}`);
}

// A link to another keyword's rules, written (=WHAT) or (= WHAT).
function readLink(list: Item): string | null {
  if (!Array.isArray(list) || !list.length || !String(list[0]).startsWith("=")) return null;
  return list[0] === "=" ? String(list[1]) : String(list[0]).slice(1);
}

function readReassembly(item: Item): Reassembly {
  const list = Array.isArray(item) ? item : [item];
  const link = readLink(list);
  if (link) return { link, source: show(list) };
  if (list.length === 1 && list[0] === "NEWKEY") return { newkey: true, source: show(list) };
  if (list[0] === "PRE") return { pre: flat(list[1] as Item[]), link: readLink(list[2]), source: show(list) };
  return { words: flat(list), source: show(list) };
}

function readTransformation(list: Item[]): Transformation {
  const [decomposition, ...reassemblies] = list as [Item[], ...Item[]];
  return {
    pattern: decomposition.map(readPatternElement),
    source: show(decomposition),
    reassemblies: reassemblies.map(readReassembly),
  };
}

// (KEYWORD [= SUBSTITUTE] [DLIST(/TAGS)] [RANK] [transformations...] [(=LINK)])
function readKeyword(list: Item[]): KeywordRule {
  const [keyword, ...rest] = list;
  const rule: KeywordRule = { keyword: String(keyword), substitute: null, tags: [], rank: 0, transformations: [], link: null, source: show(list) };
  for (let i = 0; i < rest.length; i++) {
    const item = rest[i];
    if (item === "=") rule.substitute = String(rest[++i]);
    else if (item === "DLIST") rule.tags = flat(rest[++i] as Item[]).join(" ").replace(/\//g, " ").trim().split(/\s+/).filter(Boolean);
    else if (typeof item === "string" && /^\d+$/.test(item)) rule.rank = Number(item);
    else if (Array.isArray(item) && Array.isArray(item[0])) rule.transformations.push(readTransformation(item));
    else if (readLink(item)) rule.link = readLink(item);
    else throw new Error(`script error in ${String(keyword)}: did not expect ${show(item)}`);
  }
  return rule;
}

// (MEMORY MY (0 YOUR 0 = LETS DISCUSS FURTHER WHY YOUR 3) ...): four transformations separated by "=".
function readMemory(list: Item[]): MemoryRule {
  const [, keyword, ...transformations] = list;
  return {
    keyword: String(keyword),
    source: show(list),
    transformations: transformations.map(item => {
      const t = item as Item[];
      const split = t.indexOf("=");
      return {
        pattern: t.slice(0, split).map(readPatternElement),
        source: show(t.slice(0, split)),
        reassembly: { words: flat(t.slice(split + 1)), source: show(t.slice(split + 1)) },
      };
    }),
  };
}

export function parseScript(text: string): Script {
  const items = readLists(text);
  const [greeting, start, ...lists] = items;
  if (start !== "START") throw new Error("script error: expected START after the greeting");
  let none: KeywordRule | null = null;
  let memory: MemoryRule | null = null;
  const keywords = new Map<string, KeywordRule>();
  for (const list of lists) {
    if (!Array.isArray(list) || !list.length) continue; // the closing ()
    if (list[0] === "MEMORY") memory = readMemory(list);
    else if (list[0] === "NONE") none = readKeyword(list);
    else keywords.set(String(list[0]), readKeyword(list));
  }
  if (!none) throw new Error("script error: no NONE rule");
  if (!memory || memory.transformations.length !== 4) throw new Error("script error: MEMORY needs four transformations");
  const tags = new Map<string, string[]>();
  for (const rule of keywords.values())
    for (const tag of rule.tags) tags.set(tag, [...(tags.get(tag) || []), rule.keyword]);
  return { greeting: flat(greeting as Item[]).join(" "), keywords, none, memory, tags };
}
