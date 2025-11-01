"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Trophy } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
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
import { getInitials } from "@/lib/utils";

const changePasswordFormSchema = z
	.object({
		currentPassword: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		newPassword: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
		confirmPassword: z
			.string()
			.min(6, "La contraseña debe tener al menos 6 caracteres"),
	})
	.superRefine(({ newPassword, confirmPassword }, ctx) => {
		if (newPassword !== confirmPassword) {
			ctx.addIssue({
				code: "custom",
				message: "Las contraseñas no coinciden",
				path: ["confirmPassword"],
			});
		}
	});

type ProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export default function Profile() {
	const { data: session, status } = useSession();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(changePasswordFormSchema),
		mode: "onChange",
	});

	const [isChangingPassword, setIsChangingPassword] = useState(false);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<div className="border-gray-900 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
			</div>
		);
	}

	if (!session) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<p>Por favor inicia sesión para ver tu perfil</p>
			</div>
		);
	}

	const user = session.user;

	return (
		<>
			{isChangingPassword ? (
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit((data) => console.log(data))}
						className="gap-4 grid sm:grid-cols-3"
					>
						<FormField
							control={form.control}
							name="currentPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Contraseña actual</FormLabel>
									<FormControl>
										<Input
											placeholder="Contraseña actual"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="newPassword"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Nueva contraseña</FormLabel>
									<FormControl>
										<Input
											placeholder="Nueva contraseña"
											type="password"
											{...field}
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
									<FormLabel>Confirmar contraseña</FormLabel>
									<FormControl>
										<Input
											placeholder="Confirmar contraseña"
											type="password"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								onClick={() => setIsChangingPassword(false)}
							>
								Cancelar
							</Button>
							<Button type="submit" disabled={!form.formState.isValid}>
								Actualizar
							</Button>
						</div>
					</form>
				</Form>
			) : (
				<div className="flex flex-col gap-5">
					<div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-white shadow-sm p-6 rounded-lg">
						<div className="flex items-center gap-4">
							<span className="flex justify-center items-center bg-teal-600 rounded-full size-16 font-bold text-white text-2xl">
								{user.image ? (
									<img
										src={user.image}
										alt={user.name || "User"}
										className="rounded-full w-16 h-16 object-cover"
									/>
								) : (
									getInitials(user.name || "")
								)}
							</span>
							<div className="flex flex-col">
								<span className="font-bold text-[#115E59] text-lg">
									{user.name}
								</span>
								<span className="font-medium text-neutral-500 text-base">
									{user.email}
								</span>
								{user.city && (
									<span className="font-medium text-neutral-400 text-sm">
										{user.city.name}
									</span>
								)}
							</div>
						</div>
						{!isChangingPassword && (
							<Button
								variant="outline"
								onClick={() => setIsChangingPassword(true)}
							>
								Cambiar contraseña
							</Button>
						)}
					</div>
					<div className="flex md:flex-row flex-col items-center gap-5 w-full">
						<div className="flex items-center gap-5 w-full">
							<div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
								<div className="flex items-center gap-2">
									<BadgeCheck className="size-6 text-sky-500" />
									<span className="font-bold text-[#115E59] text-2xl">2</span>
								</div>
								<span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
									Guías completadas
								</span>
							</div>
							<div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
								<div className="flex items-center gap-2">
									<Trophy className="size-6 text-yellow-500" />
									<span className="font-bold text-[#115E59] text-2xl">320</span>
								</div>
								<span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
									Experiencia obtenida
								</span>
							</div>
						</div>
						<div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
							<div className="flex items-center gap-2">
								<span className="font-bold text-[#115E59] text-2xl">350</span>
							</div>
							<span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
								Litros ahorrados
							</span>
						</div>
					</div>
					<div className="flex flex-col gap-4 mt-2">
						<h2 className="font-bold text-teal-800 text-xl">Tu información</h2>
						<div className="flex gap-2 bg-neutral-200 p-2 rounded-lg w-full">
							<div className="bg-white p-2 rounded-md w-full font-medium text-neutral-800 text-base text-center">
								Aprendizaje
							</div>
							<div className="bg-neutral-200 p-2 rounded-md w-full font-medium text-neutral-500 text-base text-center">
								Logros
							</div>
						</div>
						<div className="flex flex-col gap-5 bg-white p-6 border rounded-2xl">
							<div className="flex flex-col gap-2">
								<h2 className="font-bold text-teal-600 text-xl">Tu progreso</h2>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-center gap-2 font-medium text-[#14B8A6] text-base">
									<span className="text-neutral-800">Introducción</span>
									<span>Completo</span>
								</div>
								<div className="flex justify-start bg-neutral-200 rounded-full w-full h-3">
									<span className="bg-[#14B8A6] rounded-full w-full h-3"></span>
								</div>
							</div>
							<div className="flex flex-col gap-2">
								<div className="flex justify-between items-center gap-2 font-medium text-[#14B8A6] text-base">
									<span className="text-neutral-800">Canaletas</span>
									<span>50%</span>
								</div>
								<div className="flex justify-start bg-neutral-200 rounded-full w-full h-3">
									<span className="bg-[#14B8A6] rounded-full w-1/2 h-3"></span>
								</div>
							</div>
						</div>
					</div>
				</div>
			)}
		</>
	);
}
