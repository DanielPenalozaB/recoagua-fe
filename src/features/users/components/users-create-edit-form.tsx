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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCities } from "@/features/cities/hooks/use-city";
import { UserRole } from "@/types/user";
import { toast } from "sonner";
import { useCreateUser, useUpdateUser, useUser } from "../hooks/use-user";

const profileFormSchema = z.object({
	name: z
		.string()
		.min(2, {
			message: "El nombre debe tener al menos 2 caracteres.",
		})
		.max(45, {
			message: "El nombre debe tener menos de 45 caracteres.",
		}),
	email: z.email({
		message: "Por favor, ingresa un email válido.",
	}),
	cityId: z.string({
		error: "Por favor, selecciona una ciudad.",
	}),
	role: z.enum(UserRole, {
		error: "Por favor, selecciona un rol.",
	}),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<ProfileFormValues> = {
	name: "",
	email: "",
	cityId: "",
};

interface UsersCreateEditFormProps {
	readonly userId?: number;
}

export function UsersCreateEditForm({ userId }: UsersCreateEditFormProps) {
	const { push } = useRouter();
	const createUserMutation = useCreateUser();
	const updateUserMutation = useUpdateUser();
	const getUserMutation = useUser(userId);
	const { data, isLoading, error } = useCities({ limit: 100 });

	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues,
		mode: "onChange",
		shouldFocusError: true,
	});

	const renderRoleLabel = (role: UserRole) => {
		switch (role.toLowerCase()) {
			case UserRole.ADMIN:
				return "Administrador";

			case UserRole.MODERATOR:
				return "Moderador";

			default:
				return "Ciudadano";
		}
	};

	const onSubmit = async (formData: ProfileFormValues) => {
		setIsSubmitting(true);
		try {
			// Prepare data for API call
			const userData = {
				email: formData.email,
				name: formData.name,
				cityId: Number.parseInt(formData.cityId, 10),
				role: formData.role,
				language: "es",
			};

			if (userId) {
				await updateUserMutation.mutateAsync({ id: userId, data: userData });
			} else {
				await createUserMutation.mutateAsync(userData);
			}

			// Redirect to users list after successful creation
			push("/admin/users");
		} catch (error) {
			console.error("Failed to create user:", error);
			const message = "Ocurrió un error al guardar el usuario. Intenta nuevamente.";
			form.setError("root", { message });
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	useEffect(() => {
		if (getUserMutation?.isSuccess) {
			const user = getUserMutation.data.data;
			form.setValue("name", user.name);
			form.setValue("email", user.email);
			form.setValue("role", user.role);

			if (user.city) {
				form.setValue("cityId", user.city.id.toString());
			}
		}
	}, [getUserMutation?.isSuccess, form.setValue, getUserMutation?.data?.data]);

	const placeholderText = error
		? "Error al cargar ciudades"
		: "Selecciona una ciudad";

	const cityItems = error ? (
		<SelectItem value="1" disabled>
			Error al cargar ciudades
		</SelectItem>
	) : (
		data?.data.map((city) => (
			<SelectItem key={city.id.toString()} value={city.id.toString()}>
				{city.name}
			</SelectItem>
		))
	);

	const getButtonText = () => {
		if (userId) {
			return isSubmitting ? "Actualizando..." : "Actualizar usuario";
		}
		return isSubmitting ? "Creando..." : "Crear usuario";
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
										placeholder="Ingresa el nombre completo"
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
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										placeholder="Ingresa el email"
										type="email"
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
						name="role"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rol</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value ?? ""}
								>
									<FormControl>
										<SelectTrigger className="w-full bg-white">
											<SelectValue placeholder="Selecciona un rol" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{Object.keys(UserRole).map((role) => (
											<SelectItem key={role} value={role.toLowerCase()}>
												{renderRoleLabel(role as UserRole)}
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
						name="cityId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Ciudad</FormLabel>
								<Select onValueChange={field.onChange} value={field.value}>
									<FormControl>
										<SelectTrigger className="w-full bg-white">
											<SelectValue
												placeholder={
													isLoading ? "Cargando ciudades..." : placeholderText
												}
											/>
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{isLoading ? (
											<SelectItem value="1" disabled>
												Cargando ciudades...
											</SelectItem>
										) : (
											cityItems
										)}
									</SelectContent>
								</Select>
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
					onClick={() => push("/admin/users")}
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
