"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	AlertCircle,
	CheckCircle2,
	ChevronDown,
	ChevronRight,
	ExternalLink,
	GripVertical,
	Plus,
	Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { GuideDifficulty, GuideStatus } from "@/types/guide";
import { useCreateGuide, useGuide, useUpdateGuide } from "../hooks/use-guide";

interface CreateGuideDto {
	name: string;
	description: string;
	difficulty: GuideDifficulty;
	estimatedDuration: number;
	status?: GuideStatus;
	language: string;
	totalPoints: number;
	modules?: CreateModuleDto[];
}

interface CreateModuleDto {
	name: string;
	description: string;
	order: number;
	points: number;
	status?: ModuleStatus;
	blocks?: CreateBlockDto[];
}

interface CreateBlockDto {
	type: BlockType;
	order: number;
	statement: string;
	description?: string;
	resourceUrl?: string;
	points: number;
	feedback?: string;
	dynamicType?: DynamicType;
	questionType?: QuestionType;
	answers?: CreateAnswerDto[];
	relationalPairs?: CreateRelationalPairDto[];
	isValidBlockStructure: boolean;
}

interface CreateAnswerDto {
	text: string;
	isCorrect: boolean;
	feedback?: string;
	order: number;
}

interface CreateRelationalPairDto {
	leftItem: string;
	rightItem: string;
	correctPair: boolean;
}

enum ModuleStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	ARCHIVED = "archived",
}

enum BlockType {
	TEXT = "text",
	VIDEO = "video",
	IMAGE = "image",
	QUESTION = "question",
	INTERACTIVE = "interactive",
	QUIZ = "quiz",
}

enum DynamicType {
	DRAG_DROP = "drag_drop",
	MATCHING = "matching",
	SORTING = "sorting",
	FILL_BLANKS = "fill_blanks",
	SIMULATION = "simulation",
}

enum QuestionType {
	MULTIPLE_CHOICE = "multiple_choice",
	TRUE_FALSE = "true_false",
	OPEN_ENDED = "open_ended",
	MATCHING = "matching",
	ORDERING = "ordering",
}

interface Answer {
	id: string;
	text: string;
	isCorrect: boolean;
	feedback: string;
	order: number;
}

interface RelationalPair {
	id: string;
	leftItem: string;
	rightItem: string;
	correctPair: boolean;
}

interface Block {
	id: string;
	type: BlockType;
	order: number;
	statement: string;
	description: string;
	resourceUrl: string;
	points: number;
	feedback: string;
	dynamicType: string;
	questionType: string;
	answers: Answer[];
	relationalPairs: RelationalPair[];
}

interface Module {
	id: string;
	name: string;
	description: string;
	order: number;
	points: number;
	status: string;
	blocks: Block[];
}

const guideFormSchema = z.object({
	name: z
		.string()
		.min(2, "El nombre debe tener al menos 2 caracteres.")
		.max(45, "El nombre debe tener menos de 45 caracteres."),
	description: z
		.string()
		.min(10, "La descripción debe tener al menos 10 caracteres."),
	estimatedDuration: z
		.number()
		.min(1, "La duración debe ser al menos 1 minuto."),
	difficulty: z.enum(GuideDifficulty),
	status: z.enum(GuideStatus),
	language: z.string(),
	modules: z.array(z.any()),
});

type GuideFormValues = z.infer<typeof guideFormSchema>;

const defaultValues: Partial<GuideFormValues> = {
	name: "",
	description: "",
	estimatedDuration: 0,
	difficulty: GuideDifficulty.BEGINNER,
	status: GuideStatus.DRAFT,
	language: "es",
	modules: [],
};

interface GuideCreateEditFormProps {
	readonly guideId?: number;
}

export function GuidesCreateEditForm({ guideId }: GuideCreateEditFormProps) {
	const { push } = useRouter();
	const createGuideMutation = useCreateGuide();
	const updateGuideMutation = useUpdateGuide();
	const getGuideMutation = useGuide(guideId);

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [modules, setModules] = useState<Module[]>([]);
	const [expandedModules, setExpandedModules] = useState<Set<string>>(
		new Set(),
	);
	const [expandedBlocks, setExpandedBlocks] = useState<Set<string>>(new Set());
	const [mediaPreview, setMediaPreview] = useState<{
		[key: string]: { isValid: boolean; type: string };
	}>({});

	const form = useForm<GuideFormValues>({
		resolver: zodResolver(guideFormSchema),
		defaultValues,
		mode: "onChange",
	});

	const renderDifficultyLabel = (role: GuideDifficulty) => {
		switch (role.toLowerCase()) {
			case GuideDifficulty.BEGINNER:
				return "Principiante";
			case GuideDifficulty.INTERMEDIATE:
				return "Intermedio";
			case GuideDifficulty.ADVANCED:
				return "Avanzado";
			default:
				return "Principiante";
		}
	};

	const renderStatusLabel = (role: GuideStatus) => {
		switch (role.toLowerCase()) {
			case GuideStatus.PUBLISHED:
				return "Publicado";
			case GuideStatus.ARCHIVED:
				return "Archivado";
			case GuideStatus.DRAFT:
				return "Borrador";
			default:
				return "Borrador";
		}
	};

	// Validation helpers
	const isVideoUrl = (url: string): boolean => {
		const videoPatterns = [
			/youtube\.com\/watch\?v=/,
			/youtu\.be\//,
			/vimeo\.com\//,
			/\.(mp4|webm|ogg)$/i,
		];
		return videoPatterns.some((pattern) => pattern.test(url));
	};

	const isImageUrl = (url: string): boolean => {
		const imagePatterns = [
			/\.(jpg|jpeg|png|gif|webp|svg)$/i,
			/^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)/i,
		];
		return imagePatterns.some((pattern) => pattern.test(url));
	};

	const validateMediaUrl = (
		blockId: string,
		url: string,
		type: "video" | "image",
	) => {
		if (!url) {
			setMediaPreview((prev) => ({
				...prev,
				[blockId]: { isValid: false, type },
			}));
			return;
		}

		const isValid = type === "video" ? isVideoUrl(url) : isImageUrl(url);
		setMediaPreview((prev) => ({ ...prev, [blockId]: { isValid, type } }));
	};

	const validateBlock = (
		block: Block,
	): { isValid: boolean; errors: string[] } => {
		const errors: string[] = [];

		if (!block.statement.trim()) {
			errors.push("El enunciado es requerido");
		}

		if (block.points < 0) {
			errors.push("Los puntos no pueden ser negativos");
		}

		// Type-specific validation
		switch (block.type) {
			case "video":
				if (!block.resourceUrl) {
					errors.push("La URL del video es requerida");
				} else if (!isVideoUrl(block.resourceUrl)) {
					errors.push("La URL no parece ser un video válido");
				}
				break;

			case "image":
				if (!block.resourceUrl) {
					errors.push("La URL de la imagen es requerida");
				} else if (!isImageUrl(block.resourceUrl)) {
					errors.push("La URL no parece ser una imagen válida");
				}
				break;

			case "question":
			case "quiz":
				if (!block.questionType) {
					errors.push("El tipo de pregunta es requerido");
				}

				if (block.questionType === "matching") {
					if (block.relationalPairs.length < 2) {
						errors.push("Se requieren al menos 2 pares para emparejamiento");
					}
					block.relationalPairs.forEach((pair, idx) => {
						if (!pair.leftItem.trim() || !pair.rightItem.trim()) {
							errors.push(`Par ${idx + 1}: Ambos elementos son requeridos`);
						}
					});
				} else if (block.questionType !== "open_ended") {
					if (block.answers.length === 0) {
						errors.push("Se requiere al menos una respuesta");
					}

					const correctAnswers = block.answers.filter((a) => a.isCorrect);
					if (block.questionType === "true_false") {
						if (block.answers.length !== 2) {
							errors.push(
								"Verdadero/Falso debe tener exactamente 2 respuestas",
							);
						}
						if (correctAnswers.length !== 1) {
							errors.push("Debe haber exactamente una respuesta correcta");
						}
					} else if (block.questionType === "multiple_choice") {
						if (correctAnswers.length === 0) {
							errors.push("Debe haber al menos una respuesta correcta");
						}
					}

					block.answers.forEach((answer, idx) => {
						if (!answer.text.trim()) {
							errors.push(`Respuesta ${idx + 1}: El texto es requerido`);
						}
					});
				}
				break;

			case "interactive":
				if (!block.dynamicType) {
					errors.push("El tipo dinámico es requerido");
				}
				if (
					block.dynamicType === "matching" &&
					block.relationalPairs.length < 2
				) {
					errors.push("Se requieren al menos 2 pares para emparejamiento");
				}
				break;
		}

		return { isValid: errors.length === 0, errors };
	};

	const getBlockValidationStatus = (block: Block) => {
		const validation = validateBlock(block);
		return validation;
	};

	// Module management
	const addModule = () => {
		const newModule: Module = {
			id: `module-${Date.now()}`,
			name: "",
			description: "",
			order: modules.length + 1,
			points: 0,
			status: "draft",
			blocks: [],
		};
		setModules((prev) => [...prev, newModule]);
		setExpandedModules((prev) => new Set([...prev, newModule.id]));
	};

	const updateModule = (moduleId: string, field: string, value: any) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId ? { ...module, [field]: value } : module,
			),
		);
	};

	const deleteModule = (moduleId: string) => {
		setModules((prev) => prev.filter((module) => module.id !== moduleId));
		setExpandedModules((prev) => {
			const newSet = new Set(prev);
			newSet.delete(moduleId);
			return newSet;
		});
	};

	const toggleModuleExpansion = (moduleId: string) => {
		setExpandedModules((prev) => {
			const newSet = new Set(prev);
			newSet.has(moduleId) ? newSet.delete(moduleId) : newSet.add(moduleId);
			return newSet;
		});
	};

	// Block management
	const addBlock = (moduleId: string, type: BlockType = BlockType.QUESTION) => {
		const newBlock: Block = {
			id: `block-${Date.now()}`,
			type,
			order: 1,
			statement: "",
			description: "",
			resourceUrl: "",
			points: 0,
			feedback: "",
			dynamicType: "",
			questionType: "",
			answers: [],
			relationalPairs: [],
		};

		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: [
								...module.blocks,
								{ ...newBlock, order: module.blocks.length + 1 },
							],
						}
					: module,
			),
		);
		setExpandedBlocks((prev) => new Set([...prev, newBlock.id]));
	};

	const updateBlock = (
		moduleId: string,
		blockId: string,
		field: string,
		value: any,
	) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) => {
								if (block.id === blockId) {
									const updatedBlock = { ...block, [field]: value };

									// Clear dependent fields when type changes
									if (field === "type") {
										updatedBlock.questionType = "";
										updatedBlock.dynamicType = "";
										updatedBlock.answers = [];
										updatedBlock.relationalPairs = [];
										updatedBlock.resourceUrl = "";
									}

									// Clear answers when changing to matching
									if (field === "questionType" && value === "matching") {
										updatedBlock.answers = [];
									}

									// Clear relational pairs when changing from matching
									if (
										field === "questionType" &&
										block.questionType === "matching"
									) {
										updatedBlock.relationalPairs = [];
									}

									// Validate media URL
									if (field === "resourceUrl") {
										if (block.type === "video") {
											validateMediaUrl(blockId, value, "video");
										} else if (block.type === "image") {
											validateMediaUrl(blockId, value, "image");
										}
									}

									return updatedBlock;
								}
								return block;
							}),
						}
					: module,
			),
		);
	};

	const deleteBlock = (moduleId: string, blockId: string) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.filter((block) => block.id !== blockId),
						}
					: module,
			),
		);
		setMediaPreview((prev) => {
			const newPreview = { ...prev };
			delete newPreview[blockId];
			return newPreview;
		});
	};

	const toggleBlockExpansion = (blockId: string) => {
		setExpandedBlocks((prev) => {
			const newSet = new Set(prev);
			newSet.has(blockId) ? newSet.delete(blockId) : newSet.add(blockId);
			return newSet;
		});
	};

	// Answer management
	const addAnswer = (moduleId: string, blockId: string) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											answers: [
												...block.answers,
												{
													id: `answer-${Date.now()}`,
													text: "",
													isCorrect: false,
													feedback: "",
													order: block.answers.length + 1,
												},
											],
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	const updateAnswer = (
		moduleId: string,
		blockId: string,
		answerId: string,
		field: string,
		value: any,
	) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											answers: block.answers.map((answer) =>
												answer.id === answerId
													? { ...answer, [field]: value }
													: answer,
											),
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	const deleteAnswer = (
		moduleId: string,
		blockId: string,
		answerId: string,
	) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											answers: block.answers.filter(
												(answer) => answer.id !== answerId,
											),
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	// Relational pairs management
	const addRelationalPair = (moduleId: string, blockId: string) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											relationalPairs: [
												...block.relationalPairs,
												{
													id: `pair-${Date.now()}`,
													leftItem: "",
													rightItem: "",
													correctPair: true,
												},
											],
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	const updateRelationalPair = (
		moduleId: string,
		blockId: string,
		pairId: string,
		field: string,
		value: any,
	) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											relationalPairs: block.relationalPairs.map((pair) =>
												pair.id === pairId ? { ...pair, [field]: value } : pair,
											),
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	const deleteRelationalPair = (
		moduleId: string,
		blockId: string,
		pairId: string,
	) => {
		setModules((prev) =>
			prev.map((module) =>
				module.id === moduleId
					? {
							...module,
							blocks: module.blocks.map((block) =>
								block.id === blockId
									? {
											...block,
											relationalPairs: block.relationalPairs.filter(
												(pair) => pair.id !== pairId,
											),
										}
									: block,
							),
						}
					: module,
			),
		);
	};

	const calculateTotalPoints = () => {
		return modules.reduce((total, module) => {
			return (
				total +
				module.blocks.reduce(
					(blockTotal, block) => blockTotal + block.points,
					0,
				)
			);
		}, 0);
	};

	const canSubmitForm = () => {
		if (!form.formState.isValid) return false;
		if (modules.length === 0) return false;

		for (const module of modules) {
			if (!module.name.trim()) return false;
			if (module.blocks.length === 0) return false;

			for (const block of module.blocks) {
				const validation = validateBlock(block);
				if (!validation.isValid) return false;
			}
		}

		return true;
	};

	const onSubmit = async (formData: GuideFormValues) => {
		if (!canSubmitForm()) {
			alert(
				"Por favor, completa todos los campos requeridos y corrige los errores de validación.",
			);
			return;
		}

		setIsSubmitting(true);
		try {
			// Transform the data to match the backend DTO structure
			const guideData: CreateGuideDto = {
				name: formData.name,
				description: formData.description,
				estimatedDuration: formData.estimatedDuration,
				difficulty: formData.difficulty as GuideDifficulty,
				status: formData.status as GuideStatus,
				language: formData.language,
				totalPoints: calculateTotalPoints(),
				modules: modules.map(
					(module, moduleIndex): CreateModuleDto => ({
						name: module.name,
						description: module.description,
						order: module.order,
						points: module.points,
						status: module.status as ModuleStatus,
						blocks: module.blocks.map(
							(block, blockIndex): CreateBlockDto => ({
								type: block.type as BlockType,
								order: block.order,
								statement: block.statement,
								description: block.description || undefined,
								resourceUrl: block.resourceUrl || undefined,
								points: block.points,
								feedback: block.feedback || undefined,
								dynamicType: (block.dynamicType as DynamicType) || undefined,
								questionType: (block.questionType as QuestionType) || undefined,
								answers:
									block.answers?.map(
										(answer, answerIndex): CreateAnswerDto => ({
											text: answer.text,
											isCorrect: answer.isCorrect,
											feedback: answer.feedback || undefined,
											order: answer.order,
										}),
									) || undefined,
								relationalPairs:
									block.relationalPairs?.map(
										(pair, pairIndex): CreateRelationalPairDto => ({
											leftItem: pair.leftItem,
											rightItem: pair.rightItem,
											correctPair: pair.correctPair,
										}),
									) || undefined,
								isValidBlockStructure: true,
							}),
						),
					}),
				),
			};

			if (guideId) {
				await updateGuideMutation.mutateAsync({ id: guideId, data: guideData });
			} else {
				await createGuideMutation.mutateAsync(guideData);
			}

			push("/admin/guides");
		} catch (error) {
			console.error("Ocurrió un error:", error);
			alert(
				"Error al guardar la guía. Por favor, verifica que todos los campos estén completos.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (getGuideMutation?.isSuccess) {
			const guide = getGuideMutation.data.data;
			form.setValue("name", guide.name);
			form.setValue("description", guide.description);
			form.setValue("estimatedDuration", guide.estimatedDuration);
			form.setValue("difficulty", guide.difficulty);
			form.setValue("status", guide.status);
			form.setValue("language", guide.language || "es");

			if (guide.modules) {
				// Convert module IDs from number to string for local state
				const localModules = guide.modules.map((module: any) => ({
					...module,
					id: `module-${module.id}`,
					blocks:
						module.blocks?.map((block: any) => ({
							...block,
							id: `block-${block.id}`,
							answers:
								block.answers?.map((answer: any) => ({
									...answer,
									id: `answer-${answer.id}`,
								})) || [],
							relationalPairs:
								block.relationalPairs?.map((pair: any) => ({
									...pair,
									id: `pair-${pair.id}`,
								})) || [],
						})) || [],
				}));
				setModules(localModules);
			}
		}
	}, [
		getGuideMutation?.isSuccess,
		form.setValue,
		getGuideMutation?.data?.data,
	]);

	const getButtonText = () => {
		if (guideId) {
			return isSubmitting ? "Actualizando..." : "Actualizar guía";
		}
		return isSubmitting ? "Creando..." : "Crear guía";
	};

	const renderBlockTypeIcon = (type: string) => {
		switch (type) {
			case "text":
				return "📝";
			case "video":
				return "🎥";
			case "image":
				return "🖼️";
			case "question":
				return "❓";
			case "interactive":
				return "🎮";
			case "quiz":
				return "📋";
			default:
				return "📄";
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<Card>
					<CardHeader>
						<CardTitle>Información de la Guía</CardTitle>
					</CardHeader>
					<CardContent>
						<Tabs defaultValue="content" className="w-full">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="content">Contenido</TabsTrigger>
								<TabsTrigger value="settings">Configuración</TabsTrigger>
							</TabsList>

							<TabsContent value="content" className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="name"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Nombre de la Guía *</FormLabel>
												<FormControl>
													<Input
														placeholder="Ingresa el nombre"
														type="text"
														className="bg-white"
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="estimatedDuration"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Duración Estimada (minutos) *</FormLabel>
												<FormControl>
													<Input
														placeholder="Tiempo estimado"
														type="number"
														className="bg-white"
														{...field}
														onChange={(e) =>
															field.onChange(parseInt(e.target.value, 10) || 0)
														}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Descripción *</FormLabel>
											<FormControl>
												<Textarea
													placeholder="Describe el contenido y objetivos de la guía"
													className="bg-white"
													rows={3}
													{...field}
												/>
											</FormControl>
											<FormDescription>Mínimo 10 caracteres</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</TabsContent>

							<TabsContent value="settings" className="space-y-4">
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									<FormField
										control={form.control}
										name="difficulty"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Dificultad *</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value ?? ""}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white">
															<SelectValue placeholder="Selecciona una dificultad" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.keys(GuideDifficulty).map((difficulty) => (
															<SelectItem
																key={difficulty}
																value={difficulty.toLowerCase()}
															>
																{renderDifficultyLabel(
																	difficulty as GuideDifficulty,
																)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="status"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Estado *</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value ?? ""}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white">
															<SelectValue placeholder="Selecciona un estado" />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														{Object.keys(GuideStatus).map((status) => (
															<SelectItem
																key={status}
																value={status.toLowerCase()}
															>
																{renderStatusLabel(status as GuideStatus)}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
									<FormField
										control={form.control}
										name="language"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Idioma *</FormLabel>
												<Select
													onValueChange={field.onChange}
													value={field.value ?? "es"}
												>
													<FormControl>
														<SelectTrigger className="w-full bg-white">
															<SelectValue />
														</SelectTrigger>
													</FormControl>
													<SelectContent>
														<SelectItem value="es">Español</SelectItem>
														<SelectItem value="en">English</SelectItem>
													</SelectContent>
												</Select>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
									<div className="text-sm text-muted-foreground">
										Puntos Totales:
									</div>
									<Badge variant="secondary" className="text-lg font-semibold">
										{calculateTotalPoints()}
									</Badge>
									<div className="text-xs text-muted-foreground">
										(Calculado automáticamente)
									</div>
								</div>
							</TabsContent>
						</Tabs>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
						<div>
							<CardTitle>Módulos ({modules.length})</CardTitle>
							<p className="text-sm text-muted-foreground mt-1">
								Los módulos agrupan bloques de contenido relacionados
							</p>
						</div>
						<Button onClick={addModule} size="sm" type="button">
							<Plus className="w-4 h-4 mr-2" />
							Agregar Módulo
						</Button>
					</CardHeader>
					<CardContent className="space-y-4">
						{modules.length === 0 ? (
							<Alert>
								<AlertCircle className="h-4 w-4" />
								<AlertDescription>
									No hay módulos creados. Agrega al menos un módulo con bloques
									para crear la guía.
								</AlertDescription>
							</Alert>
						) : (
							modules.map((module, moduleIndex) => {
								const moduleHasErrors =
									!module.name.trim() || module.blocks.length === 0;

								return (
									<Card
										key={module.id}
										className={`border-l-4 ${moduleHasErrors ? "border-l-red-500" : "border-l-blue-500"}`}
									>
										<CardHeader className="pb-3">
											<div className="flex items-center justify-between">
												<div className="flex items-center gap-3 flex-1">
													<Button
														variant="ghost"
														size="sm"
														onClick={() => toggleModuleExpansion(module.id)}
														className="p-1"
														type="button"
													>
														{expandedModules.has(module.id) ? (
															<ChevronDown className="w-4 h-4" />
														) : (
															<ChevronRight className="w-4 h-4" />
														)}
													</Button>
													<GripVertical className="w-4 h-4 text-muted-foreground" />
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<CardTitle className="text-lg">
																Módulo {moduleIndex + 1}:{" "}
																{module.name || "Sin título"}
															</CardTitle>
															{moduleHasErrors && (
																<AlertCircle className="w-4 h-4 text-red-500" />
															)}
														</div>
														<div className="flex items-center gap-2 mt-1">
															<Badge variant="outline">
																{module.blocks.length} bloques
															</Badge>
															<Badge variant="secondary">
																{module.points} puntos
															</Badge>
															{moduleHasErrors && (
																<Badge variant="destructive">Incompleto</Badge>
															)}
														</div>
													</div>
												</div>
												<Button
													variant="ghost"
													size="sm"
													onClick={() => deleteModule(module.id)}
													className="text-destructive hover:text-destructive"
													type="button"
												>
													<Trash2 className="w-4 h-4" />
												</Button>
											</div>
										</CardHeader>

										{expandedModules.has(module.id) && (
											<CardContent className="pt-0">
												<Tabs defaultValue="content" className="w-full">
													<TabsList className="grid w-full grid-cols-2">
														<TabsTrigger value="content">Contenido</TabsTrigger>
														<TabsTrigger value="settings">
															Configuración
														</TabsTrigger>
													</TabsList>

													<TabsContent value="content" className="space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<div className="space-y-2">
																<Label>Nombre del Módulo *</Label>
																<Input
																	value={module.name}
																	onChange={(e) =>
																		updateModule(
																			module.id,
																			"name",
																			e.target.value,
																		)
																	}
																	placeholder="Ej: Introducción, Fundamentos, Práctica..."
																	className={
																		!module.name.trim() ? "border-red-500" : ""
																	}
																/>
																{!module.name.trim() && (
																	<p className="text-sm text-red-500">
																		El nombre es requerido
																	</p>
																)}
															</div>
															<div className="space-y-2">
																<Label>Orden</Label>
																<Input
																	type="number"
																	value={module.order}
																	onChange={(e) =>
																		updateModule(
																			module.id,
																			"order",
																			parseInt(e.target.value, 10) || 0,
																		)
																	}
																/>
															</div>
														</div>

														<div className="space-y-2">
															<Label>Descripción</Label>
															<Textarea
																value={module.description}
																onChange={(e) =>
																	updateModule(
																		module.id,
																		"description",
																		e.target.value,
																	)
																}
																placeholder="Describe el contenido del módulo"
																rows={2}
															/>
														</div>
													</TabsContent>

													<TabsContent value="settings" className="space-y-4">
														<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
															<div className="space-y-2">
																<Label>Puntos del Módulo</Label>
																<Input
																	type="number"
																	value={module.points}
																	onChange={(e) =>
																		updateModule(
																			module.id,
																			"points",
																			parseInt(e.target.value, 10) || 0,
																		)
																	}
																/>
																<p className="text-xs text-muted-foreground">
																	Puntos adicionales por completar el módulo
																	completo
																</p>
															</div>
															<div className="space-y-2">
																<Label>Estado</Label>
																<Select
																	value={module.status}
																	onValueChange={(value) =>
																		updateModule(module.id, "status", value)
																	}
																>
																	<SelectTrigger>
																		<SelectValue />
																	</SelectTrigger>
																	<SelectContent>
																		<SelectItem value="draft">
																			Borrador
																		</SelectItem>
																		<SelectItem value="published">
																			Publicado
																		</SelectItem>
																		<SelectItem value="archived">
																			Archivado
																		</SelectItem>
																	</SelectContent>
																</Select>
															</div>
														</div>
													</TabsContent>
												</Tabs>

												<Separator className="my-6" />

												<div className="space-y-4">
													<div className="flex items-center justify-between">
														<div>
															<h4 className="text-lg font-semibold">
																Bloques ({module.blocks.length})
															</h4>
															<p className="text-sm text-muted-foreground">
																Los bloques son los pasos individuales de la
																guía
															</p>
														</div>
														<div className="flex gap-2">
															<Select
																value=""
																onValueChange={(value) =>
																	addBlock(module.id, value as BlockType)
																}
															>
																<SelectTrigger className="w-[180px]">
																	<SelectValue placeholder="Tipo de bloque" />
																</SelectTrigger>
																<SelectContent>
																	<SelectItem value={BlockType.TEXT}>
																		📝 Texto
																	</SelectItem>
																	<SelectItem value={BlockType.VIDEO}>
																		🎥 Video
																	</SelectItem>
																	<SelectItem value={BlockType.IMAGE}>
																		🖼️ Imagen
																	</SelectItem>
																	<SelectItem value={BlockType.QUESTION}>
																		❓ Pregunta
																	</SelectItem>
																	<SelectItem value={BlockType.INTERACTIVE}>
																		🎮 Interactivo
																	</SelectItem>
																	<SelectItem value={BlockType.QUIZ}>
																		📋 Quiz
																	</SelectItem>
																</SelectContent>
															</Select>
															<Button
																onClick={() => addBlock(module.id)}
																size="sm"
																type="button"
															>
																<Plus className="w-4 h-4 mr-2" />
																Agregar
															</Button>
														</div>
													</div>

													{module.blocks.length === 0 ? (
														<Alert>
															<AlertCircle className="h-4 w-4" />
															<AlertDescription>
																No hay bloques en este módulo. Agrega al menos
																un bloque usando el menú desplegable.
															</AlertDescription>
														</Alert>
													) : (
														<div className="space-y-3">
															{module.blocks.map((block, blockIndex) => {
																const validation =
																	getBlockValidationStatus(block);
																const preview = mediaPreview[block.id];

																return (
																	<Card
																		key={block.id}
																		className={`border-l-4 ${validation.isValid ? "border-l-green-500" : "border-l-red-500"}`}
																	>
																		<CardHeader className="pb-3">
																			<div className="flex items-center justify-between">
																				<div className="flex items-center gap-3 flex-1">
																					<Button
																						variant="ghost"
																						size="sm"
																						onClick={() =>
																							toggleBlockExpansion(block.id)
																						}
																						className="p-1"
																						type="button"
																					>
																						{expandedBlocks.has(block.id) ? (
																							<ChevronDown className="w-4 h-4" />
																						) : (
																							<ChevronRight className="w-4 h-4" />
																						)}
																					</Button>
																					<GripVertical className="w-4 h-4 text-muted-foreground" />
																					<div className="flex-1">
																						<div className="flex items-center gap-2">
																							<CardTitle className="text-base">
																								{renderBlockTypeIcon(
																									block.type,
																								)}{" "}
																								Bloque {blockIndex + 1}:{" "}
																								{block.statement ||
																									"Sin título"}
																							</CardTitle>
																							{!validation.isValid && (
																								<AlertCircle className="w-4 h-4 text-red-500" />
																							)}
																						</div>
																						<div className="flex items-center gap-2 mt-1 flex-wrap">
																							<Badge variant="outline">
																								{block.type}
																							</Badge>
																							{block.type === "question" &&
																								block.questionType && (
																									<Badge variant="secondary">
																										{block.questionType}
																									</Badge>
																								)}
																							{block.type === "interactive" &&
																								block.dynamicType && (
																									<Badge variant="secondary">
																										{block.dynamicType}
																									</Badge>
																								)}
																							{block.questionType ===
																								"matching" && (
																								<Badge variant="default">
																									{block.relationalPairs.length}{" "}
																									pares
																								</Badge>
																							)}
																							{block.questionType !==
																								"matching" &&
																								block.answers.length > 0 && (
																									<Badge variant="default">
																										{block.answers.length}{" "}
																										respuestas
																									</Badge>
																								)}
																							<Badge variant="secondary">
																								{block.points} pts
																							</Badge>
																							{validation.isValid ? (
																								<Badge
																									variant="outline"
																									className="bg-green-50 text-green-700 border-green-200"
																								>
																									<CheckCircle2 className="w-3 h-3 mr-1" />
																									Válido
																								</Badge>
																							) : (
																								<Badge variant="destructive">
																									Incompleto
																								</Badge>
																							)}
																						</div>
																					</div>
																				</div>
																				<Button
																					variant="ghost"
																					size="sm"
																					onClick={() =>
																						deleteBlock(module.id, block.id)
																					}
																					className="text-destructive hover:text-destructive"
																					type="button"
																				>
																					<Trash2 className="w-4 h-4" />
																				</Button>
																			</div>
																		</CardHeader>

																		{expandedBlocks.has(block.id) && (
																			<CardContent className="pt-0 space-y-4">
																				{!validation.isValid && (
																					<Alert variant="destructive">
																						<AlertCircle className="h-4 w-4" />
																						<AlertDescription>
																							<ul className="list-disc list-inside">
																								{validation.errors.map(
																									(error, idx) => (
																										<li key={idx.toString()}>
																											{error}
																										</li>
																									),
																								)}
																							</ul>
																						</AlertDescription>
																					</Alert>
																				)}

																				<Tabs
																					defaultValue="content"
																					className="w-full"
																				>
																					<TabsList className="grid w-full grid-cols-2">
																						<TabsTrigger value="content">
																							Contenido
																						</TabsTrigger>
																						<TabsTrigger value="settings">
																							Configuración
																						</TabsTrigger>
																					</TabsList>

																					<TabsContent
																						value="content"
																						className="space-y-4"
																					>
																						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																							<div className="space-y-2">
																								<Label>Tipo de Bloque *</Label>
																								<Select
																									value={block.type}
																									onValueChange={(value) =>
																										updateBlock(
																											module.id,
																											block.id,
																											"type",
																											value,
																										)
																									}
																								>
																									<SelectTrigger>
																										<SelectValue />
																									</SelectTrigger>
																									<SelectContent>
																										<SelectItem value="text">
																											📝 Texto
																										</SelectItem>
																										<SelectItem value="video">
																											🎥 Video
																										</SelectItem>
																										<SelectItem value="image">
																											🖼️ Imagen
																										</SelectItem>
																										<SelectItem value="question">
																											❓ Pregunta
																										</SelectItem>
																										<SelectItem value="interactive">
																											🎮 Interactivo
																										</SelectItem>
																										<SelectItem value="quiz">
																											📋 Quiz
																										</SelectItem>
																									</SelectContent>
																								</Select>
																							</div>
																							<div className="space-y-2">
																								<Label>Orden</Label>
																								<Input
																									type="number"
																									value={block.order}
																									onChange={(e) =>
																										updateBlock(
																											module.id,
																											block.id,
																											"order",
																											parseInt(
																												e.target.value,
																											) || 0,
																										)
																									}
																								/>
																							</div>
																						</div>

																						<div className="space-y-2">
																							<Label>Enunciado/Título *</Label>
																							<Input
																								value={block.statement}
																								onChange={(e) =>
																									updateBlock(
																										module.id,
																										block.id,
																										"statement",
																										e.target.value,
																									)
																								}
																								placeholder="Título o pregunta principal del bloque"
																								className={
																									!block.statement.trim()
																										? "border-red-500"
																										: ""
																								}
																							/>
																						</div>

																						<div className="space-y-2">
																							<Label>Descripción</Label>
																							<Textarea
																								value={block.description}
																								onChange={(e) =>
																									updateBlock(
																										module.id,
																										block.id,
																										"description",
																										e.target.value,
																									)
																								}
																								placeholder="Descripción o contexto adicional"
																								rows={3}
																							/>
																						</div>

																						{(block.type === "video" ||
																							block.type === "image") && (
																							<div className="space-y-2">
																								<Label>URL del Recurso *</Label>
																								<div className="flex gap-2">
																									<Input
																										value={block.resourceUrl}
																										onChange={(e) =>
																											updateBlock(
																												module.id,
																												block.id,
																												"resourceUrl",
																												e.target.value,
																											)
																										}
																										placeholder={
																											block.type === "video"
																												? "https://youtube.com/watch?v=... o https://example.com/video.mp4"
																												: "https://example.com/image.jpg"
																										}
																										className={
																											block.resourceUrl &&
																											preview &&
																											!preview.isValid
																												? "border-red-500"
																												: ""
																										}
																									/>
																									{block.resourceUrl && (
																										<Button
																											type="button"
																											variant="outline"
																											size="sm"
																											onClick={() =>
																												window.open(
																													block.resourceUrl,
																													"_blank",
																												)
																											}
																										>
																											<ExternalLink className="w-4 h-4" />
																										</Button>
																									)}
																								</div>
																								{preview && (
																									<div className="flex items-center gap-2">
																										{preview.isValid ? (
																											<>
																												<CheckCircle2 className="w-4 h-4 text-green-500" />
																												<span className="text-sm text-green-600">
																													URL válida detectada
																												</span>
																											</>
																										) : (
																											<>
																												<AlertCircle className="w-4 h-4 text-red-500" />
																												<span className="text-sm text-red-600">
																													La URL no parece ser
																													un{" "}
																													{block.type ===
																													"video"
																														? "video"
																														: "imagen"}{" "}
																													válido
																												</span>
																											</>
																										)}
																									</div>
																								)}
																								{block.type === "image" &&
																									block.resourceUrl &&
																									preview?.isValid && (
																										<div className="mt-2 border rounded-lg overflow-hidden">
																											<img
																												src={block.resourceUrl}
																												alt="Preview"
																												className="max-h-48 w-auto mx-auto"
																												onError={() => {
																													setMediaPreview(
																														(prev) => ({
																															...prev,
																															[block.id]: {
																																isValid: false,
																																type: "image",
																															},
																														}),
																													);
																												}}
																											/>
																										</div>
																									)}
																							</div>
																						)}

																						{block.type === "text" && (
																							<Alert>
																								<AlertDescription>
																									💡 Este bloque mostrará texto
																									informativo al usuario. Usa la
																									descripción para el contenido
																									principal.
																								</AlertDescription>
																							</Alert>
																						)}

																						<div className="space-y-2">
																							<Label>Retroalimentación</Label>
																							<Textarea
																								value={block.feedback}
																								onChange={(e) =>
																									updateBlock(
																										module.id,
																										block.id,
																										"feedback",
																										e.target.value,
																									)
																								}
																								placeholder="Mensaje de retroalimentación al completar este bloque"
																								rows={2}
																							/>
																						</div>
																					</TabsContent>

																					<TabsContent
																						value="settings"
																						className="space-y-4"
																					>
																						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
																							<div className="space-y-2">
																								<Label>Puntos</Label>
																								<Input
																									type="number"
																									value={block.points}
																									onChange={(e) =>
																										updateBlock(
																											module.id,
																											block.id,
																											"points",
																											parseInt(
																												e.target.value,
																											) || 0,
																										)
																									}
																									min="0"
																								/>
																								<p className="text-xs text-muted-foreground">
																									Puntos que el usuario gana al
																									completar este bloque
																								</p>
																							</div>

																							{block.type === "interactive" && (
																								<div className="space-y-2">
																									<Label>Tipo Dinámico *</Label>
																									<Select
																										value={block.dynamicType}
																										onValueChange={(value) =>
																											updateBlock(
																												module.id,
																												block.id,
																												"dynamicType",
																												value,
																											)
																										}
																									>
																										<SelectTrigger
																											className={
																												!block.dynamicType
																													? "border-red-500"
																													: ""
																											}
																										>
																											<SelectValue placeholder="Seleccionar tipo" />
																										</SelectTrigger>
																										<SelectContent>
																											<SelectItem value="drag_drop">
																												Arrastrar y Soltar
																											</SelectItem>
																											<SelectItem value="matching">
																												Emparejamiento
																											</SelectItem>
																											<SelectItem value="sorting">
																												Ordenamiento
																											</SelectItem>
																											<SelectItem value="fill_blanks">
																												Llenar Espacios
																											</SelectItem>
																											<SelectItem value="simulation">
																												Simulación
																											</SelectItem>
																										</SelectContent>
																									</Select>
																								</div>
																							)}

																							{(block.type === "question" ||
																								block.type === "quiz") && (
																								<div className="space-y-2">
																									<Label>
																										Tipo de Pregunta *
																									</Label>
																									<Select
																										value={block.questionType}
																										onValueChange={(value) =>
																											updateBlock(
																												module.id,
																												block.id,
																												"questionType",
																												value,
																											)
																										}
																									>
																										<SelectTrigger
																											className={
																												!block.questionType
																													? "border-red-500"
																													: ""
																											}
																										>
																											<SelectValue placeholder="Seleccionar tipo" />
																										</SelectTrigger>
																										<SelectContent>
																											<SelectItem value="multiple_choice">
																												Opción Múltiple
																											</SelectItem>
																											<SelectItem value="true_false">
																												Verdadero/Falso
																											</SelectItem>
																											<SelectItem value="open_ended">
																												Respuesta Abierta
																											</SelectItem>
																											<SelectItem value="matching">
																												Emparejamiento
																											</SelectItem>
																											<SelectItem value="ordering">
																												Ordenamiento
																											</SelectItem>
																										</SelectContent>
																									</Select>
																								</div>
																							)}
																						</div>

																						{(block.type === "question" ||
																							block.type === "quiz") &&
																							block.questionType && (
																								<Alert>
																									<AlertDescription>
																										{block.questionType ===
																											"multiple_choice" &&
																											"✓ Permite una o más respuestas correctas"}
																										{block.questionType ===
																											"true_false" &&
																											"✓ Debe tener exactamente 2 opciones (Verdadero/Falso)"}
																										{block.questionType ===
																											"open_ended" &&
																											"✓ El usuario escribirá una respuesta libre"}
																										{block.questionType ===
																											"matching" &&
																											"✓ El usuario emparejará elementos relacionados"}
																										{block.questionType ===
																											"ordering" &&
																											"✓ El usuario ordenará las respuestas correctamente"}
																									</AlertDescription>
																								</Alert>
																							)}
																					</TabsContent>
																				</Tabs>

																				{(block.type === "question" ||
																					block.type === "quiz") &&
																					block.questionType &&
																					block.questionType !==
																						"open_ended" && (
																						<>
																							<Separator className="my-6" />

																							{block.questionType ===
																							"matching" ? (
																								<div className="space-y-4">
																									<div className="flex items-center justify-between">
																										<div>
																											<h5 className="text-base font-semibold">
																												Pares Relacionales (
																												{
																													block.relationalPairs
																														.length
																												}
																												)
																											</h5>
																											<p className="text-sm text-muted-foreground">
																												Los elementos se
																												mezclarán para que el
																												usuario los empareje
																											</p>
																										</div>
																										<Button
																											onClick={() =>
																												addRelationalPair(
																													module.id,
																													block.id,
																												)
																											}
																											size="sm"
																											variant="outline"
																											type="button"
																										>
																											<Plus className="w-4 h-4 mr-2" />
																											Agregar Par
																										</Button>
																									</div>

																									{block.relationalPairs
																										.length === 0 ? (
																										<Alert>
																											<AlertCircle className="h-4 w-4" />
																											<AlertDescription>
																												Agrega al menos 2 pares
																												relacionales para este
																												tipo de pregunta.
																											</AlertDescription>
																										</Alert>
																									) : (
																										<div className="space-y-3">
																											{block.relationalPairs.map(
																												(pair, pairIndex) => (
																													<Card
																														key={pair.id}
																														className="p-4"
																													>
																														<div className="flex items-center gap-4">
																															<div className="text-sm font-medium min-w-16">
																																Par{" "}
																																{pairIndex + 1}:
																															</div>
																															<div className="flex-1 grid grid-cols-2 gap-4">
																																<div className="space-y-1">
																																	<Label className="text-xs text-muted-foreground">
																																		Elemento
																																		Izquierdo *
																																	</Label>
																																	<Input
																																		value={
																																			pair.leftItem
																																		}
																																		onChange={(
																																			e,
																																		) =>
																																			updateRelationalPair(
																																				module.id,
																																				block.id,
																																				pair.id,
																																				"leftItem",
																																				e.target
																																					.value,
																																			)
																																		}
																																		placeholder="Concepto, término..."
																																		className={
																																			!pair.leftItem.trim()
																																				? "border-red-500"
																																				: ""
																																		}
																																	/>
																																</div>
																																<div className="space-y-1">
																																	<Label className="text-xs text-muted-foreground">
																																		Elemento
																																		Derecho *
																																	</Label>
																																	<Input
																																		value={
																																			pair.rightItem
																																		}
																																		onChange={(
																																			e,
																																		) =>
																																			updateRelationalPair(
																																				module.id,
																																				block.id,
																																				pair.id,
																																				"rightItem",
																																				e.target
																																					.value,
																																			)
																																		}
																																		placeholder="Definición, descripción..."
																																		className={
																																			!pair.rightItem.trim()
																																				? "border-red-500"
																																				: ""
																																		}
																																	/>
																																</div>
																															</div>
																															<div className="flex items-center gap-2">
																																<Checkbox
																																	checked={
																																		pair.correctPair
																																	}
																																	onCheckedChange={(
																																		checked,
																																	) =>
																																		updateRelationalPair(
																																			module.id,
																																			block.id,
																																			pair.id,
																																			"correctPair",
																																			checked,
																																		)
																																	}
																																/>
																																<Label className="text-sm whitespace-nowrap">
																																	Par Correcto
																																</Label>
																															</div>
																															<Button
																																variant="ghost"
																																size="sm"
																																onClick={() =>
																																	deleteRelationalPair(
																																		module.id,
																																		block.id,
																																		pair.id,
																																	)
																																}
																																className="text-destructive hover:text-destructive"
																																type="button"
																															>
																																<Trash2 className="w-4 h-4" />
																															</Button>
																														</div>
																													</Card>
																												),
																											)}
																										</div>
																									)}
																								</div>
																							) : (
																								<div className="space-y-4">
																									<div className="flex items-center justify-between">
																										<div>
																											<h5 className="text-base font-semibold">
																												Respuestas (
																												{block.answers.length})
																											</h5>
																											<p className="text-sm text-muted-foreground">
																												{block.questionType ===
																													"true_false" &&
																													"Debe tener exactamente 2 respuestas"}
																												{block.questionType ===
																													"multiple_choice" &&
																													"Marca una o más respuestas como correctas"}
																												{block.questionType ===
																													"ordering" &&
																													"El orden determina la respuesta correcta"}
																											</p>
																										</div>
																										<Button
																											onClick={() =>
																												addAnswer(
																													module.id,
																													block.id,
																												)
																											}
																											size="sm"
																											variant="outline"
																											type="button"
																											disabled={
																												block.questionType ===
																													"true_false" &&
																												block.answers.length >=
																													2
																											}
																										>
																											<Plus className="w-4 h-4 mr-2" />
																											Agregar Respuesta
																										</Button>
																									</div>

																									{block.answers.length ===
																									0 ? (
																										<Alert>
																											<AlertCircle className="h-4 w-4" />
																											<AlertDescription>
																												Agrega al menos una
																												respuesta para este tipo
																												de pregunta.
																											</AlertDescription>
																										</Alert>
																									) : (
																										<div className="space-y-3">
																											{block.answers.map(
																												(
																													answer,
																													answerIndex,
																												) => (
																													<Card
																														key={answer.id}
																														className="p-4"
																													>
																														<div className="space-y-3">
																															<div className="flex items-center gap-4">
																																<div className="text-sm font-medium min-w-20">
																																	Respuesta{" "}
																																	{answerIndex +
																																		1}
																																	:
																																</div>
																																<div className="flex-1">
																																	<Input
																																		value={
																																			answer.text
																																		}
																																		onChange={(
																																			e,
																																		) =>
																																			updateAnswer(
																																				module.id,
																																				block.id,
																																				answer.id,
																																				"text",
																																				e.target
																																					.value,
																																			)
																																		}
																																		placeholder="Texto de la respuesta"
																																		className={
																																			!answer.text.trim()
																																				? "border-red-500"
																																				: ""
																																		}
																																	/>
																																</div>
																																{block.questionType !==
																																	"ordering" && (
																																	<div className="flex items-center gap-2">
																																		<Checkbox
																																			checked={
																																				answer.isCorrect
																																			}
																																			onCheckedChange={(
																																				checked,
																																			) =>
																																				updateAnswer(
																																					module.id,
																																					block.id,
																																					answer.id,
																																					"isCorrect",
																																					checked,
																																				)
																																			}
																																		/>
																																		<Label className="text-sm whitespace-nowrap">
																																			Correcta
																																		</Label>
																																	</div>
																																)}
																																<Button
																																	variant="ghost"
																																	size="sm"
																																	onClick={() =>
																																		deleteAnswer(
																																			module.id,
																																			block.id,
																																			answer.id,
																																		)
																																	}
																																	className="text-destructive hover:text-destructive"
																																	type="button"
																																>
																																	<Trash2 className="w-4 h-4" />
																																</Button>
																															</div>

																															<div className="ml-24">
																																<Label className="text-sm">
																																	Retroalimentación
																																	(opcional)
																																</Label>
																																<Textarea
																																	value={
																																		answer.feedback
																																	}
																																	onChange={(
																																		e,
																																	) =>
																																		updateAnswer(
																																			module.id,
																																			block.id,
																																			answer.id,
																																			"feedback",
																																			e.target
																																				.value,
																																		)
																																	}
																																	placeholder="Mensaje que verá el usuario al seleccionar esta respuesta"
																																	rows={2}
																																	className="mt-1"
																																/>
																															</div>
																														</div>
																													</Card>
																												),
																											)}
																										</div>
																									)}
																								</div>
																							)}
																						</>
																					)}

																				{/* Interactive blocks with matching */}
																				{block.type === "interactive" &&
																					block.dynamicType === "matching" && (
																						<>
																							<Separator className="my-6" />

																							<div className="space-y-4">
																								<div className="flex items-center justify-between">
																									<div>
																										<h5 className="text-base font-semibold">
																											Pares Relacionales (
																											{
																												block.relationalPairs
																													.length
																											}
																											)
																										</h5>
																										<p className="text-sm text-muted-foreground">
																											Para el tipo interactivo
																											de emparejamiento
																										</p>
																									</div>
																									<Button
																										onClick={() =>
																											addRelationalPair(
																												module.id,
																												block.id,
																											)
																										}
																										size="sm"
																										variant="outline"
																										type="button"
																									>
																										<Plus className="w-4 h-4 mr-2" />
																										Agregar Par
																									</Button>
																								</div>

																								{block.relationalPairs
																									.length === 0 ? (
																									<Alert>
																										<AlertCircle className="h-4 w-4" />
																										<AlertDescription>
																											Agrega al menos 2 pares
																											para la actividad
																											interactiva.
																										</AlertDescription>
																									</Alert>
																								) : (
																									<div className="space-y-3">
																										{block.relationalPairs.map(
																											(pair, pairIndex) => (
																												<Card
																													key={pair.id}
																													className="p-4"
																												>
																													<div className="flex items-center gap-4">
																														<div className="text-sm font-medium min-w-16">
																															Par{" "}
																															{pairIndex + 1}:
																														</div>
																														<div className="flex-1 grid grid-cols-2 gap-4">
																															<div className="space-y-1">
																																<Label className="text-xs text-muted-foreground">
																																	Elemento
																																	Izquierdo *
																																</Label>
																																<Input
																																	value={
																																		pair.leftItem
																																	}
																																	onChange={(
																																		e,
																																	) =>
																																		updateRelationalPair(
																																			module.id,
																																			block.id,
																																			pair.id,
																																			"leftItem",
																																			e.target
																																				.value,
																																		)
																																	}
																																	placeholder="Concepto..."
																																	className={
																																		!pair.leftItem.trim()
																																			? "border-red-500"
																																			: ""
																																	}
																																/>
																															</div>
																															<div className="space-y-1">
																																<Label className="text-xs text-muted-foreground">
																																	Elemento
																																	Derecho *
																																</Label>
																																<Input
																																	value={
																																		pair.rightItem
																																	}
																																	onChange={(
																																		e,
																																	) =>
																																		updateRelationalPair(
																																			module.id,
																																			block.id,
																																			pair.id,
																																			"rightItem",
																																			e.target
																																				.value,
																																		)
																																	}
																																	placeholder="Definición..."
																																	className={
																																		!pair.rightItem.trim()
																																			? "border-red-500"
																																			: ""
																																	}
																																/>
																															</div>
																														</div>
																														<Button
																															variant="ghost"
																															size="sm"
																															onClick={() =>
																																deleteRelationalPair(
																																	module.id,
																																	block.id,
																																	pair.id,
																																)
																															}
																															className="text-destructive hover:text-destructive"
																															type="button"
																														>
																															<Trash2 className="w-4 h-4" />
																														</Button>
																													</div>
																												</Card>
																											),
																										)}
																									</div>
																								)}
																							</div>
																						</>
																					)}
																			</CardContent>
																		)}
																	</Card>
																);
															})}
														</div>
													)}
												</div>
											</CardContent>
										)}
									</Card>
								);
							})
						)}
					</CardContent>
				</Card>

				{/* Validation Summary */}
				{modules.length > 0 && (
					<Card>
						<CardHeader>
							<CardTitle>Resumen de Validación</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div className="flex items-center gap-2">
									{form.formState.isValid ? (
										<CheckCircle2 className="w-5 h-5 text-green-500" />
									) : (
										<AlertCircle className="w-5 h-5 text-red-500" />
									)}
									<div>
										<p className="font-medium">Información de la Guía</p>
										<p className="text-sm text-muted-foreground">
											{form.formState.isValid ? "Completo" : "Incompleto"}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{modules.length > 0 &&
									modules.every((m) => m.name.trim() && m.blocks.length > 0) ? (
										<CheckCircle2 className="w-5 h-5 text-green-500" />
									) : (
										<AlertCircle className="w-5 h-5 text-red-500" />
									)}
									<div>
										<p className="font-medium">{modules.length} Módulos</p>
										<p className="text-sm text-muted-foreground">
											{
												modules.filter(
													(m) => m.name.trim() && m.blocks.length > 0,
												).length
											}{" "}
											completos
										</p>
									</div>
								</div>

								<div className="flex items-center gap-2">
									{modules.every((m) =>
										m.blocks.every((b) => validateBlock(b).isValid),
									) ? (
										<CheckCircle2 className="w-5 h-5 text-green-500" />
									) : (
										<AlertCircle className="w-5 h-5 text-red-500" />
									)}
									<div>
										<p className="font-medium">
											{modules.reduce((acc, m) => acc + m.blocks.length, 0)}{" "}
											Bloques
										</p>
										<p className="text-sm text-muted-foreground">
											{modules.reduce(
												(acc, m) =>
													acc +
													m.blocks.filter((b) => validateBlock(b).isValid)
														.length,
												0,
											)}{" "}
											válidos
										</p>
									</div>
								</div>
							</div>

							{!canSubmitForm() && (
								<Alert variant="destructive">
									<AlertCircle className="h-4 w-4" />
									<AlertDescription>
										Por favor, completa todos los campos requeridos y corrige
										los errores antes de guardar la guía.
									</AlertDescription>
								</Alert>
							)}
						</CardContent>
					</Card>
				)}

				{/* Form Actions */}
				<div className="flex items-center justify-between gap-4 pb-8">
					<Button
						type="button"
						title="Cancelar"
						variant="outline"
						onClick={() => push("/admin/guides")}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
					<div className="flex items-center gap-2">
						<Button
							type="submit"
							title={getButtonText()}
							disabled={isSubmitting || !canSubmitForm()}
							className="min-w-[150px]"
						>
							{getButtonText()}
						</Button>
					</div>
				</div>
			</form>
		</Form>
	);
}
