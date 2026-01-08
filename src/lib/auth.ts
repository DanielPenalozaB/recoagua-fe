import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export interface ApiUser {
  id: number;
  email: string;
  name: string;
  language: string;
  role: string;
  city: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  success: true;
  message: "Operation successful";
  data: {
    user: ApiUser;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export interface RegisterResponse {
  id: number;
  email: string;
  name: string;
  language: string;
  role: string;
  city: {
    id: number;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  emailConfirmationToken?: string | null;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            }
          );

          if (!res.ok) {
            return null;
          }

          const loginResponse: LoginResponse = await res.json();

          // Return user object that matches our extended User interface
          return {
            id: loginResponse.data.user.id.toString(),
            email: loginResponse.data.user.email,
            name: loginResponse.data.user.name,
            accessToken: loginResponse.data.accessToken,
            refreshToken: loginResponse.data.refreshToken,
            role: loginResponse.data.user.role,
            language: loginResponse.data.user.language,
            city: loginResponse.data.user.city,
            expiresIn: loginResponse.data.expiresIn,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.accessTokenExpires = Date.now() + (user.expiresIn || 3600) * 1000;
        token.role = user.role;
        token.language = user.language;
        token.city = user.city;
        return token;
      }

      // Return previous token if the accessToken has not expired yet
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      console.log("Token expired, refreshing...");
      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      if (session.user) {
        session.user.id = token.sub || "";
        session.user.role = (token.role as string) || "";
        session.user.language = (token.language as string) || "";
        session.user.city =
          (token.city as { id: number; name: string } | null) || null;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
};

interface JWTToken {
  accessToken?: string;
  refreshToken?: string;
  accessTokenExpires?: number;
  error?: string;
  sub?: string;
  role?: string;
  language?: string;
  city?: { id: number; name: string } | null;
}

async function refreshAccessToken(token: JWTToken) {
  try {
    console.log("Attempting to refresh token with:", {
      tokenExists: !!token.refreshToken,
      tokenLength: token.refreshToken?.length,
      expiryTime: token.accessTokenExpires
        ? new Date(token.accessTokenExpires).toISOString()
        : "undefined",
      currentTime: new Date().toISOString(),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          refreshToken: token.refreshToken,
        }),
      }
    );

    console.log("Refresh token response status:", response.status);

    if (!response.ok) {
      // Try to get more details from the response
      const errorText = await response.text();
      console.error("Refresh token failed with details:", errorText);
      throw new Error(
        `Refresh token failed: ${response.status} - ${errorText}`
      );
    }

    const refreshedTokens = await response.json();
    console.log("Refresh token successful");

    return {
      ...token,
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken,
      accessTokenExpires: Date.now() + refreshedTokens.data.expiresIn * 1000,
      error: undefined,
    };
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
