import { getPool } from "@/lib/db";

const ORDER_BY = "ORDER BY `number` ASC, name ASC";

/** Objet JSON sérialisable (RowDataPacket, Decimal, BigInt). */
export function serializeRoomRow(row) {
  if (!row) return null;
  return JSON.parse(
    JSON.stringify(row, (_key, value) =>
      typeof value === "bigint" ? value.toString() : value,
    ),
  );
}

function serializeRelatedRow(row) {
  const data = serializeRoomRow(row);
  if (!data) return null;
  const { uid_room: _uidRoom, ...rest } = data;
  return rest;
}

async function loadGalleriesByRoomUids(pool, roomUids) {
  if (roomUids.length === 0) return new Map();

  const placeholders = roomUids.map(() => "?").join(", ");
  const [rows] = await pool.query(
    `SELECT uid_room, uid, photo_url, type, display_order
     FROM rooms_galleries
     WHERE uid_room IN (${placeholders})
     ORDER BY display_order ASC, uid ASC`,
    roomUids,
  );

  /** @type {Map<string, ReturnType<typeof serializeRelatedRow>[]>} */
  const byRoom = new Map();
  for (const row of rows) {
    const key = row.uid_room;
    if (!byRoom.has(key)) byRoom.set(key, []);
    byRoom.get(key).push(serializeRelatedRow(row));
  }
  return byRoom;
}

async function loadSettingsByRoomUids(pool, roomUids) {
  if (roomUids.length === 0) return new Map();

  const placeholders = roomUids.map(() => "?").join(", ");
  const [rows] = await pool.query(
    `SELECT uid_room, uid, has_tv, has_climatisation, has_balcony, has_wc, has_shower,
            has_kitchen, has_large_bed, has_multiple_bed
     FROM rooms_settings
     WHERE uid_room IN (${placeholders})`,
    roomUids,
  );

  /** @type {Map<string, ReturnType<typeof serializeRelatedRow>>} */
  const byRoom = new Map();
  for (const row of rows) {
    if (!byRoom.has(row.uid_room)) {
      byRoom.set(row.uid_room, serializeRelatedRow(row));
    }
  }
  return byRoom;
}

function attachRoomRelations(room, galleriesByRoom, settingsByRoom) {
  return {
    ...room,
    galleries: galleriesByRoom.get(room.uid) ?? [],
    settings: settingsByRoom.get(room.uid) ?? null,
  };
}

async function enrichRooms(pool, roomRows) {
  const rooms = roomRows.map(serializeRoomRow);
  const uids = rooms.map((r) => r.uid);
  const [galleriesByRoom, settingsByRoom] = await Promise.all([
    loadGalleriesByRoomUids(pool, uids),
    loadSettingsByRoomUids(pool, uids),
  ]);
  return rooms.map((room) =>
    attachRoomRelations(room, galleriesByRoom, settingsByRoom),
  );
}

/** Liste : `rooms` + `galleries` + `settings` par chambre. */
export async function listRooms() {
  const pool = getPool();
  const [rows] = await pool.query(`SELECT * FROM rooms ${ORDER_BY}`);
  return enrichRooms(pool, rows);
}

/** Détail par `uid` (colonne SQL). */
export async function getRoomByUid(uid) {
  const key = uid?.trim();
  if (!key) return null;

  const pool = getPool();
  const [rows] = await pool.query("SELECT * FROM rooms WHERE uid = ? LIMIT 1", [
    key,
  ]);
  if (!rows[0]) return null;

  const [room] = await enrichRooms(pool, [rows[0]]);
  return room;
}
