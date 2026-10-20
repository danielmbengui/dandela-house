import mysql from "mysql2/promise";

/** @type {import("mysql2/promise").Pool | null} */
let pool = null;

const POOL_OPTIONS = {
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 5,
  idleTimeout: 60_000,
  enableKeepAlive: true,
};

/**
 * Connexion MySQL / MariaDB (cPanel).
 * Priorité : DB_HOST + DB_USER + DB_PASSWORD + … (évite les `#` non encodés dans DB_URL),
 * sinon DB_URL (mot de passe spécial → encoder en URL, ex. `#` → `%23`).
 */
export function getPoolConfig() {
  const host = process.env.DB_HOST?.trim();
  const user = process.env.DB_USER?.trim();
  const database = process.env.DB_NAME?.trim();

  if (host && user && database) {
    return {
      ...POOL_OPTIONS,
      host,
      port: Number(process.env.DB_PORT || 3306),
      user,
      password: process.env.DB_PASSWORD ?? "",
      database,
    };
  }

  const url = process.env.DB_URL?.trim();
  if (url) {
    return { ...POOL_OPTIONS, uri: url };
  }

  return null;
}

export function assertDatabaseConfigured() {
  const config = getPoolConfig();
  if (!config) {
    const err = new Error(
      "Configuration base de données manquante (DB_HOST, DB_NAME, DB_USER ou DB_URL).",
    );
    err.code = "DB_NOT_CONFIGURED";
    throw err;
  }
  return config;
}

export function getPool() {
  if (!pool) {
    pool = mysql.createPool(assertDatabaseConfigured());
  }
  return pool;
}
