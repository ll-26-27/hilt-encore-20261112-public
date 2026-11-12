import { getMade } from "@/lib/made";

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json(await getMade(), { headers: { "cache-control": "no-store" } });
}
