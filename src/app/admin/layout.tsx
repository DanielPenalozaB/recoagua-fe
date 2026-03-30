import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Panel de administración",
};

import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <main id="main-content" className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
