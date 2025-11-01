"use client";

import { Droplets, HelpCircle, Home, MapPin } from "lucide-react";
import { useState } from "react";
import CalculatorResults from "@/components/citizen/calculator/calculator-results";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";

interface CollectionMethod {
	id: string;
	name: string;
	efficiency: number;
}

type RainfallData = Record<string, number>;

export interface WaterResults {
	litersPerYear: number;
	savingsPerYear: number;
	co2Reduction: number;
}

export default function CalculatorPage() {
	const COLLECTION_METHODS: CollectionMethod[] = [
		{ id: "roof", name: "Recolección de Techo", efficiency: 0.8 },
		{ id: "surface", name: "Captación de Superficie", efficiency: 0.6 },
		{ id: "fog", name: "Atrapanieblas", efficiency: 0.4 },
	];

	const RAINFALL_DATA: RainfallData = {
		norte: 50,
		centro: 500,
		sur: 2000,
	};

	const [location, setLocation] = useState("centro");
	const [method, setMethod] = useState(COLLECTION_METHODS[0].id);
	const [area, setArea] = useState(100);
	const [efficiency, setEfficiency] = useState(80);
	const [results, setResults] = useState<WaterResults>();

	const calculateResults = () => {
		const selectedMethod =
			COLLECTION_METHODS.find((m) => m.id === method) || COLLECTION_METHODS[0];
		const rainfall = RAINFALL_DATA[location];
		const methodEfficiency = selectedMethod.efficiency;
		const userEfficiency = efficiency / 100;

		// Formula: Area (m²) × Rainfall (mm/year) × Efficiency = Liters per year
		const litersPerYear = area * rainfall * methodEfficiency * userEfficiency;

		// Approximate savings (assuming water costs $0.002 per liter)
		const savingsPerYear = litersPerYear * 0.002;

		// Approximate CO2 reduction (0.5kg CO2 per 1000L of water)
		const co2Reduction = (litersPerYear / 1000) * 0.5;

		setResults({
			litersPerYear: Math.round(litersPerYear),
			savingsPerYear: Math.round(savingsPerYear),
			co2Reduction: Number.parseFloat(co2Reduction.toFixed(2)),
		});
	};

	// Simulate adding points when calculating
	const calculateAndEarnPoints = () => {
		// This would connect to a backend to update user points
		console.log("Calculation completed: +10 points");
		calculateResults();
	};

	return (
		<div className="h-full flex flex-col items-center">
			<div className="card-header p-6 border-b w-full">
				<h3 className="card-title flex items-center gap-2 text-lg font-semibold">
					<Droplets className="h-5 w-5 text-blue-500" />
					Simulación Interactiva
				</h3>
				<p className="card-description text-sm text-gray-500">
					Ajusta los parámetros para calcular tu potencial de recolección de
					agua
				</p>
			</div>

			<div className="card p-6 space-y-6 max-w-md w-full">
				{/* Location Selection */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<MapPin className="h-4 w-4 text-gray-400" />
						<Label
							htmlFor="location"
							className="text-sm font-medium flex items-center gap-2"
						>
							<span>Ubicación</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="size-4 cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs rounded-lg text-sm">
										<p>
											La ubicación determina la cantidad de lluvia disponible
											para recolectar durante el año, siendo el factor principal
											que influye en el potencial hídrico de tu sistema.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Label>
					</div>
					<Select value={location} onValueChange={setLocation}>
						<SelectTrigger id="location" className="w-full">
							<SelectValue placeholder="Selecciona una ubicación" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="norte">Zona Norte (Árida)</SelectItem>
							<SelectItem value="centro">Zona Centro (Mediterránea)</SelectItem>
							<SelectItem value="sur">Zona Sur (Lluviosa)</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* Collection Method */}
				<div className="space-y-2">
					<Label
						htmlFor="method"
						className="text-sm font-medium flex items-center gap-2"
					>
						<span>Método de Recolección</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<HelpCircle className="size-4 cursor-help" />
								</TooltipTrigger>
								<TooltipContent className="max-w-xs rounded-lg text-sm">
									<p>
										Cada método tiene una eficiencia inherente basada en su
										capacidad para interceptar y canalizar el agua de lluvia sin
										pérdidas significativas.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Label>
					<Select value={method} onValueChange={setMethod}>
						<SelectTrigger id="method" className="w-full">
							<SelectValue placeholder="Selecciona un método" />
						</SelectTrigger>
						<SelectContent>
							{COLLECTION_METHODS.map((method) => (
								<SelectItem key={method.id} value={method.id}>
									{method.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Area Input */}
				<div className="space-y-2">
					<div className="flex items-center gap-2">
						<Home className="h-4 w-4 text-gray-400" />
						<Label
							htmlFor="area"
							className="text-sm font-medium flex items-center gap-2"
						>
							<span>Área de Captación (m²): {area}</span>
							<TooltipProvider>
								<Tooltip>
									<TooltipTrigger asChild>
										<HelpCircle className="size-4 cursor-help" />
									</TooltipTrigger>
									<TooltipContent className="max-w-xs rounded-lg text-sm">
										<p>
											La superficie total expuesta a la lluvia que puede
											capturar agua. Es la proyección horizontal del área de
											captación, medida en metros cuadrados. A mayor área, mayor
											volumen de agua recolectable por cada milímetro de lluvia.
										</p>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</Label>
					</div>
					<div className="flex gap-4 items-center">
						<Slider
							id="area"
							min={10}
							max={500}
							step={10}
							value={[area]}
							onValueChange={(value) => setArea(value[0])}
							className="w-full"
						/>
						<Input
							type="number"
							value={area}
							onChange={(e) => setArea(Number(e.target.value))}
							className="w-20"
							min={10}
							max={500}
						/>
					</div>
				</div>

				{/* Efficiency Slider */}
				<div className="space-y-2">
					<Label
						htmlFor="efficiency"
						className="text-sm font-medium flex items-center gap-2"
					>
						<span>Eficiencia del Sistema (%): {efficiency}</span>
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<HelpCircle className="size-4 cursor-help" />
								</TooltipTrigger>
								<TooltipContent className="max-w-xs rounded-lg text-sm">
									<p>
										El porcentaje de agua de lluvia que efectivamente se logra
										capturar y almacenar. Considera las pérdidas por
										evaporación, derrames, filtración y la calidad del sistema
										de canalización y filtrado instalado.
									</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Label>
					<Slider
						id="efficiency"
						min={10}
						max={100}
						step={5}
						value={[efficiency]}
						onValueChange={(value) => setEfficiency(value[0])}
						className="w-full"
					/>
				</div>
				<Button
					onClick={calculateAndEarnPoints}
					className="w-full bg-[#0D9488] hover:bg-[#0D9488]/90"
				>
					Calcular y Ganar Puntos
				</Button>
				{results && <CalculatorResults results={results} />}
			</div>
		</div>
	);
}
