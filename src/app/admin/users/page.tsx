"use client"

import { Main } from '@/components/layout/main'
import ThemeSwitch from '@/components/ui/client-theme-switch'
import { ProfileDropdown } from '@/components/ui/profile-dropdown'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { UsersTable, useUsers } from '@/features/users'
import { UsersPrimaryButtons } from '@/features/users/components/users-primary-buttons'
import { UsersProvider } from '@/features/users/components/users-provider'
import { useDataTable } from '@/hooks/use-data-table'
import { UserFilterDto } from '@/types/user'

export default function Users() {
  // Generic table state management with Users-specific filter builder
  const table = useDataTable<UserFilterDto>({
    defaultPageSize: 10,
    buildFilters: (state) => {
      const filters: UserFilterDto = {
        // Pagination
        page: state.pagination.pageIndex + 1,
        limit: state.pagination.pageSize,
      }

      // Global filter (name search)
      if (state.globalFilter.trim()) {
        filters.name = state.globalFilter.trim()
      }

      // Column filters
      state.columnFilters.forEach(filter => {
        switch (filter.id) {
          case 'status':
            filters.status = filter.value as string | string[]
            break
          case 'role':
            filters.role = filter.value as string | string[]
            break
          case 'cityId':
            filters.cityId = filter.value as number
            break
          case 'name':
            filters.name = filter.value as string
            break
          // Add other filters as needed for your users table
          default:
            console.warn(`Unknown column filter: ${filter.id}`)
            break
        }
      })

      return filters
    }
  })

  // Fetch users with server-side filtering
  const { data, isLoading, error } = useUsers(table.filters)

  return (
    <UsersProvider>
      <header className="flex justify-between items-center gap-2 h-16 shrink-0">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
        </div>
        <div className="flex items-center gap-4 pr-2">
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </header>
      <Main>
        <div className='flex flex-wrap justify-between items-center space-y-2 mb-2'>
          <div>
            <h2 className='font-bold text-2xl tracking-tight'>User List</h2>
            <p className='text-muted-foreground'>
              Manage your users and their roles here.
            </p>
          </div>
          <UsersPrimaryButtons />
        </div>
        <div className='lg:flex-row flex-1 lg:space-x-12 lg:space-y-0 -mx-4 px-4 py-1 overflow-auto'>
          <UsersTable
            data={data?.data || []}
            tableState={table}
            isLoading={isLoading}
            error={error}
            totalCount={data?.meta.totalItems || 0}
            pageCount={data?.meta.totalPages || 0}
          />
        </div>
      </Main>
    </UsersProvider>
  )
}