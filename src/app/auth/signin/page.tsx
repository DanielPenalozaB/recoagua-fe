"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const signInFormSchema = z.object({
	email: z
		.email("Por favor, ingresa un email válido")
		.min(1, "El email es obligatorio"),
	password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

type SignInFormValues = z.infer<typeof signInFormSchema>;

export default function SignIn() {
	const { push } = useRouter();

	const form = useForm<SignInFormValues>({
		resolver: zodResolver(signInFormSchema),
		mode: "onChange",
		defaultValues: {
			email: "",
			password: "",
		},
	});

	useEffect(() => {
		const fromUnauthorized = document.referrer.includes("/unauthorized");

		if (fromUnauthorized) {
			toast.info(
				"Por favor, inicia sesión con una cuenta que tenga los permisos adecuados.",
			);
		}
	}, []);

	const onSubmit = async (values: SignInFormValues) => {
		try {
			const result = await signIn("credentials", {
				email: values.email,
				password: values.password,
				redirect: false,
			});

			if (result?.error) {
				toast.error(
					"Credenciales inválidas. Por favor, verifica tu email y contraseña.",
				);
			} else {
				setTimeout(() => {
					const searchParams = new URLSearchParams(window.location.search);
					const redirectPath = searchParams.get("redirect") || "/";

					push(redirectPath);
				}, 100);
			}
		} catch (error) {
			console.error("Login error:", error);
			toast.error("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
		}
	};

	return (
		<div className="flex justify-center items-center p-6 md:p-10 w-full min-h-svh">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>Inicia sesión</CardTitle>
						<CardDescription>
							Ingresa tus credenciales para acceder a tu cuenta.
						</CardDescription>
					</CardHeader>
					<CardContent>
						<Form {...form}>
							<form onSubmit={form.handleSubmit(onSubmit)}>
								<div className="flex flex-col gap-6">
									<FormField
										control={form.control}
										name="email"
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>
												<FormControl>
													<Input
														type="email"
														placeholder="m@example.com"
														disabled={form.formState.isSubmitting}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="password"
										render={({ field }) => (
											<FormItem>
												<div className="flex items-center">
													<FormLabel>Contraseña</FormLabel>
													<a
														href="/auth/forgot-password"
														className="inline-block ml-auto text-sm hover:underline underline-offset-4"
														onClick={(e) => {
															e.preventDefault();
															push("/auth/forgot-password");
														}}
													>
														¿Olvidaste tu contraseña?
													</a>
												</div>
												<FormControl>
													<Input
														type="password"
														disabled={form.formState.isSubmitting}
														{...field}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<div className="flex flex-col gap-3">
										<Button
											type="submit"
											className="w-full"
											disabled={form.formState.isSubmitting}
										>
											{form.formState.isSubmitting ? (
												<>
													<Loader2 className="mr-2 w-4 h-4 animate-spin" />
													Iniciando sesión...
												</>
											) : (
												"Iniciar sesión"
											)}
										</Button>
									</div>
								</div>

								<div className="mt-4 text-sm text-center">
									¿No tienes una cuenta?{" "}
									<a
										href="/auth/signup"
										className="underline underline-offset-4"
										onClick={(e) => {
											e.preventDefault();
											push("/auth/signup");
										}}
									>
										Regístrate
									</a>
								</div>
							</form>
						</Form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
