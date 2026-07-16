import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const store = await cookies();
  if (store.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/admin");
  }
  return <AdminLogin />;
}
