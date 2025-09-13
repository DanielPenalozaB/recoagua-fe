// src/components/CitizenLayout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import {
  Calculator,
  LayoutGrid,
  Map,
  UserRound,
} from "lucide-react";
import { NavUser } from "@/components/ui/nav-user";
import { MapboxProvider } from "@/context/mapbox-context";

interface NavItem {
  route: string;
  icon: React.ComponentType<any>;
  label: string;
  isActive?: boolean;
}

export default function CitizenLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const isMapRoute = pathname === "/map";

  const navigationItems: NavItem[] = [
    { route: "/map", icon: Map, label: "Mapa", isActive: pathname === "/map" },
    { route: "/", icon: LayoutGrid, label: "Inicio", isActive: pathname === "/" },
    { route: "/calculator", icon: Calculator, label: "Calc", isActive: pathname === "/calculator" },
    { route: "/profile", icon: UserRound, label: "Perfil", isActive: pathname === "/profile" },
  ];

  const navigateTo = (route: string) => {
    router.push(route);
  };

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const userData = {
    name: session.user.name || "Usuario",
    email: session.user.email || "",
    avatar: session.user.image || "",
    role: session.user.role || "citizen",
    city: session.user.city || null,
  };

  return (
    <MapboxProvider>
      <div className="min-h-screen bg-gray-50 pb-20">
        <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between gap-2 px-4 py-3 w-full max-w-4xl mx-auto">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold text-gray-900">
                ¡Hola, {session.user.name?.split(" ")[0]}!
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <NavUser user={userData} validateMobile />
            </div>
          </div>
        </nav>
        <main className={`w-full ${!isMapRoute ? "max-w-4xl mx-auto" : ""}`}>
          {children}
        </main>
        <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[400]">
          <div className="flex items-center gap-2 p-2 rounded-2xl bg-white border border-gray-200 shadow-lg">
            {navigationItems.map((navItem) => (
              <button
                key={navItem.route}
                className={`flex flex-col items-center justify-center gap-1 h-14 w-14 rounded-xl transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                  navItem.isActive ? "bg-teal-100" : "bg-transparent hover:bg-gray-100"
                }`}
                onClick={() => navigateTo(navItem.route)}
              >
                <navItem.icon
                  size={20}
                  className={navItem.isActive ? "text-teal-600" : "text-gray-500"}
                />
                <span
                  className={`text-xs font-medium ${
                    navItem.isActive ? "text-teal-600" : "text-gray-500"
                  }`}
                >
                  {navItem.label}
                </span>
              </button>
            ))}
          </div>
        </nav>
      </div>
    </MapboxProvider>
  );
}
