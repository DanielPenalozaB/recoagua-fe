'use client';

import { useGuides } from "@/hooks/use-guides";
import { Guide, GuideStatus } from "@/types/guide";
import { Clock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CitizenGuidesSection() {
  const { push } = useRouter();

  const { data: guidesData, isLoading: loadingGuides, error } = useGuides({
    status: GuideStatus.PUBLISHED,
    limit: 5
  });

  return (
      <div className="flex flex-col gap-5 py-6 pl-6 w-full overflow-hidden">
        <div className="flex flex-col-reverse sm:flex-row gap-2 justify-between sm:items-center items-end pr-6">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-xl">Guías interactivas</h2>
            <p className="font-medium">Aprende sobre los distintos métodos de recolección de agua</p>
          </div>
          <a
            href="/guides"
            className="h-fit cursor-pointer flex text-sm justify-center font-bold items-center text-[#0D9488] whitespace-nowrap hover:underline"
            onClick={(e) => {
              e.preventDefault();
              push("/guides");
            }}
          >
            Ver todas las guías
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pr-6">
          {loadingGuides ? (
            <div>Loading guides...</div>
          ) : error ? (
            <div>Error loading guides</div>
          ) : (
            guidesData?.data?.map((guide: Guide, index: number) => (
              <div
                key={guide.id}
                className={`gap-4 flex flex-col p-6 min-w-3xs max-w-3xs border rounded-2xl hover:outline-2 hover:outline-[#CCFBF1] transition-all duration-300 ease-in-out ${
                  index === 0 ? "bg-[#0D9488] border-[#0D9488]" : "bg-white border-neutral-200"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-bold text-2xl ${
                    index === 0 ? "text-white" : "text-[#0D9488]"
                  }`}>
                    {guide.name}
                  </span>
                </div>
                <p className={`h-full ${
                  index === 0 ? "text-[#CCFBF1]" : "text-[#0D9488]"
                }`}>
                  {guide.description}
                </p>
                <div className={`flex items-center gap-2 ${
                  index === 0 ? "text-[#5EEAD4]" : "text-[#14B8A6]"
                }`}>
                  <Clock className="size-4" />
                  <span>{guide.estimatedDuration} min</span>
                </div>
                <a
                  href={`/guide/${guide.id}`}
                  className={`w-full rounded-lg py-2 cursor-pointer px-4 flex justify-center items-center gap-2 transition-all duration-200 ease-in-out ${
                    index === 0
                      ? "bg-[#CCFBF1] hover:bg-[#f0fdfc] text-[#0D9488]"
                      : "bg-[#0D9488] hover:bg-[#14b8a9] text-[#CCFBF1]"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    push(`/guide/${guide.id}`);
                  }}
                >
                  Iniciar lección
                </a>
              </div>
            ))
          )}
        </div>
      </div>
  )
}