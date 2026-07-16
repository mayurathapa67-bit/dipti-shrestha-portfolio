import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getContent } from "@/lib/content";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const store = await cookies();
  if (!store.get(AUTH_COOKIE_NAME)?.value) {
    redirect("/admin/login");
  }
  const content = await getContent();
  return <AdminDashboard initialContent={content} />;
}
