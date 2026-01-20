import { Main } from "@/components/layout/main";
import { SidebarNav } from "@/components/settings/sidebar-nav";
import { ProfileDropdown, Separator, SidebarTrigger } from "@/components/ui";
import { ThemeSwitch } from "@/components/ui/theme-switch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Configuración",
};

export default function SettingsLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <>
      <header className="flex justify-between items-center gap-2 h-16 shrink-0">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
        </div>
        <div className="flex items-center gap-4 pr-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </header>
      <Main>
        <div className="flex flex-wrap justify-between items-center space-y-2">
          <div>
            <h2 className="font-bold text-2xl tracking-tight">Configuración</h2>
            <p className="text-muted-foreground">
              Gestiona los niveles de la plataforma
            </p>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="lg:flex-row flex-1 lg:space-x-12 lg:space-y-0 -mx-4 px-4 py-1 overflow-auto">
          <div className="flex flex-1 flex-col space-y-2 overflow-hidden md:space-y-2 lg:flex-row lg:space-y-0 lg:space-x-12">
            <aside className="top-0 lg:sticky lg:w-1/5">
              <SidebarNav className="p-0" items={[]} />
            </aside>
            <div className="flex w-full overflow-y-hidden p-1">{children}</div>
          </div>
        </div>
      </Main>
    </>
  );
}
