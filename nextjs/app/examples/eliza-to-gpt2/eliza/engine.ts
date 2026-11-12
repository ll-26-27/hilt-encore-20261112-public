// ELIZA's procedure as Weizenbaum describes it in the 1966 paper (CACM 9(1), pp. 36-45), with three behaviours taken
// from the 1965 MAD-SLIP listing: BUT is a delimiter; the LIMIT counter (1-4) recalls a memory only at 4; the MEMORY
// transformation is chosen by HASH of the last word. Ported to TypeScript, logic unchanged, from
// ll-26-27/eng298ai-20261020 nextjs/lib/eliza/engine.mjs (itself a port of Anthony Hay's C++ reading,
// github.com/anthay/ELIZA). The engine is pure: respond(message, state) returns the reply, the rule, the next state.

import { hash, lastCellAsBcd } from "./hash";
import { parseScript, type KeywordRule, type PatternElement } from "./script";

const NOMATCH = ["PLEASE CONTINUE", "HMMM", "GO ON , PLEASE", "I SEE"];
const DELIMITERS = new Set([",", ".", "BUT"]);

export type ElizaState = { limit: number; memories: string[]; cursors: Record<string, number> };

export type Step = {
  keyword: string;
  rank: number;
  text: string;
  action?: string;
  link?: string | null;
  result?: string;
  decomposition?: string;
  decompositionIndex?: number;
  decompositionCount?: number;
  parts?: string[];
  reassembly?: string;
  reassemblyIndex?: number;
  reassemblyCount?: number;
};

export type Rule = {
  kind: "keyword" | "memory" | "none" | "nomatch";
  input: string;
  limit: number;
  discarded: string[];
  substitutions: [string, string][];
  keystack: string[];
  clause: string;
  steps: Step[];
  memory: null | { recalled?: string; created?: string; word?: string; hash?: number };
  keyword?: string;
  memories: number;
};

export function readInput(text: string): string[] {
  const upper = String(text).toUpperCase()
    .replace(/’/g, "'")
    .replace(/[‘"«»‚-‟‹›¡¿]/g, " ")
    .replace(/[!?]/g, ".")
    .replace(/[:;–—]/g, ",");
  return upper.match(/[,.]|[^\s,.]+/g) || [];
}

function matchesWord(element: PatternElement, word: string, tags: Map<string, string[]>): boolean {
  if (typeof element === "string") return element === word;
  if (typeof element === "number") return false;
  if ("any" in element) return element.any.includes(word);
  return element.tags.some(tag => tags.get(tag)?.includes(word));
}

// Match a decomposition pattern against the words (p. 38). A 0 takes as few words as it can.
export function match(pattern: PatternElement[], words: string[], tags: Map<string, string[]>): string[] | null {
  if (!pattern.length) return words.length ? null : [];
  const [head, ...rest] = pattern;
  if (head === 0) {
    for (let n = 0; n <= words.length; n++) {
      const tail = match(rest, words.slice(n), tags);
      if (tail) return [words.slice(0, n).join(" "), ...tail];
    }
    return null;
  }
  if (typeof head === "number") {
    if (words.length < head) return null;
    const tail = match(rest, words.slice(head), tags);
    return tail && [words.slice(0, head).join(" "), ...tail];
  }
  if (!words.length || !matchesWord(head, words[0], tags)) return null;
  const tail = match(rest, words.slice(1), tags);
  return tail && [words[0], ...tail];
}

// Build a reply from a reassembly rule: a number n is replaced by the nth part of the decomposition (p. 38).
export function reassemble(template: string[], parts: string[]): string[] {
  return template.flatMap(item => {
    if (!/^\d+$/.test(item)) return [item];
    const part = parts[Number(item) - 1];
    if (part === undefined) return ["HMMM"];
    return part ? part.split(" ") : [];
  });
}

type Next = { reply?: string[]; nomatch?: boolean; newkey?: boolean; link?: string | null; words?: string[] };

export function createEliza(scriptText: string) {
  const script = parseScript(scriptText);
  const { keywords, tags, memory, none } = script;

  function initialState(): ElizaState {
    return { limit: 1, memories: [], cursors: {} };
  }

  function transform(rule: KeywordRule, words: string[], state: ElizaState, steps: Step[]): Next {
    const index = rule.transformations.findIndex(t => match(t.pattern, words, tags));
    if (index < 0) {
      if (rule.link) {
        steps.push({ keyword: rule.keyword, rank: rule.rank, action: "link", link: rule.link, text: words.join(" ") });
        return { link: rule.link };
      }
      steps.push({ keyword: rule.keyword, rank: rule.rank, action: "no decomposition matched", text: words.join(" ") });
      return { nomatch: true };
    }
    const t = rule.transformations[index];
    const parts = match(t.pattern, words, tags) ?? [];
    const key = `${rule.keyword} ${index}`;
    const used = state.cursors[key] ?? 0;
    state.cursors[key] = (used + 1) % t.reassemblies.length;
    const r = t.reassemblies[used];
    const step: Step = {
      keyword: rule.keyword, rank: rule.rank, text: words.join(" "),
      decomposition: t.source, decompositionIndex: index, decompositionCount: rule.transformations.length, parts,
      reassembly: r.source, reassemblyIndex: used, reassemblyCount: t.reassemblies.length,
    };
    steps.push(step);
    if (r.newkey) {
      step.action = "newkey";
      return { newkey: true };
    }
    if (r.pre) {
      const pre = reassemble(r.pre, parts);
      Object.assign(step, { action: "pre", link: r.link, result: pre.join(" ") });
      return { link: r.link, words: pre };
    }
    if (r.link) {
      Object.assign(step, { action: "link", link: r.link });
      return { link: r.link };
    }
    const reply = reassemble(r.words ?? [], parts);
    Object.assign(step, { action: "reply", result: reply.join(" ") });
    return { reply };
  }

  function respond(message: string, previous: ElizaState = initialState()): { reply: string; rule: Rule; state: ElizaState } {
    const state: ElizaState = structuredClone(previous);
    state.limit = (state.limit % 4) + 1;

    let words = readInput(message);
    const discarded: string[] = [];
    const substitutions: [string, string][] = [];
    const keystack: string[] = [];
    let topRank = 0;
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (DELIMITERS.has(word)) {
        if (!keystack.length) {
          discarded.push(words.slice(0, i + 1).join(" "));
          words = words.slice(i + 1);
          i = -1;
          continue;
        }
        const rest = words.slice(i).join(" ");
        if (rest !== ".") discarded.push(rest);
        words = words.slice(0, i);
        break;
      }
      const rule = keywords.get(word);
      if (!rule) continue;
      if (rule.transformations.length || rule.link) {
        if (rule.rank > topRank) {
          keystack.unshift(word);
          topRank = rule.rank;
        } else keystack.push(word);
      }
      if (rule.substitute) {
        substitutions.push([word, rule.substitute]);
        words[i] = rule.substitute;
      }
    }

    const trace = {
      input: message, limit: state.limit, discarded, substitutions, keystack: [...keystack], clause: words.join(" "),
      steps: [] as Step[], memory: null as Rule["memory"],
    };
    const finish = (reply: string, kind: Rule["kind"], extra: Partial<Rule> = {}) => {
      const rule: Rule = { kind, ...trace, ...extra, memories: state.memories.length };
      return { reply, rule, state };
    };

    if (!keystack.length && state.limit === 4 && state.memories.length) {
      const recalled = state.memories.shift() as string;
      trace.memory = { recalled };
      return finish(recalled, "memory");
    }

    while (keystack.length) {
      const keyword = keystack.shift() as string;
      const rule = keywords.get(keyword);
      if (!rule) return finish(NOMATCH[state.limit - 1], "nomatch", { keyword });
      if (keyword === memory.keyword) {
        const word = words.at(-1) ?? "";
        const index = hash(lastCellAsBcd(word), 2);
        const t = memory.transformations[index];
        const parts = match(t.pattern, words, tags);
        if (parts) {
          const text = reassemble(t.reassembly.words, parts).join(" ");
          state.memories.push(text);
          trace.memory = { created: text, word, hash: index };
        }
      }
      const next = transform(rule, words, state, trace.steps);
      if (next.reply) return finish(next.reply.join(" "), "keyword");
      if (next.nomatch) return finish(NOMATCH[state.limit - 1], "nomatch", { keyword });
      if (next.words) words = next.words;
      if (next.link) keystack.unshift(next.link);
    }

    const fallback = transform(none, words, state, trace.steps);
    return finish((fallback.reply ?? []).join(" "), "none", { keyword: "NONE" });
  }

  return { script, greeting: script.greeting, initialState, respond };
}

// One line saying how a reply was made, for compact displays.
export function describeRule(rule: Rule): string {
  if (rule.kind === "memory") return "no keyword, counter at 4: recalled a memory";
  if (rule.kind === "nomatch") return `${rule.keyword}: no decomposition matched, so a built-in reply`;
  const last = rule.steps.at(-1);
  if (!last) return rule.kind;
  const via = rule.steps.length > 1 ? `${rule.steps.map(s => s.keyword).join(" → ")}: ` : `${last.keyword}: `;
  return `${rule.kind === "none" ? "no keyword: " : ""}${via}${last.decomposition} → ${last.reassembly}`;
}
