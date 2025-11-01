interface WaterResults {
	litersPerYear: number;
	savingsPerYear: number;
	co2Reduction: number;
}

interface CalculatorResultsProps {
	results: WaterResults;
}

export default function CalculatorResults({ results }: CalculatorResultsProps) {
	if (!results) return null;

	return (
		<div className="card border rounded-lg shadow-sm bg-white">
			<div className="card-content p-4">
				<div className="grid grid-cols-3 gap-4">
					<div className="text-center">
						<div className="text-2xl font-bold text-teal-600">
							{results.litersPerYear.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Litros/año</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-green-600">
							${results.savingsPerYear.toLocaleString()}
						</div>
						<div className="text-sm text-gray-500">Ahorro anual</div>
					</div>
					<div className="text-center">
						<div className="text-2xl font-bold text-emerald-600">
							{results.co2Reduction} kg
						</div>
						<div className="text-sm text-gray-500">Reducción de CO₂</div>
					</div>
				</div>
			</div>
		</div>
	);
}
