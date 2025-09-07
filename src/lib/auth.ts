import { NextAuthOptions, User } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export interface ApiUser {
  id: number
  email: string
  name: string
  language: string
  role: string
  city: {
    id: number
    name: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface LoginResponse {
  success: true,
  message: 'Operation successful',
  data: {
    user: ApiUser
    accessToken: string
    refreshToken: string
    expiresIn: number
  }
}

export interface RegisterResponse {
  id: number
  email: string
  name: string
  language: string
  role: string
  city: {
    id: number
    name: string
  } | null
  createdAt: string
  updatedAt: string
  emailConfirmationToken?: string | null
}

// Type guard to check if it's our custom User type
function isCustomUser(user: any): user is User & {
  accessToken?: string;
  refreshToken?: string;
  role?: string;
  language?: string;
  city?: { id: number; name: string } | null;
  expiresIn?: number;
} {
  return user && typeof user === 'object' && 'role' in user;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) {
            return null
          }

          const loginResponse: LoginResponse = await res.json()


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
          }
        } catch (error) {
          console.error('Login error:', error)
          return null
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Add custom properties to the token only if it's our custom user type
      if (user && isCustomUser(user)) {
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
        token.role = user.role
        token.language = user.language
        token.city = user.city
        token.accessTokenExpires = Date.now() + (user.expiresIn || 3600) * 1000
      }

      // Check if access token needs refresh
      if (token.accessToken && token.refreshToken && token.accessTokenExpires) {
        try {
          // Check if token is expired (with 5-minute buffer)
          const tokenExpirationTime = token.accessTokenExpires
          const now = Date.now()
          const fiveMinutesFromNow = now + 5 * 60 * 1000 // 5 minutes buffer

          if (tokenExpirationTime < fiveMinutesFromNow) {
            const refreshedTokens = await refreshAccessToken(token.refreshToken);

            if (refreshedTokens) {
              token.accessToken = refreshedTokens.accessToken
              token.refreshToken = refreshedTokens.refreshToken
              token.accessTokenExpires = Date.now() + refreshedTokens.expiresIn * 1000
              token.error = undefined
            } else {
              token.error = "RefreshAccessTokenError"
            }
          }
        } catch (error) {
          console.error('Token refresh error:', error)
          token.error = "RefreshAccessTokenError"
        }
      }

      return token
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.refreshToken = token.refreshToken;
      session.error = token.error;

      if (session.user) {
        session.user.id = token.sub || '';
        session.user.role = token.role as string || ''
        session.user.language = token.language as string || ''
        session.user.city = token.city as { id: number; name: string } | null || null
      }

      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
}

async function refreshAccessToken(refreshToken: string): Promise<{
  accessToken: string
  refreshToken: string
  expiresIn: number
} | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    })

    if (!res.ok) {
      console.error('Refresh token request failed:', res.status, res.statusText)
      return null
    }

    const refreshedTokens: LoginResponse = await res.json()

    return {
      accessToken: refreshedTokens.data.accessToken,
      refreshToken: refreshedTokens.data.refreshToken,
      expiresIn: refreshedTokens.data.expiresIn,
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return null
  }
}