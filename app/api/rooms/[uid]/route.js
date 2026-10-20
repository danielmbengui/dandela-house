import { handleApiError, jsonError, jsonOk } from "@/lib/apiResponse";
import { getRoomByUid } from "@/lib/roomsDb";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/** GET /api/rooms/:uid */
export async function GET(_request, context) {
  try {
    const { uid } = await context.params;
    const room = await getRoomByUid(uid);

    if (!room) {
      return jsonError("Chambre introuvable.", 404, "ROOM_NOT_FOUND");
    }

    return jsonOk({ room });
  } catch (error) {
    return handleApiError(error);
  }
}
