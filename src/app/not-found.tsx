"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "@/components/ui/button";

export default function NotFound() {
	const { back } = useRouter();

	return (
		<main id="main-content" className="h-svh">
			<div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
				<p aria-hidden="true" className="text-[7rem] leading-tight font-bold">404</p>
				<h1 className="text-2xl font-bold">Página no encontrada</h1>
				<p className="text-muted-foreground text-center">
					Parece que la página que buscas no existe o ha sido eliminada.
				</p>
				<div className="mt-6 flex gap-4">
					<Button variant="outline" onClick={() => back()}>
						Atrás
					</Button>
					<Link href="/" className={buttonVariants()}>
						Regresar al inicio
					</Link>
				</div>
			</div>
		</main>
	);
}
