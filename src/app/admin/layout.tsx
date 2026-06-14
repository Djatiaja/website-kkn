import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminTopbar } from "@/components/layout/AdminTopbar";
import { AdminContent } from "@/components/layout/AdminContent";
import { SessionProvider } from "next-auth/react";
import { QueryProvider } from "@/components/providers/QueryProvider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }

  const user = {
    name: session.user.name || "User",
    email: session.user.email || "",
    role: session.user.role || "EDITOR",
  };

  return (
    <SessionProvider session={session}>
      <QueryProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-neutral-50">
            <AdminSidebar userRole={user.role as "ADMIN" | "EDITOR"} />
            <AdminTopbar
              breadcrumbs={[{ label: "Dashboard", href: "/admin" }]}
              user={user}
            />
            <AdminContent>{children}</AdminContent>
          </div>
        </SidebarProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
