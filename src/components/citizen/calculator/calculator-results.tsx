import { Droplets, Leaf, PiggyBank, Users, Info, Waves } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface WaterResults {
  litersPerYear: number;
  savingsPerYear: number;
  co2Reduction: number;
  litersPerPersonPerDay: number;
}

interface CalculatorResultsProps {
  results: WaterResults;
}

export default function CalculatorResults({
  results,
}: Readonly<CalculatorResultsProps>) {
  if (!results) return null;

  // Equivalencies for context
  const tankCount = (results.litersPerYear / 1000).toFixed(1);
  const showerCount = Math.floor(results.litersPerYear / 40); // Avg shower 40L
  const treesPlanted = (results.co2Reduction / 20).toFixed(1); // Avg tree absorbs ~20kg CO2/year

  return (
    <div className="w-full space-y-6">
      <div className="bg-white border text-card-foreground shadow-sm rounded-xl overflow-hidden">
        <div className="p-6 bg-teal-50/50 border-b border-teal-100/50">
          <h3 className="text-xl font-bold flex items-center gap-2 text-teal-800">
            <Waves className="h-6 w-6 text-teal-600" />
            Tu Potencial de Recolección
          </h3>
          <p className="text-sm text-teal-600 mt-1">
            Basado en tus datos, así es como podrías transformar tu consumo.
          </p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Total Volume */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-blue-50/50 border border-blue-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <Droplets className="h-6 w-6" />
              </div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-blue-300" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="w-48 text-xs">
                      Volumen total estimado que podrías capturar en un año de
                      lluvias promedio.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">
                {results.litersPerYear.toLocaleString()}
                <span className="text-sm font-medium text-blue-500 ml-1">
                  L/año
                </span>
              </div>
              <p className="text-sm font-medium text-blue-600">
                Volumen Total (Hogar)
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-blue-100 text-xs text-blue-700 font-medium">
              Equivalente a llenar {tankCount} tanques de mil litros
              <br />o tomar {showerCount.toLocaleString()} duchas cortas (40L).
            </div>
          </div>
          {/* Personal Impact */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-indigo-700">
                {results.litersPerPersonPerDay.toLocaleString(undefined, {
                  maximumFractionDigits: 1,
                })}
                <span className="text-sm font-medium text-indigo-500 ml-1">
                  L/día
                </span>
              </div>
              <p className="text-sm font-medium text-indigo-600">
                Disponibilidad Individual
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-indigo-100 text-xs text-indigo-700 font-medium">
              Suficiente para descarga de sanitarios
              <br />y riego diario de plantas.
            </div>
          </div>
          {/* Economic Savings */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
                <PiggyBank className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-emerald-700">
                ${results.savingsPerYear.toLocaleString()}
                <span className="text-sm font-medium text-emerald-500 ml-1">
                  COP
                </span>
              </div>
              <p className="text-sm font-medium text-emerald-600">
                Ahorro Estimado Anual
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-emerald-100 text-xs text-emerald-700 font-medium">
              Reducción directa en tu factura
              <br />
              al sustituir agua potable.
            </div>
          </div>
          {/* Environmental Impact */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-green-50/50 border border-green-100 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Leaf className="h-6 w-6" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-700">
                {results.co2Reduction}
                <span className="text-sm font-medium text-green-500 ml-1">
                  kg
                </span>
              </div>
              <p className="text-sm font-medium text-green-600">
                Reducción de CO₂
              </p>
            </div>
            <div className="mt-auto pt-3 border-t border-green-100 text-xs text-green-700 font-medium">
              Equivale al carbono absorbido
              <br />
              por ~{treesPlanted} árboles en un año.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
