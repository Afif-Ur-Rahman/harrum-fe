import { redirect } from "next/navigation";
import { getAuthCookies } from "@/utils/cookies";
import { AppSidebar } from "@/components/layout";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authCookies = await getAuthCookies();

  if (!authCookies?.user || authCookies.user.type !== "owner") {
    redirect("/auth/login");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.14),transparent_24%),radial-gradient(circle_at_top_right,rgba(244,114,182,0.12),transparent_26%),linear-gradient(180deg,#020617_0%,#0f172a_50%,#111827_100%)] text-white lg:flex-row">
      <AppSidebar />

      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,211,238,0.08),transparent_30%)]" />

        <main className="relative flex-1 overflow-y-auto px-3 pt-20 pb-3 sm:px-4 sm:pt-24 sm:pb-4 lg:px-6 lg:pt-6 lg:pb-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
