"use client";

import {
	CircleGauge,
	Clock,
	Component,
	CornerUpLeft,
	TableOfContents,
	Trophy,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuide } from "@/hooks/use-guides";
import { GuideDifficulty } from "@/types/guide";

export default function CitizenGuidesDetailPage({
	params,
}: {
	params: Promise<{ guide_id: string }>;
}) {
	const { guide_id } = use(params);
	const { data, isLoading, error } = useGuide(Number(guide_id));

	if (isLoading) {
		return (
			<div className="mx-auto p-6 container">
				<Skeleton className="flex justify-between items-center gap-4 bg-neutral-200 px-4 py-3 rounded-xl h-20">
					<div className="flex items-center gap-4 text-white">
						<Skeleton className="size-10" />
						<div className="flex flex-col">
							<Skeleton className="bg-neutral-100 w- h-8" />
							<Skeleton className="bg-neutral-100 w-2/3 h-6" />
						</div>
					</div>
					<Skeleton className="w-12 h-9" />
				</Skeleton>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h2 className="font-bold text-red-600 text-2xl">Error</h2>
					<p className="text-gray-600">No se pudo cargar la guía</p>
				</div>
			</div>
		);
	}

	if (!data) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="text-center">
					<h2 className="font-bold text-gray-600 text-2xl">
						Guía no encontrada
					</h2>
				</div>
			</div>
		);
	}

	const createdAt = new Date(data.data.createdAt);

	const renderDifficulty = (difficulty: GuideDifficulty) => {
		switch (difficulty) {
			case GuideDifficulty.ADVANCED:
				return "Avanzado";

			case GuideDifficulty.INTERMEDIATE:
				return "Intermedio";

			default:
				return "Principiante";
		}
	};

	return (
		<div className="mx-auto p-6 container">
			<div className="flex justify-between items-center gap-4 bg-teal-500 mb-16 px-4 py-3 rounded-xl outline-4 outline-teal-400">
				<div className="flex items-start gap-4 text-white">
					<Link
						title="Regresar a las guías"
						href="/guides"
						className="flex justify-center items-center hover:bg-teal-400/50 mt-2 rounded-md size-10 text-neutral-200"
					>
						<CornerUpLeft className="size-4" />
					</Link>
					<div className="flex flex-col">
						<h1 className="font-bold text-2xl">{data.data.name}</h1>
						<p className="text-teal-50 line-clamp-2">{data.data.description}</p>
					</div>
				</div>
				<Popover>
					<PopoverTrigger asChild>
						<Button
							variant="ghost"
							title="Ver detalles"
							className="hover:bg-teal-400/50 text-teal-200 hover:text-teal-200 cursor-pointer h-11"
						>
							<TableOfContents className="size-6" />
						</Button>
					</PopoverTrigger>
					<PopoverContent
						align="end"
						sideOffset={32}
						className="flex flex-col gap-4 shadow-md p-4 border border-neutral-200 rounded-2xl w-64"
					>
						<span className="font-semibold text-neutral-600 text-lg">
							Detalles
						</span>
						<div className="flex justify-between items-center gap-4">
							<div className="flex items-center gap-2 text-gray-500">
								<span className="font-semibold">Creación:</span>
							</div>
							<p className="text-gray-400">
								{createdAt.toLocaleDateString("es-CO")}
							</p>
						</div>
						<Separator />
						<ul className="flex flex-col gap-2">
							<li className="flex justify-between items-center gap-4">
								<div className="flex items-center gap-2 text-gray-500">
									<Clock className="size-4" />
									<span className="font-semibold">Duration:</span>
								</div>
								<p className="text-gray-400">
									{data.data.estimatedDuration} min
								</p>
							</li>
							<li className="flex justify-between items-center gap-4">
								<div className="flex items-center gap-2 text-gray-500">
									<Trophy className="size-4 text-yellow-500" />
									<span className="font-semibold">Puntos totales:</span>
								</div>
								<p className="text-gray-400">{data.data.totalPoints}</p>
							</li>
							<li className="flex justify-between items-center gap-4">
								<div className="flex items-center gap-2 text-gray-500">
									<Component className="size-4 text-teal-600" />
									<span className="font-semibold">Módulos:</span>
								</div>
								<p className="text-gray-400">{data.data.modules.length}</p>
							</li>
							<li className="flex justify-between items-center gap-4">
								<div className="flex items-center gap-2 text-gray-500">
									<CircleGauge className="size-4" />
									<span className="font-semibold">Dificultad:</span>
								</div>
								<Badge variant="outline">
									{renderDifficulty(data.data.difficulty)}
								</Badge>
							</li>
						</ul>
					</PopoverContent>
				</Popover>
			</div>
			<div className="flex flex-col items-center gap-6 pb-48">
				{data.data.modules.map((module) => (
					<Popover key={`guide-module-${module.id}`}>
						<PopoverTrigger asChild>
							<div className="relative focus:outline-none w-24 h-[75px]">
								<button
									type="button"
									className="group relative focus:outline-none w-24 h-[75px] cursor-pointer"
								>
									{/* Bottom outline */}
									<div className="bottom-px left-1/2 z-0 absolute rounded-lg outline-[3px] outline-teal-600/50 outline-offset-[6px] w-14 h-14 rotate-x-50 rotate-z-45 -translate-x-1/2" />
									{/* Bottom shadow */}
									<div className="bottom-0 left-1/2 z-0 absolute bg-teal-600 rounded-lg outline-[3px] outline-teal-600 -outline-offset-1 w-14 h-14 rotate-x-50 rotate-z-45 -translate-x-1/2" />
									{/* Bottom body */}
									<div className="bottom-[28px] left-1/2 z-0 absolute bg-teal-600 w-[75px] h-3 -translate-x-1/2" />
									{/* Bottom cap */}
									<div className="bottom-3 left-1/2 absolute bg-teal-500 rounded-lg outline-[3px] outline-teal-600 -outline-offset-1 w-14 h-14 rotate-x-50 rotate-z-45 -translate-x-1/2" />
									{/* Top shadow */}
									<div className="bottom-6 left-1/2 absolute bg-teal-600 rounded-sm outline-[3px] outline-teal-600 -outline-offset-1 w-8 h-8 rotate-x-50 rotate-z-45 -translate-x-1/2" />
									{/* Top body */}
									<div className="bottom-10 left-1/2 z-8 absolute bg-teal-600 w-11 h-4 group-active:h-0 group-hover:h-3 transition-all -translate-x-1/2 duration-150 ease-out" />
									{/* Top cap */}
									<div className="bottom-10 group-active:bottom-6! group-hover:bottom-9 left-1/2 z-10 absolute bg-teal-500 rounded-sm outline-[3px] outline-teal-600 -outline-offset-1 w-8 h-8 rotate-x-50 rotate-z-45 transition-all -translate-x-1/2 duration-150 ease-out" />
									<span className="absolute bottom-[2.85rem] group-active:bottom-7! group-hover:bottom-10 justify-center text-teal-600 left-1/2 -translate-x-1/2 z-10 rotate-x-35 font-bold transition-all duration-150 ease-out">
										{module.order}
									</span>
								</button>
								<span className="absolute top-1/2 -translate-y-1/2 left-[calc(100%+1rem)] min-w-52 text-lg font-bold text-neutral-400 select-none">
									{module.name}
								</span>
							</div>
						</PopoverTrigger>
						<PopoverContent className="flex flex-col gap-4 shadow-md p-4 border border-neutral-200 rounded-2xl w-72">
							<div className="flex flex-col gap-2 text-neutral-600">
								<div className="flex items-top justify-between gap-1">
									{module.name && (
										<h2 className="font-bold text-lg leading-5">
											{module.name}
										</h2>
									)}
									<span className="flex items-center gap-1 text-yellow-500 font-medium max-h-fit py-0.5 px-2 rounded-full bg-yellow-100 border border-yellow-300 text-xs">
										<Trophy className="size-3.5 text-yellow-500" />
										{module.points}
									</span>
								</div>
								{module.description && (
									<p className="text-sm line-clamp-2">{module.description}</p>
								)}
							</div>
							<Link
								title="Comenzar"
								href={`/guides/${data.data.id}/${module.id}`}
								className="flex justify-center items-center gap-2 bg-teal-600 hover:bg-teal-700 px-4 py-2 border-teal-700 border-b-4 rounded-md font-semibold text-teal-50 uppercase whitespace-nowrap duration-150 ease-out cursor-pointer"
							>
								Comenzar
							</Link>
						</PopoverContent>
					</Popover>
				))}
			</div>
		</div>
	);
}
