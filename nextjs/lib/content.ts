import { readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

// The site's words live in the repo's root content/: home.md (the home page), utilities.md, examples/ and ideas/.
export const contentRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "..", "content");

export type Doc = { data: Record<string, unknown>; content: string; missing?: boolean };
export type Home = Doc & { title: string; subtitle: string; date: string; time: string; people: Array<{ name: string; title: string }> };

const str = (value: unknown) => (typeof value === "string" ? value.trim() : typeof value === "number" ? String(value) : "");

export async function readDoc(name: string): Promise<Doc> {
  try {
    const { data, content } = matter(await readFile(path.join(/* turbopackIgnore: true */ contentRoot, name), "utf8"));
    return { data, content };
  } catch {
    return { data: {}, content: "", missing: true };
  }
}

// A page's own H1 would repeat the title the app already shows.
export function withoutH1(content: string) {
  return content.replace(/^\s*#\s+[^\n]+(?:\r?\n|$)/, "");
}

export async function getHome(): Promise<Home> {
  const doc = await readDoc("home.md");
  const people = (Array.isArray(doc.data.people) ? doc.data.people : [])
    .map((p) => (p && typeof p === "object" ? { name: str((p as Record<string, unknown>).name), title: str((p as Record<string, unknown>).title) } : { name: str(p), title: "" }))
    .filter((p) => p.name);
  return {
    ...doc,
    title: str(doc.data.title) || "What We Learned Teaching Harvard Faculty to Build with AI",
    subtitle: str(doc.data.subtitle),
    date: str(doc.data.date) || "Thursday, November 12, 2026",
    time: str(doc.data.time),
    people,
  };
}

// The file behind a /media/... address (an image beside the Markdown), or null if it's outside content/.
export function mediaFile(segments: string[]) {
  if (segments.some((s) => decodeURIComponent(s).startsWith("_"))) return null;
  const file = path.resolve(contentRoot, ...segments.map((s) => decodeURIComponent(s)));
  return file.startsWith(contentRoot + path.sep) ? file : null;
}

// Relative links resolve from the linking file's folder.
export function resolveHref(href: string | undefined, dir = "") {
  if (!href) return "#";
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(href)) return href;
  const [pathname, hash = ""] = href.split("#");
  let target = path.posix.normalize(path.posix.join(dir, decodeURIComponent(pathname)));
  target = target.replace(/\.md$/i, "").replace(/(?:^|\/)readme$/i, "").replace(/\/$/, "");
  if (target === "." || target.startsWith("..") || target === "home") target = "";
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
