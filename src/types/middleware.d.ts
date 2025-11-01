import type { NextRequest } from "next/server";
import type { JWT } from "next-auth/jwt";

declare module "next-auth/middleware" {
	interface NextRequestWithAuth extends NextRequest {
		nextauth: {
			token: JWT | null;
		};
	}
}
