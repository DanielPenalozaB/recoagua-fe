// src/components/ui/nav-user.tsx
"use client";

import { ChevronsUpDown, LogOut, Sparkles, User2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { handleLogout } from "@/lib/auth-utils";
import { getInitials } from "@/lib/utils";
import { User, UserRole } from "@/types/user";
import { usePathname, useRouter } from "next/navigation";

interface NavUserProps {
  readonly user: User;
  readonly validateMobile?: boolean;
}

export function NavUser({ user, validateMobile = false }: NavUserProps) {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  const handleLogoutClick = async () => {
    await handleLogout();
    router.push("/auth/signin");
  };

  const handleProfileClick = () => {
    router.push("/profile");
  };

  const renderAdminPanelMenu = () => {
    if (user.role !== "admin") {
      return;
    }

    if (isAdminRoute === true) {
      return (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-neutral-800"
              onClick={() => router.push("/")}
            >
              <Sparkles className="mr-2 w-4 h-4" />
              <span>Panel de Ciudadano</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      );
    }

    if (!isAdminRoute) {
      return (
        <>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-neutral-800"
              onClick={() => router.push("/admin")}
            >
              <Sparkles className="mr-2 w-4 h-4" />
              <span>Panel de Admin</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </>
      );
    }
  };

  const handleUserRole = (role: UserRole) => {
    switch (role) {
      case UserRole.ADMIN:
        return "Admin";
      case UserRole.MODERATOR:
        return "Moderador";
      case UserRole.CITIZEN:
      default:
        return "Ciudadano";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-3 hover:bg-gray-100 p-1 rounded-lg focus-visible:ring-2 focus-visible:ring-blue-500 transition-all">
          <Avatar className="rounded-lg w-8 h-8">
            <AvatarImage alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
          {!validateMobile && (
            <>
              <div className="flex-1 grid min-w-0 text-sm text-left leading-tight">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-gray-500 text-xs truncate">
                  {user.email}
                </span>
              </div>
              <ChevronsUpDown className="flex-shrink-0 ml-auto size-4" />
            </>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="rounded-lg w-56 bg-gray-50"
        align="end"
        sideOffset={4}
      >
        <DropdownMenuLabel className="p-0 font-normal">
          <div className="flex items-center gap-2 px-1 py-1.5 text-sm text-left">
            <Avatar className="rounded-lg w-8 h-8">
              <AvatarImage alt={user.name} />
              <AvatarFallback className="rounded-lg">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 grid text-sm text-left leading-tight text-neutral-800">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs truncate">{user.email}</span>
              <span className="text-muted-foreground text-xs truncate capitalize">
                {handleUserRole(user.role)}
                {user.city ? ` • ${user.city.name}` : ""}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem
            className="text-neutral-800"
            onClick={handleProfileClick}
          >
            <User2 className="mr-2 w-4 h-4" />
            <span>Perfil</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        {renderAdminPanelMenu()}
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
  );
}
