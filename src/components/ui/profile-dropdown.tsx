"use client"

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { handleLogout } from '@/lib/auth-utils';
import { getInitials } from '@/lib/utils';
import { LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Skeleton } from './skeleton';

export function ProfileDropdown() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <Skeleton className="bg-neutral-200 rounded-full w-8 h-8" />
    )
  }

  if (!session) {
    return null
  }

  const user = {
    name: session.user.name ?? "User",
    email: session.user.email ?? "",
    avatar: session.user.image ?? "",
    role: session.user.role ?? "user",
    city: session.user.city ?? null,
  }
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='relative rounded-full w-8 h-8'>
          <Avatar className='w-8 h-8'>
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="rounded-lg">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-56' align='end' forceMount>
        <DropdownMenuLabel className='font-normal'>
          <div className='flex flex-col gap-1.5'>
            <p className='font-medium text-sm leading-none'>{user.name}</p>
            <p className='text-muted-foreground text-xs leading-none'>
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href='admin/profile'>
              Perfil
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href='/settings'>
              Configuración
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="focus:bg-red-50 text-red-600 focus:text-red-700"
        >
          <LogOut className="size-3 text-red-600 focus:text-red-700" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
