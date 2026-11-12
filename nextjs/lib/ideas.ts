import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import { contentRoot } from "./content";

// The teaching ideas (/ideas): one Markdown file per idea in content/ideas/<slug>.md, with the "Start here" list
// from content/ideas/README.md. Shown: title, description, mode, tags and body.

// Where the idea files and the README with "Start here" are.
async function places(): Promise<{ files: string; readme: string }> {
  const dir = path.join(/* turbopackIgnore: true */ contentRoot, "ideas");
  return { files: dir, readme: path.join(/* turbopackIgnore: true */ dir, "README.md") };
}

export type Idea = { slug: string; title: string; description: string; mode: string; tags: string[]; body: string };

export const MODES: Array<[string, string]> = [
  ["perform-in-claude", "Perform it in Claude"],
  ["build-with-claude-code", "Build it with Claude Code"],
  ["mixed", "Mixed"],
  ["analog", "Analog"],
];

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

export async function getIdeas(): Promise<Idea[]> {
  const dir = (await places()).files;
  let names: string[] = [];
  try {
    names = (await readdir(/* turbopackIgnore: true */ dir)).filter((n) => /^[a-z0-9][a-z0-9-]*\.md$/.test(n) && !/^(readme|index)\.md$/i.test(n));
  } catch {
    return [];
  }
  const ideas = await Promise.all(
    names.map(async (name) => {
      const { data, content } = matter(await readFile(path.join(/* turbopackIgnore: true */ dir, name), "utf8"));
      const description = str(data.description);
      // The body repeats the description as its first paragraph; drop it so the page doesn't say it twice.
      const body = content.trim().startsWith(description) ? content.trim().slice(description.length).trim() : content.trim();
      return { slug: name.slice(0, -3), title: str(data.title) || name.slice(0, -3), description, mode: str(data.mode), tags: Array.isArray(data.tags) ? data.tags.map(str).filter(Boolean) : [], body };
    }),
  );
  return ideas.sort((a, b) => a.title.localeCompare(b.title));
}

// The README's "Start here" list, in its order: the slugs it links to.
export async function getStartHere(): Promise<string[]> {
  try {
    const readme = await readFile(/* turbopackIgnore: true */ (await places()).readme, "utf8");
    const section = readme.split(/^##\s+Start here\s*$/m)[1]?.split(/^##\s+/m)[0] ?? "";
    return [...section.matchAll(/\]\((?:\.\/)?(?:ideas\/)?([a-z0-9-]+)\.md\)/g)].map((m) => m[1]).filter((s) => s !== "index" && s !== "readme");
  } catch {
    return [];
  }
}
