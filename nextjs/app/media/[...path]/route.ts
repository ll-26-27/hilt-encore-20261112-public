import { readFile } from "node:fs/promises";
import path from "node:path";
import { mediaFile } from "@/lib/content";

const TYPES: Record<string, string> = {
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".pdf": "application/pdf", ".mp4": "video/mp4", ".webm": "video/webm", ".mp3": "audio/mpeg",
};

// Images and small media that sit beside the Markdown in content/.
export async function GET(_request: Request, { params }: { params: Promise<{ path: string[] }> }) {
  const file = mediaFile((await params).path);
  const type = file && TYPES[path.extname(file).toLowerCase()];
  if (!file || !type) return new Response("Not found", { status: 404 });
  try {
    return new Response(new Uint8Array(await readFile(/* turbopackIgnore: true */ file)), { headers: { "content-type": type, "cache-control": "no-cache" } });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
