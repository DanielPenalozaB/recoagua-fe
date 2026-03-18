import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    refreshToken?: string;
    error?: string;
    user: {
      id: string;
      role: string;
      language: string;
      city: {
        id: number;
        name: string;
      } | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name: string;
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    language?: string;
    city?: {
      id: number;
      name: string;
    } | null;
    expiresIn?: number;
  }

  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    language?: string;
    city?: {
      id: number;
      name: string;
    } | null;
    error?: string;
    accessTokenExpires?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
    refreshToken?: string;
    role?: string;
    language?: string;
    city?: {
      id: number;
      name: string;
    } | null;
    error?: string;
    accessTokenExpires?: number;
  }
}
