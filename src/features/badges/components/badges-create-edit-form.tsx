"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { ImagePreview } from "@/components/ui/image-preview";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { CreateBadgeDto } from "@/types/badge";
import { Status } from "@/types/common";
import { useBadge, useCreateBadge, useUpdateBadge } from "../hooks/use-badge";

// Badge form schema
const badgeFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "El nombre debe tener al menos 2 caracteres.",
		})
		.max(45, {
			message: "El nombre debe tener menos de 45 caracteres.",
		}),
	description: z.string(),
	imageUrl: z.string().refine(
		(value) => {
			try {
				new URL(value);
				return true;
			} catch {
				return false;
			}
		},
		{
			message: "Debe ser una URL válida",
		},
	),
	requirements: z
		.string()
		.min(10, {
			message: "Los requisitos deben tener al menos 10 caracteres.",
		})
		.max(500, {
			message: "Los requisitos deben tener menos de 500 caracteres.",
		}),
	status: z.enum([Status.ACTIVE, Status.INACTIVE]),
});

type BadgeFormValues = z.infer<typeof badgeFormSchema>;

const defaultValues: Partial<BadgeFormValues> = {
	name: "",
	description: "",
	imageUrl: "",
	requirements: "",
	status: Status.INACTIVE,
};

interface BadgesCreateEditFormProps {
	readonly badgeId?: number;
}

export function BadgesCreateEditForm({ badgeId }: BadgesCreateEditFormProps) {
	const { push } = useRouter();
	const createBadgeMutation = useCreateBadge();
	const updateBadgeMutation = useUpdateBadge();
	const getBadgeMutation = useBadge(badgeId);

	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<BadgeFormValues>({
		resolver: zodResolver(badgeFormSchema),
		defaultValues,
		mode: "onChange",
	});

	const renderStatusLabel = (status: Status) => {
		if (status === Status.ACTIVE) {
			return "Activo";
		} else {
			return "Inactivo";
		}
	};

	const onSubmit = async (formData: BadgeFormValues) => {
		setIsSubmitting(true);
		try {
			// Prepare data for API call
			const badgeData: CreateBadgeDto = {
				name: formData.name,
				description: formData.description,
				imageUrl: formData.imageUrl,
				requirements: formData.requirements,
				status: formData.status,
			};

			if (badgeId) {
				await updateBadgeMutation.mutateAsync({ id: badgeId, data: badgeData });
			} else {
				await createBadgeMutation.mutateAsync(badgeData);
			}

			// Redirect to badges list after successful creation
			push("/admin/badges");
		} catch (error) {
			console.error("Ocurrió un error:", error);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (getBadgeMutation?.isSuccess && badgeId) {
			const badge = getBadgeMutation.data.data;
			form.reset({
				name: badge.name,
				description: badge.description || "",
				imageUrl: badge.imageUrl || "",
				requirements: badge.requirements,
				status: badge.status,
			});
		}
	}, [
		getBadgeMutation?.isSuccess,
		badgeId,
		form,
		getBadgeMutation?.data?.data,
	]);

	const getButtonText = () => {
		if (badgeId) {
			return isSubmitting ? "Actualizando..." : "Actualizar insignia";
		}
		return isSubmitting ? "Creando..." : "Crear insignia";
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Nombre</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingresa el nombre de la insignia"
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
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descripción (Opcional)</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Ingresa la descripción de la insignia"
										{...field}
										value={field.value || ""}
										className="min-h-[80px] bg-white"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="imageUrl"
						render={({ field }) => (
							<FormItem>
								<FormLabel>URL de la imagen (Opcional)</FormLabel>
								<FormControl>
									<div className="space-y-3">
										<Input
											placeholder="https://ejemplo.com/imagen-insignia.png"
											type="url"
											{...field}
											value={field.value || ""}
											className="bg-white"
										/>
										{field.value && (
											<ImagePreview
												imageUrl={field.value}
												altText={`Vista previa de ${form.watch("name") || "insignia"}`}
												className="max-w-xs w-fit bg-white"
											/>
										)}
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="requirements"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Requisitos</FormLabel>
								<FormControl>
									<Textarea
										placeholder="Describe los requisitos para obtener esta insignia"
										{...field}
										className="min-h-[100px] bg-white"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="status"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Estado</FormLabel>
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
										{Object.values(Status).map((status) => (
											<SelectItem key={status} value={status}>
												{renderStatusLabel(status)}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div className="flex gap-2">
					<Button
						type="button"
						variant="outline"
						onClick={() => push("/admin/badges")}
						disabled={isSubmitting}
					>
						Cancelar
					</Button>
					<Button
						type="submit"
						disabled={isSubmitting || !form.formState.isValid}
						isLoading={isSubmitting}
					>
						{getButtonText()}
					</Button>
				</div>
			</form>
		</Form>
	);
}
