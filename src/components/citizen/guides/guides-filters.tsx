'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { capitalize } from "@/lib/utils";
import { GuideStatus } from "@/types/guide";
import { FunnelXIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface GuidesFiltersProps {
  readonly search?: string,
  readonly setSearch: Dispatch<SetStateAction<string | undefined>>
  readonly status?: GuideStatus,
  readonly setStatus: Dispatch<SetStateAction<GuideStatus | undefined>>
}

export default function GuidesFilters({
  search,
  setSearch,
  status,
  setStatus
}: GuidesFiltersProps) {
  const resetFilters = () => {
    setSearch('');
    setStatus(undefined);
  }

  return (
    <div className="flex items-center gap-4 flex-wrap w-full justify-end">
      {search || status && (
        <Button variant='ghost' className="text-teal-500 hover:text-teal-500" onClick={resetFilters}>
          <FunnelXIcon className="size-4 text-teal-500" />
          Limpiar filtros
        </Button>
      )}
      <Select value={status ?? ''} onValueChange={(value) => setStatus(value as GuideStatus)}>
        <SelectTrigger id="status" className='w-48 bg-white'>
          <SelectValue placeholder="Selecciona un estado" />
        </SelectTrigger>
        <SelectContent>
          { Object.keys(GuideStatus).map((status) => (<SelectItem value={status} key={status}>{capitalize(status)}</SelectItem>)) }
        </SelectContent>
      </Select>
      <Input
        type="search"
        placeholder="Buscar"
        className="bg-white w-40"
        value={search ?? ''}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}
