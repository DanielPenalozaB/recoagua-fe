"use client";

import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

export function useAuth(required = true) {
	const { data: session, status } = useSession();
	const router = useRouter();

	useEffect(() => {
		if (status === "loading") return;

		if (required && !session) {
			signOut({ callbackUrl: "/" });
			router.push("/auth/signin");
		}
	}, [session, status, router, required]);

	return {
		session,
		status,
		isLoading: status === "loading",
		isAuthenticated: !!session,
	};
}
