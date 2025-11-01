/** biome-ignore-all lint/suspicious/noExplicitAny: Allow any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { use, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Zod schema for password validation
const passwordSchema = z
	.object({
		newPassword: z
			.string()
			.min(6, {
				message: "La contraseña debe tener al menos 6 caracteres.",
			})
			.max(100, {
				message: "La contraseña debe tener menos de 100 caracteres.",
			})
			.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
				message:
					"La contraseña debe contener al menos una mayúscula, una minúscula y un número.",
			}),
		confirmPassword: z.string(),
	})
	.refine((data) => data.newPassword === data.confirmPassword, {
		message: "Las contraseñas no coinciden.",
		path: ["confirmPassword"],
	});

type PasswordFormValues = z.infer<typeof passwordSchema>;

const defaultValues: Partial<PasswordFormValues> = {
	newPassword: "",
	confirmPassword: "",
};

export default function SetPasswordPage({
	params,
}: {
	params: Promise<{ password_token: string }>;
}) {
	const [isLoading, setIsLoading] = useState(true);
	const [isValidToken, setIsValidToken] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");

	const router = useRouter();
	const { password_token } = use(params);

	const form = useForm<PasswordFormValues>({
		resolver: zodResolver(passwordSchema),
		defaultValues,
		mode: "onChange",
	});

	const validateToken = useCallback(async () => {
		const token = password_token as string;

		if (!token) {
			setErrorMessage("Token inválido");
			setIsLoading(false);
			return;
		}

		try {
			const response = await fetch(`${API_URL}/auth/validate-password-token`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ token }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(errorData.message || "Token inválido o expirado");
			}

			setIsValidToken(true);
			setIsLoading(false);
		} catch (err: any) {
			setIsLoading(false);
			const message = err.message || "Token inválido o expirado";
			setErrorMessage(message);
			toast.error(message);
		}
	}, [password_token]);

	useEffect(() => {
		validateToken();
	}, [validateToken]);

	const onSubmit = async (data: PasswordFormValues) => {
		try {
			const response = await fetch(`${API_URL}/auth/setup-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					token: password_token,
					newPassword: data.newPassword,
				}),
			});

			if (!response.ok) {
				const errorData = await response.json();
				throw new Error(
					errorData.message || "Error al establecer la contraseña",
				);
			}

			toast.success("¡Contraseña establecida con éxito!");

			const loadingToast = toast.loading("Redirigiendo al inicio de sesión...");

			setTimeout(() => {
				toast.dismiss(loadingToast);
				router.push("/auth/signin");
			}, 2000);
		} catch (err: any) {
			toast.error(err.message || "Error al establecer la contraseña");
		}
	};

	const renderContent = () => {
		if (isLoading) {
			return (
				<div className="loading-section text-center">
					<p className="text-xl font-bold mb-2 text-neutral-800">
						Validando token...
					</p>
					<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
				</div>
			);
		}

		if (!isValidToken && errorMessage) {
			return (
				<div className="error-section text-center">
					<h2 className="text-xl font-bold mb-2 text-neutral-800">
						Token Inválido
					</h2>
					<p className="text-neutral-600 mb-4">{errorMessage}</p>
					<a
						href="/auth/forgot-password"
						className='inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive cursor-pointer bg-neutral-900 text-white shadow-xs hover:bg-neutral-900/90 h-9 px-4 py-2 has-[>svg]:px-3'
					>
						Solicitar nuevo enlace
					</a>
				</div>
			);
		}

		if (isValidToken) {
			return (
				<div className="password-setup-section">
					<h2 className="text-xl font-bold mb-4 text-neutral-800 text-center">
						Establecer Contraseña
					</h2>
					<p className="text-sm text-neutral-600 mb-6 text-center">
						Por favor, ingresa tu nueva contraseña
					</p>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<FormField
								control={form.control}
								name="newPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Nueva Contraseña</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Ingresa tu contraseña"
												{...field}
												className="w-full"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="confirmPassword"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirmar Contraseña</FormLabel>
										<FormControl>
											<Input
												type="password"
												placeholder="Repite tu contraseña"
												{...field}
												className="w-full"
											/>
										</FormControl>
										<FormMessage />
										<FormDescription>
											Mínimo 6 caracteres con mayúscula, minúscula y número
										</FormDescription>
									</FormItem>
								)}
							/>
							<Button
								type="submit"
								className="w-full"
								disabled={
									form.formState.isSubmitting || !form.formState.isValid
								}
								isLoading={form.formState.isSubmitting}
							>
								{form.formState.isSubmitting
									? "Estableciendo..."
									: "Establecer Contraseña"}
							</Button>
						</form>
					</Form>
				</div>
			);
		}
	};

	return (
		<div className="bg-primary-foreground container grid h-svh max-w-none items-center justify-center">
			<div className="mx-auto flex w-full flex-col justify-center space-y-2 py-8 sm:w-[480px] sm:p-8">
				<div className="bg-card text-card-foreground flex flex-col rounded-xl border p-6 shadow-sm gap-4">
					{renderContent()}
				</div>
			</div>
		</div>
	);
}
