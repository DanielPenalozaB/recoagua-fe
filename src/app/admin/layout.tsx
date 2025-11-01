import { AppSidebar } from "@/components/ui/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<SidebarProvider>
			<div className="flex w-full h-screen">
				<AppSidebar />
				<div className="flex-1 overflow-auto">{children}</div>
			</div>
		</SidebarProvider>
	);
}
