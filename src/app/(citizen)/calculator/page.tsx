"use client";

import { Droplets, HelpCircle, Home, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import CalculatorResults from "@/components/citizen/calculator/calculator-results";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import { challengeService } from "@/services/challenge.service";
import { userChallengeService } from "@/services/user-challenge.service";
import { LevelUpModal } from "@/components/citizen/gamification/level-up-modal";
import type { Level } from "@/types/level";

interface CollectionMethod {
  id: string;
  name: string;
  efficiency: number;
}

type RainfallData = Record<string, number>;

/* WaterResults interface update matches component */
export interface WaterResults {
  litersPerYear: number;
  savingsPerYear: number;
  co2Reduction: number;
  litersPerPersonPerDay: number;
}

interface CollectionSystem {
  id: string;
  name: string;
  efficiency: number;
  description: string;
  details: {
    components: string[];
    pros: string[];
    cons?: string[];
  };
}

export default function CalculatorPage() {
  const SURFACE_TYPES: CollectionMethod[] = [
    { id: "metal", name: "Techo de Metal / Zinc", efficiency: 0.9 },
    { id: "tiles", name: "Techo de Tejas / Concreto", efficiency: 0.8 },
    { id: "flat", name: "Techo Plano / Terraza", efficiency: 0.75 },
    { id: "fog", name: "Atrapanieblas (Malla Raschel)", efficiency: 0.5 },
    { id: "green", name: "Techo Verde / Jardín", efficiency: 0.5 },
  ];

  const COLLECTION_SYSTEMS: CollectionSystem[] = [
    {
      id: "complete",
      name: "1. Sistema completo de captación (Recomendado)",
      efficiency: 0.95,
      description:
        "El modelo técnico ideal para hogares con mayor control de calidad y volumen.",
      details: {
        components: [
          "Superficie de captación (techo)",
          "Canaletas y bajantes",
          "Filtro inicial o sistema de primera descarga",
          "Tanque cerrado de almacenamiento",
          "Salida controlada (llave o manguera)",
        ],
        pros: [
          "Mejor calidad del agua",
          "Mayor volumen recolectado",
          "Uso seguro en riego, limpieza y sanitarios",
        ],
      },
    },
    {
      id: "semi",
      name: "2. Sistema semi-técnico",
      efficiency: 0.85,
      description:
        "Alternativa viable cuando no es posible instalar un sistema completo.",
      details: {
        components: [
          "Techo como superficie de captación",
          "Canaletas",
          "Filtro artesanal (malla, grava o tela)",
          "Tanque o recipiente tapado",
        ],
        pros: [
          "Bajo costo",
          "Reducción de suciedad inicial",
          "Fácil implementación",
        ],
      },
    },
    {
      id: "direct",
      name: "3. Recolección directa",
      efficiency: 0.7,
      description: "Método simple ubicando recipientes bajo caídas de agua.",
      details: {
        components: [
          "Recipientes bajo bajantes",
          "Canecas, baldes o tanques pequeños",
        ],
        pros: ["No requiere instalación", "Costo mínimo"],
        cons: [
          "Menor control de calidad",
          "Menor volumen",
          "Riesgo sanitario si no se tapa",
        ],
      },
    },
    {
      id: "basic",
      name: "4. Captación superficial básica",
      efficiency: 0.6,
      description:
        "Solución sencilla para patios o zonas con recursos limitados.",
      details: {
        components: [
          "Lonas, láminas o superficies inclinadas",
          "Conducción manual hacia recipientes",
        ],
        pros: ["Muy económica", "Útil en emergencias"],
        cons: ["Baja eficiencia", "Mayor exposición a contaminantes"],
      },
    },
  ];

  const RAINFALL_DATA: RainfallData = {
    norte: 50,
    centro: 500,
    sur: 2000,
  };

  const [location, setLocation] = useState("centro");
  const [method, setMethod] = useState(SURFACE_TYPES[0].id);
  /* New state for system type */
  const [systemType, setSystemType] = useState(COLLECTION_SYSTEMS[0].id);
  const [area, setArea] = useState(50);
  const [people, setPeople] = useState(4);
  const [results, setResults] = useState<WaterResults>();

  // Gamification state
  const [levelUpData, setLevelUpData] = useState<Level | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [calculatorChallengeId, setCalculatorChallengeId] = useState<
    number | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchChallengeId = async () => {
      try {
        // Search for a challenge related to the calculator
        const response = await challengeService.getChallenges({
          name: "Calculadora",
          limit: 1,
        });
        if (response.data && response.data.length > 0) {
          setCalculatorChallengeId(response.data[0].id);
        } else {
          // Fallback: try searching for "Uso de Calculadora" or generic
          const responseGeneric = await challengeService.getChallenges({
            name: "Uso de Calculadora",
            limit: 1,
          });
          if (responseGeneric.data && responseGeneric.data.length > 0) {
            setCalculatorChallengeId(responseGeneric.data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch calculator challenge", error);
      }
    };
    fetchChallengeId();
  }, []);

  const calculateResults = () => {
    const selectedMethod =
      SURFACE_TYPES.find((m) => m.id === method) || SURFACE_TYPES[0];
    const selectedSystem =
      COLLECTION_SYSTEMS.find((s) => s.id === systemType) ||
      COLLECTION_SYSTEMS[0];

    const rainfall = RAINFALL_DATA[location];
    const surfaceEfficiency = selectedMethod.efficiency;
    const systemEfficiency = selectedSystem.efficiency; // New factor

    // Formula: Area (m²) × Rainfall (mm/year) × Surface Efficiency × System Efficiency
    const litersPerYear =
      area * rainfall * surfaceEfficiency * systemEfficiency;

    // Approximate savings (assuming water costs ~$3.5 COP per liter in Cali)
    const savingsPerYear = litersPerYear * 3.5;

    // Approximate CO2 reduction (0.5kg CO2 per 1000L of water pumped/treated)
    const co2Reduction = (litersPerYear / 1000) * 0.5;

    // Liters per person per day
    const litersPerPersonPerDay = litersPerYear / people / 365;

    setResults({
      litersPerYear: Math.round(litersPerYear),
      savingsPerYear: Math.round(savingsPerYear),
      co2Reduction: Number.parseFloat(co2Reduction.toFixed(2)),
      litersPerPersonPerDay: Number.parseFloat(
        litersPerPersonPerDay.toFixed(1),
      ),
    });
  };

  const playSuccessSound = () => {
    const audio = new Audio("/success-sound.mp3");
    audio.play().catch((err) => console.error("Audio play failed:", err));
  };

  // Simulate adding points when calculating
  const calculateAndEarnPoints = async () => {
    calculateResults();

    // Play sound immediately for user feedback
    playSuccessSound();

    if (!calculatorChallengeId) {
      // If no challenge is linked, just show success without points or maybe generic message
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await userChallengeService.completeChallenge(
        calculatorChallengeId,
      );

      if (response.data) {
        const { xpAwarded, awardedBadges, leveledUp, newLevel } = response.data;

        if (xpAwarded > 0) {
          toast.success(`¡Cálculo realizado!`, {
            description: `Has ganado +${xpAwarded} XP`,
          });
        }

        if (awardedBadges && awardedBadges.length > 0) {
          awardedBadges.forEach((badge) => {
            toast("¡Nueva insignia desbloqueada!", {
              description: badge.name,
              icon: badge.imageUrl ? (
                <img
                  src={badge.imageUrl}
                  alt={badge.name}
                  className="w-8 h-8 object-contain rounded-full bg-neutral-100 p-1"
                />
              ) : (
                <span className="text-2xl">🏆</span>
              ),
              duration: 5000,
            });
          });
        }

        if (leveledUp && newLevel) {
          setLevelUpData(newLevel);
          setShowLevelUpModal(true);
        }
      }
    } catch (error) {
      // Check if error is existing completion (409 or similar message), ignore if so, or log
      console.error("Error awarding points:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col items-center">
      <LevelUpModal
        level={levelUpData}
        open={showLevelUpModal}
        onOpenChange={setShowLevelUpModal}
      />
      <div className="card-header p-6 border-b w-full">
        <h3 className="card-title flex items-center gap-2 text-lg font-semibold !text-neutral-800">
          <Droplets className="h-5 w-5 text-blue-500" />
          Calculadora de Cosecha de Agua
        </h3>
        <p className="card-description text-sm text-gray-500 mt-1">
          Descubre cuánta agua podrías recolectar en tu hogar y el impacto
          positivo que generarías.
        </p>
      </div>
      <div className="p-6 w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="card p-6 space-y-6 border rounded-xl shadow-sm bg-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <Label
                  htmlFor="location"
                  className="text-sm font-medium !text-neutral-600"
                >
                  Ubicación
                </Label>
              </div>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger
                  id="location"
                  className="w-full !text-neutral-600 !bg-white border-neutral-200"
                >
                  <SelectValue placeholder="Selecciona una ubicación" />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  <SelectItem
                    value="norte"
                    className="cursor-pointer text-neutral-600 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Zona Norte (~50mm/año)
                  </SelectItem>
                  <SelectItem
                    value="centro"
                    className="cursor-pointer text-neutral-600 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Zona Centro (~500mm/año)
                  </SelectItem>
                  <SelectItem
                    value="sur"
                    className="cursor-pointer text-neutral-600 focus:bg-neutral-100 focus:text-neutral-900"
                  >
                    Zona Sur (~2000mm/año)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-400">
                Selecciona la zona más cercana a tu residencia para estimar la
                lluvia anual.
              </p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="p-1 bg-blue-100 rounded text-blue-600">
                  <Droplets className="h-4 w-4" />
                </div>
                <Label
                  htmlFor="systemType"
                  className="text-sm font-medium !text-neutral-600"
                >
                  Sistema de Recolección
                </Label>
              </div>
              <Select value={systemType} onValueChange={setSystemType}>
                <SelectTrigger
                  id="systemType"
                  className="w-full !text-neutral-600 !bg-white border-neutral-200"
                >
                  <SelectValue placeholder="Selecciona un sistema" />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  {COLLECTION_SYSTEMS.map((sys) => (
                    <SelectItem
                      key={sys.id}
                      value={sys.id}
                      className="cursor-pointer text-neutral-600 focus:bg-neutral-100 focus:text-neutral-900"
                    >
                      {sys.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {systemType && (
                <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-sm space-y-2 mt-2">
                  <p className="font-medium text-neutral-700">
                    {
                      COLLECTION_SYSTEMS.find((s) => s.id === systemType)
                        ?.description
                    }
                  </p>

                  <div className="grid grid-cols-1 gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-teal-600 block mb-1">
                        Incluye:
                      </span>
                      <ul className="list-disc list-inside text-neutral-600 pl-1 space-y-0.5">
                        {COLLECTION_SYSTEMS.find(
                          (s) => s.id === systemType,
                        )?.details.components.map((c) => (
                          <li key={c}>{c}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <span className="font-semibold text-green-600 block mb-1">
                          Ventajas:
                        </span>
                        <ul className="list-disc list-inside text-neutral-600 pl-1">
                          {COLLECTION_SYSTEMS.find(
                            (s) => s.id === systemType,
                          )?.details.pros.map((p) => (
                            <li key={p}>{p}</li>
                          ))}
                        </ul>
                      </div>
                      {COLLECTION_SYSTEMS.find((s) => s.id === systemType)
                        ?.details.cons && (
                        <div className="flex-1">
                          <span className="font-semibold text-red-500 block mb-1">
                            Desventajas:
                          </span>
                          <ul className="list-disc list-inside text-neutral-600 pl-1">
                            {COLLECTION_SYSTEMS.find(
                              (s) => s.id === systemType,
                            )?.details.cons?.map((c) => (
                              <li key={c}>{c}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Home className="h-4 w-4 text-gray-400" />
                <Label
                  htmlFor="method"
                  className="text-sm font-medium !text-neutral-600"
                >
                  Tipo de Superficie de Captación
                </Label>
              </div>
              <Select value={method} onValueChange={setMethod}>
                <SelectTrigger
                  id="method"
                  className="w-full !text-neutral-600 !bg-white border-neutral-200"
                >
                  <SelectValue placeholder="Selecciona un material" />
                </SelectTrigger>
                <SelectContent className="!bg-white">
                  {SURFACE_TYPES.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="cursor-pointer text-neutral-600 focus:bg-neutral-100 focus:text-neutral-900"
                    >
                      {type.name} (Efic.: {type.efficiency * 100}%)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-neutral-400">
                La eficiencia depende del material del techo y su capacidad de
                escurrimiento.
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium !text-neutral-600">
                    Área de Captación
                  </span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="size-4 text-neutral-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-3">
                        <p className="font-semibold mb-1">¿Cómo medir?</p>
                        <p>
                          No es el tamaño total de tu casa, sino el área del
                          techo ("en planta") que conectará a las canaletas.
                        </p>
                        <p className="mt-1">
                          Ej: Si tu techo mide 10m x 5m, el área es 50m².
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <span className="text-sm font-bold text-teal-600">
                  {area} m²
                </span>
              </div>
              <Slider
                id="area"
                min={10}
                max={500}
                step={5}
                value={[area]}
                onValueChange={(value) => setArea(value[0])}
                className="py-4"
              />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="people"
                  className="text-sm font-medium !text-neutral-600"
                >
                  Personas en el hogar
                </Label>
                <span className="text-sm font-bold text-teal-600">
                  {people}
                </span>
              </div>
              <Slider
                id="people"
                min={1}
                max={10}
                step={1}
                value={[people]}
                onValueChange={(value) => setPeople(value[0])}
                className="py-4"
              />
              <p className="text-xs text-neutral-400">
                Número de habitantes para calcular disponibilidad personal.
              </p>
            </div>
            <Button
              onClick={calculateAndEarnPoints}
              disabled={isSubmitting}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white shadow-md transition-all mt-4"
            >
              {isSubmitting ? "Calculando..." : "Calcular Potencial"}
            </Button>
          </div>
        </div>
        {/* Results Section */}
        <div className="flex flex-col gap-6">
          {results ? (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <CalculatorResults results={results} />
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-neutral-200 rounded-xl text-neutral-400">
              <Droplets className="h-12 w-12 mb-4 opacity-20" />
              <p className="text-center">
                Configura los parámetros y presiona "Calcular Potencial" para
                ver tus resultados aquí.
              </p>
            </div>
          )}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 text-sm text-blue-800 space-y-4">
            <div>
              <h4 className="font-bold flex items-center gap-2 mb-2 text-blue-900">
                <HelpCircle className="h-4 w-4" />
                ¿Cómo funciona el cálculo?
              </h4>
              <p className="leading-relaxed">
                Este simulador estima la cantidad de agua lluvia que puedes
                recolectar basándose en cuatro factores clave: la lluvia en tu
                zona, el tamaño de tu techo, el material del mismo y el tipo de
                sistema de recolección que instales.
              </p>
            </div>
            <div className="bg-white/60 p-3 rounded border border-blue-200">
              <p className="font-semibold text-xs text-blue-900 mb-2 uppercase tracking-wide">
                Fórmula de Estimación
              </p>
              <div className="font-mono text-xs md:text-sm text-center text-blue-900 space-y-2">
                <p>
                  Volumen = Lluvia × Área × Eficiencia Techo × Eficiencia
                  Sistema
                </p>
              </div>
              <p className="text-xs mt-2 text-blue-700">
                * La <strong>Eficiencia del Sistema</strong> representa cuánta
                agua logras capturar realmente sin pérdidas por desbordamiento,
                filtración o evaporación en los conductos.
              </p>
            </div>
            <div>
              <p className="font-semibold text-blue-900 mb-1">
                Nota importante:
              </p>
              <p className="text-xs text-blue-700">
                La recolección de agua lluvia es una excelente alternativa para
                usos no potables (riego, limpieza, sanitarios), ayudando a
                reducir la presión sobre el acueducto y preparándote para épocas
                de sequía.
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Educational Content Section */}
      <div className="w-full max-w-4xl p-6 mt-4 mb-12">
        <h3 className="text-xl font-bold text-neutral-800 mb-4 border-b pb-2">
          Sobre la Recolección de Agua Lluvia en Cali
        </h3>
        <div className="prose prose-sm prose-blue max-w-none text-neutral-600 space-y-4">
          <p>
            La recolección de agua lluvia es una alternativa viable para
            complementar el suministro doméstico en zonas urbanas como Cali,
            especialmente para actividades no potables como lavado, limpieza y
            riego. Según el Ministerio de Vivienda, Ciudad y Territorio (2022),
            estas prácticas reducen la presión sobre las fuentes hídricas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-teal-700 mb-2">
                ¿Qué compone un sistema?
              </h4>
              <p className="text-sm">
                Aunque el diseño varía, los sistemas incluyen 4 componentes
                básicos:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                <li>
                  <strong>Área de captación:</strong> Generalmente el techo.
                </li>
                <li>
                  <strong>Sistema de conducción:</strong> Canaletas y bajantes.
                </li>
                <li>
                  <strong>Filtración:</strong> Retiene hojas y sedimentos.
                </li>
                <li>
                  <strong>Almacenamiento:</strong> Tanques cerrados y
                  protegidos.
                </li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg border shadow-sm">
              <h4 className="font-semibold text-teal-700 mb-2">
                Impacto en la Comunidad
              </h4>
              <p className="text-sm">
                Estudios en Cali (Sierra y Londoño, 2022) han evidenciado
                reducciones significativas en el consumo de agua potable en
                edificaciones que usan estos sistemas. Además, la adopción es
                más exitosa cuando se acompaña de educación y orientación
                técnica.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
