"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// Validation schema with Spanish error messages
const validationSchema = Yup.object({
  email: Yup
    .string()
    .email("Por favor, ingresa un email válido")
    .required("El email es obligatorio"),
  password: Yup
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres")
    .required("La contraseña es obligatoria"),
});

interface FormValues {
  email: string;
  password: string;
}

export default function SignIn() {
  const { push } = useRouter();

  useEffect(() => {
    // Check if we were redirected from unauthorized page
    const searchParams = new URLSearchParams(window.location.search);
    const fromUnauthorized = document.referrer.includes('/unauthorized');

    if (fromUnauthorized) {
      toast.info('Por favor, inicia sesión con una cuenta que tenga los permisos adecuados.');
    }
  }, []);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema,
    onSubmit: async (values: FormValues, { setSubmitting }) => {
      try {
        const result = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (result?.error) {
          toast.error("Credenciales inválidas. Por favor, verifica tu email y contraseña.");
        } else {
          // Wait a moment for the session to be updated
          setTimeout(() => {
            // Get the redirect path from search params or use default
            const searchParams = new URLSearchParams(window.location.search);
            const redirectPath = searchParams.get('redirect') || '/';

            // Navigate to the appropriate dashboard based on role
            push(redirectPath);
          }, 100);
        }
      } catch (error) {
        console.error('Login error:', error);
        toast.error("Ocurrió un error inesperado. Por favor, intenta de nuevo.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Inicia sesión</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder a tu cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={formik.handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    required
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="text-sm text-red-500">{formik.errors.email}</div>
                  ) : null}
                </div>

                <div className="grid gap-3">
                  <div className="flex items-center">
                    <Label htmlFor="password">Contraseña</Label>
                    <a
                      href="/auth/forgot-password"
                      className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                      onClick={(e) => {
                        e.preventDefault();
                        push('/auth/forgot-password');
                      }}
                    >
                      ¿Olvidaste tu contraseña?
                    </a>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={formik.isSubmitting}
                  />
                  {formik.touched.password && formik.errors.password ? (
                    <div className="text-sm text-red-500">{formik.errors.password}</div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-3">
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={formik.isSubmitting}
                  >
                    {formik.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Iniciando sesión...
                      </>
                    ) : (
                      "Iniciar sesión"
                    )}
                  </Button>
                </div>
              </div>

              <div className="mt-4 text-center text-sm">
                ¿No tienes una cuenta?{" "}
                <a
                  href="/auth/signup"
                  className="underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault();
                    push('/auth/signup');
                  }}
                >
                  Regístrate
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}