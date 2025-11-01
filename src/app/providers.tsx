"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/context/theme-provider";

const queryClient = new QueryClient();

export default function Providers({
	children,
}: {
	readonly children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<ThemeProvider>{children}</ThemeProvider>
			</AuthProvider>
		</QueryClientProvider>
	);
}
