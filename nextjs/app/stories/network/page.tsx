import type { Metadata } from "next";
import { headers } from "next/headers";
import { getParts } from "@/lib/content";
import { getBoard, getNetwork, isLocalHost } from "@/lib/stories";
import NetworkBoard from "./NetworkBoard";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Story network", robots: { index: false, follow: false } };

// The story cards as a node network: drag them anywhere, link them, label the links. Same private cards and the same
// localhost-only rule as the board (/stories). ?share=1 opens in screen-share mode (titles only).
export default async function NetworkPage({ searchParams }: { searchParams: Promise<{ share?: string }> }) {
  const local = isLocalHost((await headers()).get("host"));
  const [board, parts] = await Promise.all([local ? getBoard() : null, getParts()]);
  if (!board?.enabled) {
    return (
      <main id="main" className="not-found">
        <p className="eyebrow">Story network</p>
        <h1>Nothing here.</h1>
        <p>This is a private planning tool. It only shows cards on the laptop where the talk is being planned.</p>
      </main>
    );
  }
  const labels: Record<string, string> = { unplaced: "Unplaced" };
  for (const part of parts) if (part.number <= 5) labels[String(part.number)] = part.number === 0 ? "Open" : part.title;
  const share = (await searchParams).share === "1";
  return <NetworkBoard board={board} network={await getNetwork()} labels={labels} initialShare={share} />;
}
