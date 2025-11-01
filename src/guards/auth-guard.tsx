"use client";

import { Loader2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { type ReactNode, useEffect } from "react";

interface AuthGuardProps {
	readonly children: ReactNode;
	readonly requireAuth?: boolean;
	readonly requiredRole?: string | string[];
}

export default function AuthGuard({
	children,
	requireAuth = true,
	requiredRole,
}: AuthGuardProps) {
	const { data: session, status } = useSession();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		if (status === "loading") return; // Still loading

		// Check for token refresh error
		if (session?.error === "RefreshAccessTokenError") {
			const signInUrl = new URL("/auth/signin", window.location.origin);
			signInUrl.searchParams.set("callbackUrl", pathname);
			signInUrl.searchParams.set("error", "session-expired");
			router.push(signInUrl.toString());
			return;
		}

		if (requireAuth && !session) {
			const signInUrl = new URL("/auth/signin", window.location.origin);
			signInUrl.searchParams.set("callbackUrl", pathname);
			router.push(signInUrl.toString());
			return;
		}

		if (requiredRole && session) {
			const userRole = session.user?.role;
			const hasRequiredRole = Array.isArray(requiredRole)
				? requiredRole.includes(userRole)
				: userRole === requiredRole;

			if (!hasRequiredRole) {
				router.push("/unauthorized");
				return;
			}
		}
	}, [session, status, router, requireAuth, requiredRole, pathname]);

	if (status === "loading") {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (requireAuth && !session) {
		return (
			<div className="flex justify-center items-center min-h-screen">
				<Loader2 className="w-8 h-8 animate-spin" />
			</div>
		);
	}

	if (requiredRole && session) {
		const userRole = session.user?.role;
		const hasRequiredRole = Array.isArray(requiredRole)
			? requiredRole.includes(userRole)
			: userRole === requiredRole;

		if (!hasRequiredRole) {
			return (
				<div className="flex justify-center items-center min-h-screen">
					<div className="text-center">
						<h1 className="mb-2 font-bold text-2xl">No autorizado</h1>
						<p className="text-gray-600">
							No tienes permiso para acceder a esta página.
						</p>
					</div>
				</div>
			);
		}
	}

	return <>{children}</>;
}
