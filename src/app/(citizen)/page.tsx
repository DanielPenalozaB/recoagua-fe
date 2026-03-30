"use client";

import Link from "next/link";
import CitizenGuidesSection from "@/components/citizen/dashboard/citizen-guides-section";
import { useUserProfile } from "@/hooks/use-user";
import { Droplet, Trophy, Star, MapPin } from "lucide-react";

export default function CitizenDashboard() {
  const { data: userResponse, isLoading } = useUserProfile();
  const user = userResponse?.data;

  if (isLoading) {
    return (
      <div aria-live="polite" aria-busy="true" aria-label="Cargando datos del perfil" className="p-6 space-y-6">
        <div className="h-48 bg-neutral-100 motion-safe:animate-pulse rounded-xl" />
        <div className="h-48 bg-neutral-100 motion-safe:animate-pulse rounded-xl" />
        <span className="sr-only">Cargando…</span>
      </div>
    );
  }

  return (
    <>
      <CitizenGuidesSection />

      {/* Gamification & Status Section */}
      <section className="px-6 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Level & XP Card */}
          <div className="bg-white border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#115E59] flex items-center gap-2">
                <Trophy aria-hidden="true" className="size-5 text-amber-500" />
                Tu Progreso
              </h2>
              <span className="bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-sm font-medium">
                Nivel: {user?.level?.name || "Novato"}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Experiencia</span>
                <span className="font-bold">{user?.experience || 0} XP</span>
              </div>
              <progress
                aria-label="Progreso de experiencia hacia el siguiente nivel"
                value={Math.min(((user?.experience || 0) % 1000) / 10, 100)}
                max={100}
                aria-valuetext={`${user?.experience || 0} XP — ${Math.min(((user?.experience || 0) % 1000) / 10, 100).toFixed(0)}% hacia el siguiente nivel`}
                className="w-full h-3 rounded-full overflow-hidden [&::-webkit-progress-bar]:bg-neutral-100 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-value]:bg-amber-500 [&::-webkit-progress-value]:rounded-full [&::-moz-progress-bar]:bg-amber-500 [&::-moz-progress-bar]:rounded-full"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Completa más guías y desafíos para subir de nivel.
              </p>
            </div>

            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2 bg-amber-50 px-3 py-2 rounded-lg">
                <Star aria-hidden="true" className="size-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  {user?.badgesCount || 0} Insignias
                </span>
              </div>
            </div>
          </div>

          {/* Environmental Impact / City Data */}
          <div className="bg-white border rounded-2xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#115E59] flex items-center gap-2">
                <MapPin aria-hidden="true" className="size-5 text-teal-600" />
                Tu Ciudad
              </h2>
              <span className="text-sm text-neutral-500">
                {user?.city?.name || "Sin ciudad"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-xl flex flex-col">
                <span className="text-teal-600 text-sm font-medium mb-1">
                  Precipitación
                </span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-teal-800">
                    {user?.city?.rainfall || 0}
                  </span>
                  <span className="text-xs text-teal-600 mb-1">mm/año</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-xl flex flex-col">
                <span className="text-blue-600 text-sm font-medium mb-1">
                  Potencial
                </span>
                <div className="flex items-end gap-1">
                  <span className="text-2xl font-bold text-blue-800">High</span>
                  {/* Placeholder for calculation status */}
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <Link
                href="/calculator"
                className="w-full rounded-lg py-2 cursor-pointer px-4 flex text-sm justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
              >
                <Droplet aria-hidden="true" className="size-4" />
                Calcular Potencial Hídrico
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
