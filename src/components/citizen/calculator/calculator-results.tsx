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

  return (
    <div className="card border rounded-lg shadow-sm bg-white">
      <div className="card-content p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-2 rounded-lg bg-teal-50">
            <div className="text-2xl font-bold text-teal-600">
              {results.litersPerYear.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">Litros/año</div>
            <div className="text-xs text-gray-500 mt-1">Total recolectado</div>
          </div>

          <div className="text-center p-2 rounded-lg bg-blue-50">
            <div className="text-2xl font-bold text-blue-600">
              {results.litersPerPersonPerDay.toLocaleString(undefined, {
                maximumFractionDigits: 1,
              })}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Litros/persona/día
            </div>
            <div className="text-xs text-gray-500 mt-1">
              Disponibilidad diaria
            </div>
          </div>

          <div className="text-center p-2 rounded-lg bg-green-50">
            <div className="text-2xl font-bold text-green-600">
              ${results.savingsPerYear.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Ahorro estimado
            </div>
            <div className="text-xs text-gray-500 mt-1">Pesos por año</div>
          </div>

          <div className="text-center p-2 rounded-lg bg-emerald-50">
            <div className="text-2xl font-bold text-emerald-600">
              {results.co2Reduction} kg
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Reducción CO₂
            </div>
            <div className="text-xs text-gray-500 mt-1">Impacto ambiental</div>
          </div>
        </div>
      </div>
    </div>
  );
}
