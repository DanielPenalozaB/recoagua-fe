// src/app/(citizen)/guides/page.tsx
'use client';

import { useState } from 'react';
import { CommingSoonIcon } from "@/components/icons";
import { useGuides } from "@/hooks/use-guides";
import { Guide, GuideStatus } from "@/types/guide";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { Pagination } from "@/components/ui/pagination";
import GuidesFilters from '@/components/citizen/guides/guides-filters';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { Skeleton } from '@/components/ui/skeleton';

export default function CitizenGuidesPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<GuideStatus>();
  const [search, setSearch] = useState<string>();
  const debouncedSearch  = useDebounce(search, 1000);

  const { data: guidesData, isLoading: loadingGuides, error } = useGuides({
    page: currentPage,
    limit: 9,
    status,
    name: debouncedSearch
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderContent = () => {
    if (loadingGuides) {
      return (
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={`guide-loading-${index.toString()}`}
              className="rounded-2xl w-3xs min-w-3xs h-[338px]"
            />
          ))}
        </>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center col-span-3 py-12">
          <div className="text-center">
            <p className="font-medium text-red-600">Ocurrió un error al cargar las guías</p>
            <p className="mt-1 text-gray-500 text-sm">Por favor, intenta nuevamente</p>
          </div>
        </div>
      );
    }

    if (guidesData?.data?.length && guidesData.data.length > 0) {
      return guidesData.data.map((guide: Guide, index: number) => (
        <div
          key={guide.id}
          className={cn(
            'flex flex-col gap-4 p-6 border rounded-2xl hover:outline-[#CCFBF1] hover:outline-2 min-w-3xs max-w-3xs transition-all duration-300 ease-in-out',
            index === 0 ? "bg-[#0D9488] border-[#0D9488]" : "bg-white border-neutral-200"
          )}
        >
          <div className="flex items-center gap-4">
            <span className={cn(
              'font-bold text-2xl',
              index === 0 ? "text-white" : "text-[#0D9488]"
            )}>
              {guide.name}
            </span>
          </div>
          <p className={cn(
            'h-full',
            index === 0 ? "text-[#CCFBF1]" : "text-[#0D9488]"
          )}>
            {guide.description}
          </p>
          <div className={cn('flex items-center gap-2',
            index === 0 ? "text-[#5EEAD4]" : "text-[#14B8A6]"
          )}>
            <Clock className="size-4" />
            <span>{guide.estimatedDuration} min</span>
          </div>
          <a
            href={`/guides/${guide.id}`}
            className={cn(
              'flex justify-center items-center gap-2 px-4 py-2 rounded-lg w-full transition-all duration-200 ease-in-out cursor-pointer',
              index === 0 ? "bg-[#CCFBF1] hover:bg-[#f0fdfc] text-[#0D9488]" : "bg-[#0D9488] hover:bg-[#14b8a9] text-[#CCFBF1]"
            )}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/guides/${guide.id}`);
            }}
          >
            Iniciar lección
          </a>
        </div>
      ));
    } else {
      return (
        <div className="flex flex-col justify-center items-center gap-2 col-span-3 py-12">
          <CommingSoonIcon className="min-w-3xs max-w-3xs" />
          <span className="font-bold text-neutral-400 text-lg">No hay guías disponibles</span>
          <p className="text-neutral-500 text-sm">Vuelve pronto para nuevas guías</p>
        </div>
      );
    }
  };

  const totalPages = guidesData?.meta.totalPages || 1;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col flex-1 gap-5 py-6 pl-6 w-full overflow-hidden">
        <div className="flex sm:flex-row flex-col-reverse justify-between items-end sm:items-center gap-2 pr-6">
          <div className="flex flex-col gap-2 w-full">
            <h2 className="font-bold text-xl">Guías interactivas</h2>
            <GuidesFilters
              search={search}
              setSearch={setSearch}
              status={status}
              setStatus={setStatus}
            />
          </div>
        </div>
        <div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 p-6">
          {renderContent()}
        </div>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-4"
      />
    </div>
  );
}