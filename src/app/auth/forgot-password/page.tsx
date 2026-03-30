/** biome-ignore-all lint/suspicious/noExplicitAny: Allow any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { CompletedTask } from "@/components/icons";
import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from "@/components/ui";
import { sleep } from "@/lib/utils";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const formSchema = z.object({
	email: z.email({
		message: "Por favor, ingresa un email válido.",
	}),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordPage() {
	const { push } = useRouter();

	const [isLoading, setIsLoading] = useState(false);
	const [showMessage, setShowMessage] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
		},
		mode: "onChange",
		shouldFocusError: true,
	});

	const onSubmit = async (formData: FormValues) => {
		try {
			await forgotPassword(formData.email);
		} catch (error) {
			// Error handling is already done in the mutation
			console.error("Failed to generate password reset link:", error);
		}
	};

	const forgotPassword = async (email: string) => {
		setIsSubmitting(true);
		try {
			const response = await fetch(`${API_URL}/auth/forgot-password`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Error requesting password reset:", errorData);
				throw new Error(
					"Ocurrió un error al generar el enlace de restablecimiento. Por favor, intenta nuevamente.",
				);
			}

			setIsLoading(false);
			toast.success(
				"Petición de restablecimiento de contraseña enviada con éxito. Por favor, revisa tu bandeja de entrada o spam.",
			);
			setShowMessage(true);
			toast.loading("Redirigiendo...");
			await sleep(3000);
			toast.dismiss();
			push("/auth/signin");
		} catch (err: any) {
			setIsLoading(false);
			const message =
				err.message ||
				"Ocurrió un error al generar el enlace de restablecimiento. Por favor, intenta nuevamente.";
			setErrorMessage(message);
			toast.error(message);
		} finally {
			setIsSubmitting(false);
		}
	};

	const renderContent = () => {
		if (isLoading) {
			return (
				<div role="status" aria-live="polite" className="loading-section text-center">
					<p className="text-xl font-bold mb-2 text-neutral-800 dark:text-neutral-600">
						Enviando petición de restablecimiento de contraseña...
					</p>
					<div className="motion-safe:animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto" />
					<span className="sr-only">Procesando, por favor espera…</span>
				</div>
			);
		}

		if (showMessage) {
			return (
				<div
					role="status"
					aria-live="polite"
					aria-atomic="true"
					className="flex items-center flex-col gap-4"
				>
					<CompletedTask className="size-48" aria-hidden="true" />
					<h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200 text-center">
						Petición de restablecimiento de contraseña enviada
					</h2>
					<p className="text-sm text-neutral-600 text-center">
						A tu email se le ha enviado un enlace para establecer tu contraseña.
						Por favor, revisa tu bandeja de entrada o spam.
					</p>
				</div>
			);
		}

		if (errorMessage) {
			return (
				<div role="alert" aria-live="assertive" className="error-section text-center">
					<h2 className="text-xl font-bold mb-2 text-neutral-800 dark:text-neutral-200">
						Falló la petición
					</h2>
					<p className="text-neutral-600 mb-4">{errorMessage}</p>
					<Button asChild>
						<a href="/auth/signin">Ir al inicio de sesión</a>
					</Button>
				</div>
			);
		}

		return (
			<div className="flex flex-col gap-4">
				<h2 className="text-xl font-bold dark:text-neutral-200 text-neutral-800">
					Restablecer tu contraseña
				</h2>
				<p className="text-sm text-neutral-600 dark:text-neutral-400">
					Ingresa tu email y te enviaremos un enlace para restablecer tu
					contraseña.
				</p>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											placeholder="Ingresa tu email"
											type="email"
											autoComplete="email"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button
							type="button"
							title="Cancelar"
							variant="outline"
							className="!mr-2 m-0"
							onClick={() => push("/auth/signin")}
							disabled={isSubmitting}
						>
							Cancelar
						</Button>
						<Button
							type="submit"
							title={isSubmitting ? "Enviando..." : "Enviar petición"}
							disabled={isSubmitting || !form.formState.isValid}
							isLoading={isSubmitting}
						>
							{isSubmitting ? "Enviando..." : "Enviar petición"}
						</Button>
					</form>
				</Form>
			</div>
		);
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
