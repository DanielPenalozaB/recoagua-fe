import type {
	LoginRequest,
	LoginResponse,
	RefreshTokenResponse,
} from "@/types/auth";
import { ApiService } from "./api";

export class AuthService extends ApiService {
	async login(credentials: LoginRequest): Promise<LoginResponse> {
		const response = await fetch(`${this.baseUrl}/auth/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(credentials),
		});

		if (!response.ok) {
			throw new Error("Login failed");
		}

		return response.json();
	}

	async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
		const response = await fetch(`${this.baseUrl}/auth/refresh-token`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refreshToken }),
		});

		if (!response.ok) {
			throw new Error("Token refresh failed");
		}

		return response.json();
	}

	async logout(): Promise<void> {
		await this.authenticatedFetch("/auth/logout", {
			method: "POST",
		});
	}
}
