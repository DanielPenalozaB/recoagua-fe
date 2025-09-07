// src/components/ui/nav-user.tsx
"use client"

import {
  ChevronsUpDown,
  LogOut,
  User,
  Settings,
  Sparkles,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { handleLogout } from "@/lib/auth-utils"
import { getInitials } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface NavUserProps {
  readonly user: {
    name: string
    email: string
    avatar: string
    role: string
    city: { id: number; name: string } | null
  },
  readonly validateMobile?: boolean
}

export function NavUser({
  user,
  validateMobile = false,
}: NavUserProps) {
  const router = useRouter()
  const isMobile = useIsMobile();

  const handleLogoutClick = async () => {
    await handleLogout()
    router.push("/auth/signin")
  }

  const handleProfileClick = () => {
    router.push("/profile")
  }

  const handleSettingsClick = () => {
    router.push("/settings")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 p-2 rounded-lg transition-all hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-blue-500">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!isMobile && (
            <>
              <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-gray-500">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 flex-shrink-0" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 rounded-lg"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.name}</span>
              <span className="truncate text-xs">{user.email}</span>
              <span className="truncate text-xs text-muted-foreground capitalize">
                {user.role}
                {user.city ? ` • ${user.city.name}` : ''}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 h-4 w-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Ajustes</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {user.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/admin/settings')}>
                <Sparkles className="mr-2 h-4 w-4" />
                <span>Configuración de Admin</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="text-red-600 focus:text-red-700 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4 text-red-600 focus:text-red-700" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}