import CitizenGuidesSection from "@/components/citizen/dashboard/citizen-guides-section";
import Link from "next/link";

export default function CitizenDashboard() {
  return (
    <>
      <CitizenGuidesSection />
      <div className="flex items-center justify-between gap-4 p-6 bg-teal-100 sm:rounded-lg">
        <p className="text-[#115E59] text-xl">
          Ya calculaste el <strong>potencial hídrico?</strong>
        </p>
        <Link href="/calculator" className="rounded-lg py-2 cursor-pointer px-4 flex text-sm justify-center items-center gap-2 bg-teal-600 text-teal-50 whitespace-nowrap">
          Vamos a calcular
        </Link>
      </div>
      <section className="p-6">
        <div className="gap-5 flex flex-col p-6 bg-white border rounded-2xl">
          <div className="gap-2 flex flex-col">
            <h2 className="text-lg font-bold text-[#115E59]">Recolección anual</h2>
            <p className="text-neutral-500">El estado de tu tanque de agua de lluvia</p>
          </div>
          <div className="gap-2 flex flex-col">
            <div className="flex items-center justify-between gap-2 text-sm font-medium text-[#14B8A6]">
              <span>278 litros</span>
              <span>56%</span>
            </div>
            <div className="flex justify-start h-3 w-full bg-neutral-200 rounded-full">
              <span className="bg-teal-500 h-3 rounded-full w-1/2"></span>
            </div>
          </div>
          <div className="flex items-center gap-4 w-full">
            <div className="flex flex-col gap-4 bg-neutral-100 p-4 pt-2 rounded-lg w-full">
              <span className="text-neutral-400 text-sm font-medium">Capacidad</span>
              <span className="text-[#14B8A6] text-[40px] font-bold leading-[1]">200L</span>
            </div>
            <div className="flex flex-col gap-4 bg-neutral-100 p-4 pt-2 rounded-lg w-full">
              <span className="text-neutral-400 text-sm font-medium">Agua ahorrada</span>
              <span className="text-[#14B8A6] text-[40px] font-bold leading-[1]">350L</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
