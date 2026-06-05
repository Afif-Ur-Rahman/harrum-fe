import { redirect } from "next/navigation";
import { getAuthCookies } from "@/utils/cookies";
import ChefSidebar from "@/ui/chef/navbar";

export default async function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authCookies = await getAuthCookies();

  if (!authCookies?.user || authCookies.user.type !== "chef") {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row md:flex-col md:gap-8">
      <ChefSidebar />
      <div className=" w-full max-w-560 overflow-hidden px-4 sm:px-6 lg:px-8 py-6">
        <main>{children}</main>
      </div>
    </div>
  );
}
