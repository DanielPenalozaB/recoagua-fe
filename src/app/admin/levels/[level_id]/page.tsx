import { Main } from "@/components/layout/main";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
	ProfileDropdown,
	Separator,
	SidebarTrigger,
	ThemeSwitch,
} from "@/components/ui";
import { LevelsCreateEditForm } from "@/features/levels";

export default async function EditLevelPage({
	params,
}: {
	params: Promise<{ level_id: string }>;
}) {
	const { level_id } = await params;

	return (
		<>
			<header className="flex justify-between items-center gap-2 h-16 shrink-0">
				<div className="flex items-center gap-2 px-4">
					<SidebarTrigger className="-ml-1" />
					<Separator
						orientation="vertical"
						className="mr-2 data-[orientation=vertical]:h-4"
					/>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="/admin/challenges">Retos</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Editar reto</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</div>
				<div className="flex items-center gap-4 pr-2">
					<ThemeSwitch />
					<ProfileDropdown />
				</div>
			</header>
			<Main className="flex flex-col gap-6 mx-auto p-4 max-w-2xl">
				<div className="flex flex-wrap justify-between items-center space-y-2 mb-2">
					<div>
						<h2 className="font-bold text-2xl tracking-tight">Editar reto</h2>
						<p className="text-muted-foreground">Edita los detalles del reto</p>
					</div>
				</div>
				<LevelsCreateEditForm levelId={Number(level_id)} />
			</Main>
		</>
	);
}
