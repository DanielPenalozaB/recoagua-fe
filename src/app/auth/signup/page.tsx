"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCities } from "@/features/cities";

const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

const signUpFormSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z
    .string()
    .email("Por favor, ingresa un email válido")
    .min(1, "El email es obligatorio"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  cityId: z.number().min(1, "Selecciona una ciudad"),
  language: z.enum(["en", "es"]),
});

type SignUpFormValues = z.infer<typeof signUpFormSchema>;

export default function SignUp() {
  const { push } = useRouter();
  const { data } = useCities({ limit: 100 });
  const { data: session } = useSession();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    mode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      cityId: 0,
      language: "en",
    },
  });

  // If user already logged in, redirect to home
  useEffect(() => {
    if (session) {
      push("/");
    }
  }, [session, push]);

  const onSubmit = async (values: SignUpFormValues) => {
    setIsSubmitting(true);
    try {
      // NOTE: adjust path if your auth register endpoint differs (e.g. /auth/register)
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.status === 400) {
        const payload = await res.json().catch(() => null);
        const message = payload?.message ?? "Este email ya está en uso.";
        form.setError("root", { message });
        toast.error(message);
        setIsSubmitting(false);
        return;
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        const message = payload?.message ?? "Ocurrió un error al registrarse";
        form.setError("root", { message });
        toast.error(message);
        setIsSubmitting(false);
        return;
      }

      toast.success(
        "Registro exitoso. Revisa tu correo para confirmar la cuenta.",
      );
      // redirect to sign in
      push("/auth/signin");
    } catch (error) {
      console.error("Register error:", error);
      const message = "Ocurrió un error inesperado. Intenta nuevamente.";
      form.setError("root", { message });
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-6 md:p-10 w-full min-h-svh">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Crear cuenta</CardTitle>
            <CardDescription>
              Ingresa tus datos para crear una nueva cuenta.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Tu nombre"
                            disabled={
                              form.formState.isSubmitting || isSubmitting
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="m@example.com"
                            disabled={
                              form.formState.isSubmitting || isSubmitting
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="********"
                              disabled={
                                form.formState.isSubmitting || isSubmitting
                              }
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                              onClick={() => setShowPassword((prev) => !prev)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                              <span className="sr-only">
                                {showPassword
                                  ? "Ocultar contraseña"
                                  : "Mostrar contraseña"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cityId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ciudad</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number.parseInt(value, 10))
                          }
                          value={field.value ? field.value.toString() : ""}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full bg-white">
                              <SelectValue placeholder="Selecciona una ciudad" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {data?.data.map((city) => (
                              <SelectItem
                                key={city.id}
                                value={city.id.toString()}
                              >
                                {city.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {form.formState.errors.root && (
                    <div
                      role="alert"
                      aria-live="assertive"
                      className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
                    >
                      <AlertCircle aria-hidden="true" className="h-4 w-4 shrink-0" />
                      <span>{form.formState.errors.root.message}</span>
                    </div>
                  )}

                  <div>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={form.formState.isSubmitting || isSubmitting}
                    >
                      {isSubmitting || form.formState.isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Registrando...
                        </>
                      ) : (
                        "Registrarse"
                      )}
                    </Button>
                  </div>
                </div>

                <div className="mt-4 text-sm text-center">
                  ¿Ya tienes una cuenta?{" "}
                  <a
                    href="/auth/signin"
                    className="underline underline-offset-4"
                    onClick={(e) => {
                      e.preventDefault();
                      push("/auth/signin");
                    }}
                  >
                    Inicia sesión
                  </a>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
