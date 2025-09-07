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
    </>
  )
}
