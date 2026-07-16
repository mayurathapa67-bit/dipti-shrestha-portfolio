import "server-only";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "dipti2025";

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export const AUTH_COOKIE_NAME = "dipti_admin_session";

export function createSessionToken(): string {
  const base = `${Date.now()}.${Math.random().toString(36).slice(2)}`;
  return Buffer.from(base).toString("base64");
}
