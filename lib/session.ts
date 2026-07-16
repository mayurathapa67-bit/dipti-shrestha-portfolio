import "server-only";
import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "./auth";

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(AUTH_COOKIE_NAME)?.value;
  return Boolean(token);
}
