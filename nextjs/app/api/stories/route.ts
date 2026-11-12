import { getBoard, saveBoard } from "@/lib/stories";

export const dynamic = "force-dynamic";

// Local only: the board is Marlon's planning on his own laptop. Saving needs STORIES_DIR, a request to localhost, and
// not running on Vercel; anywhere else the route only reports that nothing is here.
function local(request: Request) {
  const host = (request.headers.get("host") ?? "").split(":")[0];
  return !process.env.VERCEL && ["localhost", "127.0.0.1", "::1", "[::1]"].includes(host);
}

export async function GET(request: Request) {
  if (!local(request)) return Response.json({ enabled: false, cards: [], columns: {} });
  return Response.json(await getBoard(), { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!local(request)) return new Response("Not available here", { status: 403 });
  try {
    const { columns } = await request.json();
    return Response.json(await saveBoard(columns ?? {}));
  } catch (error) {
    return new Response(String((error as Error).message), { status: 400 });
  }
}
