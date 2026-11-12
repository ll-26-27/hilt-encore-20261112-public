import { getNetwork, isLocalHost, saveNetwork, storiesDir } from "@/lib/stories";

export const dynamic = "force-dynamic";

// Positions and links for /stories/network, local only like the board. Unknown card IDs are dropped on save.
export async function GET(request: Request) {
  if (!isLocalHost(request.headers.get("host")) || !(await storiesDir())) return Response.json({ positions: {}, links: [] });
  return Response.json(await getNetwork(), { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isLocalHost(request.headers.get("host"))) return new Response("Not available here", { status: 403 });
  try {
    return Response.json(await saveNetwork(await request.json()));
  } catch (error) {
    return new Response(String((error as Error).message), { status: 400 });
  }
}
