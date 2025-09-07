import { JWT } from "next-auth/jwt"
import { NextRequest } from "next/server"

declare module "next-auth/middleware" {
  interface NextRequestWithAuth extends NextRequest {
    nextauth: {
      token: JWT | null
    }
  }
}