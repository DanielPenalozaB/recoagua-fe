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
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
	useCreateRegion,
	useRegion,
	useUpdateRegion,
} from "@/features/regions/hooks/use-region";

const regionFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "El nombre debe tener al menos 2 caracteres.",
		})
		.max(45, {
			message: "El nombre debe tener menos de 45 caracteres.",
		}),
	description: z.string().optional(),
});

type RegionFormValues = z.infer<typeof regionFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<RegionFormValues> = {
	name: "",
	description: "",
};

interface RegionsCreateEditFormProps {
	readonly regionId?: number;
}

export function RegionsCreateEditForm({
	regionId,
}: RegionsCreateEditFormProps) {
	const { push } = useRouter();
	const createRegionMutation = useCreateRegion();
	const updateRegionMutation = useUpdateRegion();
	const getRegionMutation = useRegion(regionId);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<RegionFormValues>({
		resolver: zodResolver(regionFormSchema),
		defaultValues,
		mode: "onChange",
		shouldFocusError: true,
	});

	const onSubmit = async (formData: RegionFormValues) => {
		setIsSubmitting(true);
		try {
			// Prepare data for API call
			const regionData = {
				name: formData.name,
				description: formData.description,
				language: "es",
			};

			if (regionId) {
				await updateRegionMutation.mutateAsync({
					id: regionId,
					data: regionData,
				});
			} else {
				await createRegionMutation.mutateAsync(regionData);
			}

			// Redirect to regions list after successful creation
			push("/admin/regions");
		} catch (error) {
			console.error("Failed to create region:", error);
			const message = "Ocurrió un error al guardar la región. Intenta nuevamente.";
			form.setError("root", { message });
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (getRegionMutation?.isSuccess) {
			const region = getRegionMutation.data.data;
			form.setValue("name", region.name);
			form.setValue("description", region.description);
		}
	}, [
		getRegionMutation?.isSuccess,
		form.setValue,
		getRegionMutation?.data?.data,
	]);

	const getButtonText = () => {
		if (regionId) {
			return isSubmitting ? "Actualizando..." : "Actualizar región";
		}
		return isSubmitting ? "Creando..." : "Crear región";
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
						name="description"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Descripción</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingresa la descripción"
										type="text"
										className="bg-white"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
			</div>
			{form.formState.errors.root && (
				<div role="alert" aria-live="assertive" className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
					<span>{form.formState.errors.root.message}</span>
				</div>
			)}
			<Button
				type="button"
				title="Cancelar"
				variant="outline"
				className="mr-2"
				onClick={() => push("/admin/regions")}
					disabled={isSubmitting}
				>
					Cancelar
				</Button>
				<Button
					type="submit"
					title={getButtonText()}
					disabled={isSubmitting || !form.formState.isValid}
					isLoading={isSubmitting}
				>
					{getButtonText()}
				</Button>
			</form>
		</Form>
	);
}
