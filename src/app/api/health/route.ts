import { jsonSuccess } from "@/lib/http";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  return jsonSuccess({ service: "ozlind", status: "ok", version: "0.1.0" });
}
