import type { Metadata } from "next";
import { headers } from "next/headers";
import { getParts } from "@/lib/content";
import { getBoard, isLocalHost } from "@/lib/stories";
import StoryBoard from "./StoryBoard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Story cards", robots: { index: false, follow: false } };

// Marlon's planning board: one card per micro-story, dragged between the parts of the talk and printed as index cards.
// The cards come from the private repo through STORIES_DIR, and only on localhost; anywhere else the page is empty.
export default async function StoriesPage() {
  const local = isLocalHost((await headers()).get("host"));
  const [board, parts] = await Promise.all([local ? getBoard() : null, getParts()]);
  const labels: Record<string, string> = { unplaced: "Unplaced" };
  for (const part of parts) if (part.number <= 5) labels[String(part.number)] = part.number === 0 ? "Open" : part.title;

  if (!board?.enabled) {
    return (
      <main id="main" className="not-found">
        <p className="eyebrow">Story cards</p>
        <h1>Nothing here.</h1>
        <p>This board is a private planning tool. It only shows cards on the laptop where the talk is being planned.</p>
      </main>
    );
  }
  return <StoryBoard initial={board} labels={labels} />;
}
