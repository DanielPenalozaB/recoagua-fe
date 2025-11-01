import type { NextApiRequest, NextApiResponse } from "next";
import type { Session } from "next-auth";
import { getServerSession } from "next-auth/next";
import { getSession, signOut } from "next-auth/react";
import { authOptions } from "./auth";

// Client-side auth utilities
export const getClientSession = async () => {
	return await getSession();
};

export const getAccessToken = async () => {
	const session = await getSession();
	return session?.accessToken;
};

// Server-side auth utilities (for API routes and server components)
export const getServerSessionData = async (
	req: NextApiRequest,
	res: NextApiResponse,
) => {
	return await getServerSession(req, res, authOptions);
};

// API request helper with authentication
export const authenticatedFetch = async (
	url: string,
	options: RequestInit = {},
) => {
	const session = await getSession();

	if (!session?.accessToken) {
		throw new Error("No access token available");
	}

	const headers = {
		"Content-Type": "application/json",
		Authorization: `Bearer ${session.accessToken}`,
		...options.headers,
	};

	return fetch(url, {
		...options,
		headers,
	});
};

// Role-based access control helper
export const hasRole = (
	session: Session | null,
	requiredRole: string,
): boolean => {
	return session?.user?.role === requiredRole;
};

export const hasAnyRole = (
	session: Session | null,
	roles: string[],
): boolean => {
	return roles.includes(session?.user?.role || "");
};

// City-based access control helper
export const isFromCity = (
	session: Session | null,
	cityId: number,
): boolean => {
	return session?.user?.city?.id === cityId;
};

// Get dashboard path based on role
export const getDashboardPath = (role: string): string => {
	switch (role) {
		case "admin":
			return "/admin";
		case "moderator":
			return "/admin"; // or '/moderator' if you have a separate route
		case "citizen":
			return "/dashboard";
		default:
			return "/";
	}
};

// Logout utility
export const handleLogout = async () => {
	try {
		const session = await getSession();
		if (session?.accessToken) {
			await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
				method: "POST",
				headers: {
					Authorization: `Bearer ${session.accessToken}`,
					"Content-Type": "application/json",
				},
			});
		}

		// Clear NextAuth session
		await signOut({ redirect: false });

		// Force a hard refresh to clear any cached state
		window.location.href = "/auth/signin";
	} catch (error) {
		console.error("Logout error:", error);
		// Still redirect to signin even if there's an error
		window.location.href = "/auth/signin";
	}
};

// Check if user is authenticated
export const isAuthenticated = async (): Promise<boolean> => {
	const session = await getSession();
	return !!session;
};

// Get user role
export const getUserRole = async (): Promise<string | null> => {
	const session = await getSession();
	return session?.user?.role || null;
};
