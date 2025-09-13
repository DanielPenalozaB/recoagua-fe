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
  const router = useRouter();

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
        <button className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 transition-all">
          <Avatar className="rounded-lg w-8 h-8">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!validateMobile && (
            <>
              <div className="flex-1 grid min-w-0 text-sm text-left leading-tight">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-gray-500 text-xs truncate">{user.email}</span>
              </div>
              <ChevronsUpDown className="flex-shrink-0 ml-auto size-4" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-lg w-56"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
            <Avatar className="rounded-lg w-8 h-8">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid text-sm text-left leading-tight">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs truncate">{user.email}</span>
              <span className="text-muted-foreground text-xs truncate capitalize">
                {user.role}
                {user.city ? ` • ${user.city.name}` : ''}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleProfileClick}>
            <User className="mr-2 w-4 h-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSettingsClick}>
            <Settings className="mr-2 w-4 h-4" />
            <span>Ajustes</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {user.role === 'admin' && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => router.push('/admin')}>
                <Sparkles className="mr-2 w-4 h-4" />
                <span>Panel de Admin</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogoutClick}
          className="focus:bg-red-50 text-red-600 focus:text-red-700"
        >
          <LogOut className="mr-2 w-4 h-4 text-red-600 focus:text-red-700" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}