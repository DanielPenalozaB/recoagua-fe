"use client";

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface AuthProviderProps {
	readonly children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
	return <SessionProvider>{children}</SessionProvider>;
}
