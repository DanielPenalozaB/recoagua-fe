import { BarChart3, Frame, LifeBuoy, Send, Users } from "lucide-react"
import { useSession } from "next-auth/react"

export interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  isActive: boolean
  items: {
    title: string
    url: string
  }[]
}

export const useNavigation = () => {
  const { data: session } = useSession()

  const adminNavMain: NavItem[] = [
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
    }
  ]

  const moderatorNavMain: NavItem[] = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: BarChart3,
      isActive: false,
      items: [],
    }
  ]

  const getNavMain = (): NavItem[] => {
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

  return {
    navMain: getNavMain(),
    navSecondary: [
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
    ],
    projects: [
      {
        name: "Water Conservation",
        url: "/projects/water",
        icon: Frame,
      }
    ]
  }
}