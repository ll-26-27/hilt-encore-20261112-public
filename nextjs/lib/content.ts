import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// The site's words live in the repo's root content/ (CX owns it; the contract is content/README.md):
//   content/home.md                      the home page and the title slide
//   content/talk/NN-part/README.md       a part: its card in the deck, and its readable page at /talk/<part>
//   content/talk/NN-part/NN-slide.md     one slide per file
//   content/take-home.md                 repos, tools, examples
//   content/wondering.md                 the learned / wondering close
// Anything missing shows as a placeholder, so the deck runs before the words are written.
export const contentRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "..", "content");

export const LAYOUTS = ["statement", "bullets", "quote", "image", "demo", "set-piece", "shift", "qr", "made"] as const;
export type Layout = (typeof LAYOUTS)[number];

export type Doc = {
  data: Record<string, unknown>;
  content: string;
  dir: string; // the folder the file sits in, relative to content/, for resolving images and links
  missing?: boolean;
};

export type Home = Doc & {
  title: string;
  subtitle: string;
  date: string;
  time: string;
  people: string[];
  url: string;
};

export type Slide = Doc & {
  id: string; // part slug + file slug, stable for React keys
  title: string;
  layout: Layout;
  who: string;
  image: string;
  demo: string;
  cite: string;
  site: boolean;
  present: boolean; // false: on /talk/<part> for readers, but left out of the slides at /present
  steps: number; // how many presses reveal the slide (shift columns); 1 for most
};

export type Part = Doc & {
  slug: string;
  number: number;
  title: string;
  question: string;
  who: string;
  minutes: number;
  slides: Slide[];
};

// Marlon's basic arc (Nov 12), framed by HL's run of show (open, parts 1–5, close); used only until CX's part READMEs land.
const ARC: Array<Pick<Part, "slug" | "title" | "question">> = [
  { slug: "00-open", title: "Welcome", question: "What we learned teaching Harvard faculty to build with AI" },
  { slug: "01-learning-lab", title: "What is the Learning Lab?", question: "What do we do, and why were we doing all this AI stuff?" },
  { slug: "02-why-this", title: "Why this AI thing?", question: "Why this particular AI thing?" },
  { slug: "03-design", title: "How we designed it", question: "How we designed it, and how the design shifted as we went" },
  { slug: "04-what-we-learned", title: "What we learned", question: "Concrete shifts in how we work" },
  { slug: "05-what-comes-next", title: "What comes next", question: "Learned / wondering: throwing it open" },
  { slug: "06-close", title: "Take it home", question: "Repos, tools, examples, and where to ask us" },
];

// HL's names for the same fields (kind, speaker) are read too, so either spelling works.
const KIND_ALIASES: Record<string, Layout> = { slide: "statement", setpiece: "set-piece", moment: "statement", plan: "shift" };

const str = (value: unknown, fallback = "") => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : fallback);

function titleFromSlug(slug: string) {
  return slug.replace(/^\d{1,2}[-_]/, "").replace(/[-_]+/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

async function parse(file: string, dir: string): Promise<Doc> {
  let raw: string;
  try {
    raw = await readFile(/* turbopackIgnore: true */ file, "utf8");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return { data: {}, content: "", dir, missing: true };
    throw error;
  }
  try {
    const { data, content } = matter(raw);
    return { data, content, dir };
  } catch {
    // Frontmatter that isn't valid YAML: show the words without it rather than fail the deck mid-talk.
    return { data: {}, content: raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, ""), dir };
  }
}

function firstHeading(content: string) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? "";
}

// A page's own H1 would repeat the title the app already shows.
export function withoutH1(content: string) {
  return content.replace(/^\s*#\s+[^\n]+(?:\r?\n|$)/, "");
}

async function list(dir: string) {
  try {
    return await readdir(/* turbopackIgnore: true */ dir, { withFileTypes: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw error;
  }
}

const visible = (name: string) => !name.startsWith("_") && !name.startsWith(".");

export async function getHome(): Promise<Home> {
  const doc = await parse(path.join(contentRoot, "home.md"), "");
  const people = Array.isArray(doc.data.people) ? doc.data.people.map((p) => str(p)).filter(Boolean) : [];
  return {
    ...doc,
    title: str(doc.data.title) || firstHeading(doc.content) || "What We Learned Teaching Harvard Faculty to Build with AI",
    subtitle: str(doc.data.subtitle) || "The Learning Lab at the Derek Bok Center for Teaching and Learning",
    date: str(doc.data.date) || "Thursday, November 12, 2026",
    time: str(doc.data.time) || "12:00–1:00 PM ET · HILT Encore Event · Zoom",
    people,
    url: str(doc.data.url),
  };
}

function toSlide(partSlug: string, fileSlug: string, doc: Doc): Slide {
  const named = str(doc.data.layout) || str(doc.data.kind);
  const layout = LAYOUTS.includes(named as Layout) ? (named as Layout) : KIND_ALIASES[named] ?? "statement";
  const columns = layout === "shift" ? (doc.content.match(/^##\s+/gm) ?? []).length : 0;
  return {
    ...doc,
    id: `${partSlug}/${fileSlug}`,
    title: str(doc.data.title) || firstHeading(doc.content) || titleFromSlug(fileSlug),
    layout,
    who: str(doc.data.who) || str(doc.data.speaker),
    image: str(doc.data.image),
    demo: str(doc.data.demo),
    cite: str(doc.data.cite),
    site: doc.data.site !== false,
    present: doc.data.present !== false,
    steps: Math.max(1, columns),
  };
}

async function readPart(slug: string, number: number, fallback?: (typeof ARC)[number]): Promise<Part> {
  const dir = path.join(contentRoot, "talk", slug);
  const relDir = `talk/${slug}`;
  const intro = await parse(path.join(dir, "README.md"), relDir);
  const files = (await list(dir))
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md") && !/^readme\.md$/i.test(entry.name) && visible(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const slides = await Promise.all(files.map(async (name) => toSlide(slug, name.slice(0, -3), await parse(path.join(dir, name), relDir))));
  return {
    ...intro,
    slug,
    number,
    title: str(intro.data.title) || firstHeading(intro.content) || fallback?.title || titleFromSlug(slug),
    question: str(intro.data.question) || fallback?.question || "",
    who: str(intro.data.who) || str(intro.data.speaker),
    minutes: Number(intro.data.minutes) || 0,
    slides,
  };
}

// The five parts: whatever folders content/talk/ holds, or the arc as placeholders until it holds any.
export async function getParts(): Promise<Part[]> {
  const folders = (await list(path.join(contentRoot, "talk")))
    .filter((entry) => entry.isDirectory() && visible(entry.name))
    .map((entry) => entry.name)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  // The NN- prefix is the part's number (00 open, 01–05, 06 close), so the 1–5 keys jump to the arc's parts. A number
  // with no folder yet shows the arc's placeholder.
  const num = (slug: string) => slug.match(/^(\d+)/)?.[1] ?? "";
  const slugs = [...folders, ...ARC.map((part) => part.slug).filter((slug) => !folders.some((f) => num(f) === num(slug)))];
  slugs.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return Promise.all(slugs.map((slug, i) => readPart(slug, Number(num(slug) || i), ARC.find((part) => num(part.slug) === num(slug)))));
}

export async function getPart(slug: string) {
  return (await getParts()).find((part) => part.slug === decodeURIComponent(slug)) ?? null;
}

export async function getPage(name: "take-home" | "wondering") {
  const doc = await parse(path.join(contentRoot, `${name}.md`), "");
  return {
    ...doc,
    title: str(doc.data.title) || firstHeading(doc.content) || (name === "take-home" ? "Take home" : "Learned / wondering"),
    subtitle: str(doc.data.subtitle),
  };
}

// The file behind a /media/... address (an image beside the Markdown), or null if it's outside content/.
export function mediaFile(segments: string[]) {
  const file = path.resolve(contentRoot, ...segments.map((s) => decodeURIComponent(s)));
  return file.startsWith(contentRoot + path.sep) ? file : null;
}

// Relative links resolve from the linking file's folder. A link to another talk part's README opens its page.
export function resolveHref(href: string | undefined, dir = "") {
  if (!href) return "#";
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [pathname, hash = ""] = href.split("#");
  let target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(pathname)));
  target = target.replace(/\.md$/i, "").replace(/(?:^|\/)readme$/i, "").replace(/\/$/, "");
  if (target === "." || target.startsWith("..")) target = "";
  if (target === "home") target = "";
  return `/${target}${hash ? `#${hash}` : ""}`;
}

export function resolveSrc(src: string | undefined, dir = "") {
  if (!src || /^(?:[a-z][a-z0-9+.-]*:|\/|#)/i.test(src)) return src;
  const resolved: string[] = [];
  for (const part of [...dir.split("/"), ...src.split("/")]) {
    if (!part || part === ".") continue;
    if (part === "..") resolved.pop();
    else resolved.push(part);
  }
  return `/media/${resolved.map(encodeURIComponent).join("/")}`;
}
