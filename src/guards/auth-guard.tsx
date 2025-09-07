"use client"

import { Loader2 } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { ReactNode, useEffect } from "react"

interface AuthGuardProps {
  readonly children: ReactNode
  readonly requireAuth?: boolean
  readonly requiredRole?: string
}

export default function AuthGuard({
  children,
  requireAuth = true,
  requiredRole
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "loading") return // Still loading

    if (requireAuth && !session) {
      router.push("/auth/signin")
      return
    }

    if (requiredRole && session?.user?.role !== requiredRole) {
      router.push("/unauthorized")
      return
    }

    // Check for token refresh error
    if (session?.error === "RefreshAccessTokenError") {
      router.push("/auth/signin?error=session-expired")
    }
  }, [session, status, router, requireAuth, requiredRole])

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (requireAuth && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (requiredRole && session?.user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">No autorizado</h1>
          <p className="text-gray-600">No tienes permiso para acceder a esta página.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}