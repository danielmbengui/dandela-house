import { NextResponse } from "next/server";

export function jsonOk(body, init) {
  return NextResponse.json(body, { status: 200, ...init });
}

export function jsonError(message, status = 500, code) {
  return NextResponse.json(
    { error: message, ...(code ? { code } : {}) },
    { status },
  );
}

export function handleApiError(error) {
  if (error?.code === "DB_NOT_CONFIGURED") {
    return jsonError("Service base de données non configuré.", 503, "DB_NOT_CONFIGURED");
  }
  if (error?.code === "ER_NO_SUCH_TABLE") {
    return jsonError(
      "Table « rooms » absente. Exécuter sql/rooms.sql sur la base.",
      503,
      "DB_SCHEMA_MISSING",
    );
  }
  if (error?.code === "ER_BAD_FIELD_ERROR") {
    return jsonError(
      "Schéma de la table « rooms » incompatible avec l’API. Voir sql/rooms.sql.",
      503,
      "DB_SCHEMA_MISMATCH",
    );
  }
  if (error?.code === "ECONNREFUSED" || error?.code === "ENOTFOUND") {
    return jsonError("Impossible de joindre le serveur MySQL.", 503, "DB_UNREACHABLE");
  }
  console.error("[api]", error);
  return jsonError("Erreur serveur.", 500, "INTERNAL_ERROR");
}
