import { getBoard, isLocalHost, saveBoard } from "@/lib/stories";

export const dynamic = "force-dynamic";

// Local only (see isLocalHost): anywhere else the route only reports that nothing is here.
export async function GET(request: Request) {
  if (!isLocalHost(request.headers.get("host"))) return Response.json({ enabled: false, cards: [], columns: {} });
  return Response.json(await getBoard(), { headers: { "cache-control": "no-store" } });
}

export async function POST(request: Request) {
  if (!isLocalHost(request.headers.get("host"))) return new Response("Not available here", { status: 403 });
  try {
    const { columns } = await request.json();
    return Response.json(await saveBoard(columns ?? {}));
  } catch (error) {
    return new Response(String((error as Error).message), { status: 400 });
  }
}
