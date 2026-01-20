"use client";

import {
  Award,
  BarChart3,
  BookOpen,
  Component,
  Droplets,
  Flag,
  Globe,
  Layers,
  LifeBuoy,
  MapPin,
  Target,
  Trophy,
  Users,
} from "lucide-react";
import * as React from "react";

import { NavSecondary } from "@/components/ui/nav-secondary";
import { NavUser } from "@/components/ui/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { User, UserRole, UserStatus } from "@/types/user";
import { useSession } from "next-auth/react";
import { NavMainGroups } from "./nav-main-groups";
import { Skeleton } from "./skeleton";

export const adminNavGroups = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: BarChart3,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    title: "Contenido",
    items: [
      {
        title: "Guías",
        url: "/admin/guides",
        icon: BookOpen,
        isActive: false,
        items: [
          {
            title: "Todas las guías",
            url: "/admin/guides",
          },
          {
            title: "Nueva guía",
            url: "/admin/guides/create",
          },
        ],
      },
    ],
  },
  {
    title: "Ubicaciones",
    items: [
      {
        title: "Ciudades",
        url: "/admin/cities",
        icon: MapPin,
        isActive: false,
        items: [],
      },
      {
        title: "Regiones",
        url: "/admin/regions",
        icon: Globe,
        isActive: false,
        items: [],
      },
      {
        title: "Zonas",
        url: "/admin/zones",
        icon: Flag,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    title: "Gamificación",
    items: [
      {
        title: "Retos",
        url: "/admin/challenges",
        icon: Target,
        isActive: false,
        items: [],
      },
      {
        title: "Niveles",
        url: "/admin/levels",
        icon: Award,
        isActive: false,
        items: [],
      },
      {
        title: "Insignias",
        url: "/admin/badges",
        icon: Trophy,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    title: "Administración",
    items: [
      {
        title: "Usuarios",
        url: "/admin/users",
        icon: Users,
        isActive: false,
        items: [],
      },
    ],
  },
];

const moderatorNavGroups = [
  {
    title: "Principal",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: BarChart3,
        isActive: false,
        items: [],
      },
    ],
  },
  {
    title: "Contenido",
    items: [
      {
        title: "Guías",
        url: "/admin/guides",
        icon: BookOpen,
        isActive: false,
        items: [
          {
            title: "Todas las guías",
            url: "/admin/guides",
          },
          {
            title: "Nueva guía",
            url: "/admin/guides/create",
          },
        ],
      },
      {
        title: "Módulos",
        url: "/admin/modules",
        icon: Component,
        isActive: false,
        items: [
          {
            title: "Todos los módulos",
            url: "/admin/modules",
          },
        ],
      },
      {
        title: "Bloques",
        url: "/admin/blocks",
        icon: Layers,
        isActive: false,
        items: [
          {
            title: "Todos los bloques",
            url: "/admin/blocks",
          },
        ],
      },
    ],
  },
];

const navSecondary = [
  {
    title: "Soporte",
    url: "/support",
    icon: LifeBuoy,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession();

  const getNavGroups = () => {
    if (!session?.user?.role) return [];

    switch (session.user.role.toLowerCase()) {
      case "admin":
        return adminNavGroups;
      case "moderator":
        return moderatorNavGroups;
      default:
        return [];
    }
  };

  if (status === "loading") {
    return (
      <Sidebar variant="inset" {...props}>
        <div className="flex flex-col p-2">
          <Skeleton className="bg-neutral-200 h-12" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col p-2">
            <div className="flex flex-col p-2 h-8">
              <Skeleton className="bg-neutral-200 w-1/2 h-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="bg-neutral-200 h-8" />
            </div>
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-col p-2 h-8">
              <Skeleton className="bg-neutral-200 w-1/2 h-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
            </div>
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-col p-2 h-8">
              <Skeleton className="bg-neutral-200 w-1/2 h-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
            </div>
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-col p-2 h-8">
              <Skeleton className="bg-neutral-200 w-1/2 h-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
              <Skeleton className="bg-neutral-200 h-8" />
            </div>
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-col p-2 h-8">
              <Skeleton className="bg-neutral-200 w-1/2 h-full" />
            </div>
            <div className="flex flex-col gap-1">
              <Skeleton className="bg-neutral-200 h-8" />
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  if (!session) {
    return null;
  }

  const userData: User = {
    id: session.user.id || 0,
    name: session.user.name || "Usuario",
    email: session.user.email || "",
    role: session.user.role || UserRole.CITIZEN,
    city: session.user.city || null,
    language: session.user.language || "es",
    createdAt: "",
    updatedAt: "",
    status: session.user.status || UserStatus.ACTIVE,
    experience: 0,
    level: null,
    completedGuides: [],
    inProgressGuides: [],
    levelsObtained: [],
    badges: [],
    challenges: [],
    completedGuidesCount: 0,
    badgesCount: 0,
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="flex justify-center items-center bg-teal-500 rounded-lg size-8 aspect-square text-sidebar-primary-foreground">
                  <Droplets className="size-4" />
                </div>
                <div className="flex-1 grid text-sm text-left leading-tight">
                  <span className="font-medium truncate">Gestión RecoAgua</span>
                  <span className="text-xs truncate">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMainGroups groups={getNavGroups()} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
