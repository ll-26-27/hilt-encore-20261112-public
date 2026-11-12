import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { contentRoot } from "./content";

// The examples (/examples): one Markdown file per example in content/examples/<slug>.md, written by CX. Frontmatter:
// title, order, index (the one line on the index), source (the public repo), demo (optional link to the thing itself),
// image (optional; otherwise /examples/<slug>/card.png from public/). Body: "## What this is", "## How we made it",
// "## Source". Each example's working demo lives in app/examples/<slug>/; an example with no Markdown yet still shows,
// from the defaults below.
export type Example = { slug: string; title: string; order: number; index: string; source: string; demo: string; image: string; sections: Record<string, string>; missing: boolean };

// The examples, in order, so the index has every card even before an example's Markdown exists.
export const EXAMPLES: Array<Pick<Example, "slug" | "title" | "index" | "source">> = [
  { slug: "eliza-to-gpt2", title: "Who is speaking? From ELIZA to GPT-2", index: "A 1966 chatbot running in your browser, beside recorded output from an early language model.", source: "https://github.com/ll-26-27/eng298ai-20261020" },
  { slug: "hand-instruments", title: "Hand instruments", index: "Play drums, sounds, and a band with your hands in front of the camera.", source: "https://github.com/tdm155ai/tdm155ai-week-10" },
  { slug: "simulated-interview", title: "The interview machine, with a context folder", index: "A simulated interview, transcribed per speaker as it plays, with an AI producer reading the project's context folder.", source: "https://github.com/tdm155ai/tdm155ai-week-8" },
  { slug: "twelve-models", title: "Six prompts, twelve image models", index: "The same six prompts given to twelve image models, side by side.", source: "https://github.com/tdm155ai/week-1-image-experiment" },
  { slug: "frankenstein-revisions", title: "Frankenstein, 1818 and 1831", index: "Distant reading of Mary Shelley's revisions, chapter by chapter.", source: "https://github.com/ll-26-27/eng298ai-20261103" },
  { slug: "recipe-cards", title: "The recipe-card gallery", index: "Photos of recipe cards, read, renamed, researched, and turned into a web gallery by Claude.", source: "https://github.com/bok-learning-lab/claude-workshop-materials" },
  { slug: "phaedrus-walk", title: "The Phaedrus walk", index: "Plato's Phaedrus as a walk outside Athens: each stop on a map, with the passage that happens there.", source: "https://github.com/ll-26-27/eng298ai-20261103" },
];

const dir = path.join(/* turbopackIgnore: true */ contentRoot, "examples");
const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

function sectionsOf(content: string) {
  const sections: Record<string, string> = {};
  const parts = content.split(/^##\s+(.+)$/m);
  if (parts[0].trim()) sections.intro = parts[0].trim();
  for (let i = 1; i < parts.length; i += 2) sections[parts[i].trim().toLowerCase()] = (parts[i + 1] ?? "").trim();
  return sections;
}

async function read(slug: string): Promise<Example> {
  const base = EXAMPLES.find((e) => e.slug === slug);
  let data: Record<string, unknown> = {};
  let content = "";
  let missing = false;
  try {
    ({ data, content } = matter(await readFile(path.join(/* turbopackIgnore: true */ dir, `${slug}.md`), "utf8")));
  } catch {
    missing = true;
  }
  const i = EXAMPLES.findIndex((e) => e.slug === slug);
  return {
    slug,
    title: str(data.title) || base?.title || slug,
    order: Number(data.order) || (i >= 0 ? i + 1 : 99),
    index: str(data.index) || base?.index || "",
    source: str(data.source) || base?.source || "",
    demo: str(data.demo),
    image: str(data.image) ? (str(data.image).startsWith("/") ? str(data.image) : `/media/examples/${str(data.image)}`) : `/examples/${slug}/card.png`,
    sections: sectionsOf(content),
    missing,
  };
}

export async function getExamples() {
  let extra: string[] = [];
  try {
    extra = (await readdir(/* turbopackIgnore: true */ dir)).filter((n) => n.endsWith(".md") && !n.endsWith("-script.md") && !/^readme\.md$/i.test(n)).map((n) => n.slice(0, -3));
  } catch {}
  const slugs = [...new Set([...EXAMPLES.map((e) => e.slug), ...extra])];
  return (await Promise.all(slugs.map(read))).sort((a, b) => a.order - b.order);
}

export function getExample(slug: string) {
  return read(slug);
}
