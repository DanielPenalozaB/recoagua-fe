// src/app/(citizen)/guides/page.tsx
"use client";

import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import GuidesFilters from "@/components/citizen/guides/guides-filters";
import { CommingSoonIcon } from "@/components/icons";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/use-debounce";
import { useGuides } from "@/hooks/use-guides";
import { cn } from "@/lib/utils";
import type { Guide, GuideStatus } from "@/types/guide";

export default function CitizenGuidesPage() {
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState<GuideStatus>();
  const [search, setSearch] = useState<string>();
  const debouncedSearch = useDebounce(search, 1000);

  const {
    data: guidesData,
    isLoading: loadingGuides,
    error,
  } = useGuides({
    page: currentPage,
    limit: 9,
    status,
    name: debouncedSearch,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderContent = () => {
    if (loadingGuides) {
      return (
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <Skeleton
              key={`guide-loading-${index.toString()}`}
              className="rounded-2xl w-3xs min-w-3xs h-[338px] bg-neutral-100"
            />
          ))}
        </>
      );
    }

    if (error) {
      return (
        <div className="flex justify-center items-center col-span-3 py-12">
          <div className="text-center">
            <p className="font-medium text-red-600">
              Ocurrió un error al cargar las guías
            </p>
            <p className="mt-1 text-gray-500 text-sm">
              Por favor, intenta nuevamente
            </p>
          </div>
        </div>
      );
    }

    if (guidesData?.data?.length && guidesData.data.length > 0) {
      return guidesData.data.map((guide: Guide, index: number) => (
        <div
          key={guide.id}
          className={cn(
            "flex flex-col gap-4 p-6 border rounded-2xl hover:outline-[#CCFBF1] hover:outline-2 min-w-3xs max-w-3xs min-h-max max-h-[338px] transition-all duration-300 ease-in-out",
            guide.isCompleted === true
              ? "bg-neutral-500 border-neutral-600"
              : "bg-white border-neutral-200"
          )}
        >
          <div className="flex items-center gap-4">
            <span
              className={cn(
                "font-bold text-2xl",
                guide.isCompleted === true ? "text-white" : "text-neutral-600"
              )}
            >
              {guide.name}
            </span>
          </div>
          <p
            className={cn(
              "h-full",
              guide.isCompleted === true
                ? "text-neutral-300"
                : "text-neutral-600"
            )}
          >
            {guide.description}
          </p>
          <div
            className={cn(
              "flex items-center gap-2",
              guide.isCompleted === true ? "text-neutral-400" : "text-[#14B8A6]"
            )}
          >
            <Clock className="size-4" />
            <span>{guide.estimatedDuration} min</span>
          </div>
          <a
            href={`/guides/${guide.id}`}
            className={cn(
              "flex justify-center items-center gap-2 px-4 py-2 rounded-lg w-full transition-all duration-200 ease-in-out cursor-pointer",
              guide.isCompleted === true
                ? "bg-neutral-200 hover:bg-teal-100 text-neutral-500"
                : "bg-[#0D9488] hover:bg-[#14b8a9] text-[#CCFBF1]"
            )}
            onClick={(e) => {
              e.preventDefault();
              router.push(`/guides/${guide.id}`);
            }}
          >
            {guide.isCompleted === true ? "Repasar lección" : "Iniciar lección"}
          </a>
        </div>
      ));
    } else {
      return (
        <div className="flex flex-col justify-center items-center gap-2 col-span-3 py-12">
          <CommingSoonIcon className="min-w-3xs max-w-3xs" />
          <span className="font-bold text-neutral-400 text-lg">
            No hay guías disponibles
          </span>
          <p className="text-neutral-500 text-sm">
            Vuelve pronto para nuevas guías
          </p>
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
            <h2 className="font-bold text-xl text-neutral-600">
              Guías interactivas
            </h2>
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
