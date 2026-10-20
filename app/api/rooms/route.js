import { handleApiError, jsonOk } from "@/lib/apiResponse";
import { listRooms } from "@/lib/roomsDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/rooms — attributs SQL + count */
export async function GET() {
  try {
    const rooms = await listRooms();
    return jsonOk({ rooms, count: rooms.length });
  } catch (error) {
    return handleApiError(error);
  }
}
