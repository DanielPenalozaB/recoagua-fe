"use client"

import * as React from "react"
import {
  BookOpen, Command,
  Frame,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2, Users,
  FileText,
  BarChart3
} from "lucide-react"

import { NavMain } from "@/components/ui/nav-main"
import { NavProjects } from "@/components/ui/nav-projects"
import { NavSecondary } from "@/components/ui/nav-secondary"
import { NavUser } from "@/components/ui/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

// Admin-specific navigation items
const adminNavMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    isActive: false,
    items: [],
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: Users,
    isActive: false,
    items: [],
  },
  {
    title: "Guides",
    url: "/admin/guides",
    icon: BookOpen,
    isActive: false,
    items: [
      {
        title: "All Guides",
        url: "/admin/guides",
      },
      {
        title: "Create New",
        url: "/admin/guides/create",
      },
      {
        title: "Categories",
        url: "/admin/guides/categories",
      },
    ],
  },
  {
    title: "Content",
    url: "/admin/content",
    icon: FileText,
    isActive: false,
    items: [
      {
        title: "Modules",
        url: "/admin/content/modules",
      },
      {
        title: "Blocks",
        url: "/admin/content/blocks",
      },
    ],
  },
  {
    title: "Analytics",
    url: "/admin/analytics",
    icon: PieChart,
    isActive: false,
    items: [],
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings2,
    isActive: false,
    items: [
      {
        title: "General",
        url: "/admin/settings/general",
      },
      {
        title: "Security",
        url: "/admin/settings/security",
      },
      {
        title: "Permissions",
        url: "/admin/settings/permissions",
      },
    ],
  },
]

const moderatorNavMain = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: BarChart3,
    isActive: false,
    items: [],
  },
  {
    title: "Guides",
    url: "/admin/guides",
    icon: BookOpen,
    isActive: false,
    items: [
      {
        title: "All Guides",
        url: "/admin/guides",
      },
      {
        title: "Create New",
        url: "/admin/guides/create",
      },
    ],
  },
  {
    title: "Content",
    url: "/admin/content",
    icon: FileText,
    isActive: false,
    items: [
      {
        title: "Modules",
        url: "/admin/content/modules",
      },
      {
        title: "Blocks",
        url: "/admin/content/blocks",
      },
    ],
  },
]

const navSecondary = [
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: Send,
  },
]

const projects = [
  {
    name: "Water Conservation",
    url: "/projects/water",
    icon: Frame,
  },
  {
    name: "Community Outreach",
    url: "/projects/community",
    icon: PieChart,
  },
  {
    name: "Education Program",
    url: "/projects/education",
    icon: Map,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, status } = useSession()

  // Get navigation items based on user role
  const getNavMain = () => {
    if (!session?.user?.role) return []
    
    switch (session.user.role.toLowerCase()) {
      case 'admin':
        return adminNavMain
      case 'moderator':
        return moderatorNavMain
      default:
        return []
    }
  }

  if (status === "loading") {
    return (
      <Sidebar variant="inset" {...props}>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Sidebar>
    )
  }

  if (!session) {
    return null
  }

  const userData = {
    name: session.user.name || "User",
    email: session.user.email || "",
    avatar: session.user.image || "",
    role: session.user.role || "user",
    city: session.user.city || null,
  }

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Water Management</span>
                  <span className="truncate text-xs">Admin Panel</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={getNavMain()} />
        <NavProjects projects={projects} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}