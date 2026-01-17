"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { BadgeCheck, Trophy, Medal } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/use-user";
import { getInitials } from "@/lib/utils";

const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    newPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
    confirmPassword: z
      .string()
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
      });
    }
  });

type ProfileFormValues = z.infer<typeof changePasswordFormSchema>;

export default function Profile() {
  const { data: user, isLoading, isError } = useUserProfile();

  console.log(user);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    mode: "onChange",
  });

  const [isChangingPassword, setIsChangingPassword] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="border-gray-900 border-b-2 rounded-full w-8 h-8 animate-spin"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Error al cargar el perfil. Por favor intenta nuevamente.</p>
      </div>
    );
  }

  return (
    <>
      {isChangingPassword ? (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => console.log(data))}
            className="gap-4 grid sm:grid-cols-3"
          >
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña actual</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contraseña actual"
                      type="password"
                      className="border !border-neutral-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nueva contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Nueva contraseña"
                      type="password"
                      className="border !border-neutral-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirmar contraseña</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Confirmar contraseña"
                      type="password"
                      className="border !border-neutral-200"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="!bg-neutral-500 hover:!bg-neutral-600"
                onClick={() => setIsChangingPassword(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={!form.formState.isValid}
                className="!bg-teal-600 hover:!bg-teal-500 !text-white"
              >
                Actualizar
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex max-sm:flex-col justify-between sm:items-center gap-4 bg-white shadow-sm p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="flex justify-center items-center bg-teal-600 rounded-full size-16 font-bold text-white text-2xl">
                {getInitials(user.data.name || "")}
              </span>
              <div className="flex flex-col">
                <span className="font-bold text-[#115E59] text-lg">
                  {user.data.name}
                </span>
                <span className="font-medium text-neutral-500 text-base">
                  {user.data.email}
                </span>
                {user.data.city && (
                  <span className="font-medium text-neutral-400 text-sm">
                    {user.data.city?.name}
                  </span>
                )}
              </div>
            </div>
            {!isChangingPassword && (
              <Button
                variant="outline"
                className="!bg-teal-600 hover:!bg-teal-500"
                onClick={() => setIsChangingPassword(true)}
              >
                Cambiar contraseña
              </Button>
            )}
          </div>
          <div className="flex md:flex-row flex-col items-center gap-5 w-full">
            <div className="flex items-center gap-5 w-full">
              <div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
                <div className="flex items-center gap-2">
                  <BadgeCheck className="size-6 text-sky-500" />
                  <span className="font-bold text-[#115E59] text-2xl">
                    {user.data.completedGuidesCount}
                  </span>
                </div>
                <span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
                  Guías completadas
                </span>
              </div>
              <div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
                <div className="flex items-center gap-2">
                  <Trophy className="size-6 text-yellow-500" />
                  <span className="font-bold text-[#115E59] text-2xl">
                    {user.data.experience}
                  </span>
                </div>
                <span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
                  Experiencia obtenida
                </span>
              </div>
            </div>
            <div className="flex flex-col justify-center items-center gap-3 bg-white shadow-sm p-6 rounded-lg w-full">
              <div className="flex items-center gap-2">
                <Medal className="size-6 text-orange-500" />
                <span className="font-bold text-[#115E59] text-2xl">
                  {user.data.badgesCount}
                </span>
              </div>
              <span className="font-medium text-neutral-500 text-base text-center sm:whitespace-nowrap">
                Insignias ganadas
              </span>
            </div>
          </div>

          <div className="w-full">
            <Tabs defaultValue="learning" className="w-full">
              <TabsList className="grid grid-cols-2 w-full !bg-neutral-200">
                <TabsTrigger
                  value="learning"
                  className="!text-neutral-400 [&[data-state=active]]:!text-neutral-400 [&[data-state=active]]:!bg-white"
                >
                  Aprendizaje
                </TabsTrigger>
                <TabsTrigger
                  value="achievements"
                  className="!text-neutral-400 [&[data-state=active]]:!text-neutral-400 [&[data-state=active]]:!bg-white"
                >
                  Logros
                </TabsTrigger>
              </TabsList>
              <TabsContent value="learning" className="mt-4">
                <div className="flex flex-col gap-6">
                  {/* Guides in Progress */}
                  {user.data.inProgressGuides &&
                    user.data.inProgressGuides.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-lg">En progreso</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {user.data.inProgressGuides.map((guide) => (
                            <div
                              key={guide.id}
                              className="bg-white shadow-sm p-4 border rounded-lg"
                            >
                              <h4 className="font-medium text-teal-800">
                                {guide.name}
                              </h4>
                              <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                                {guide.description}
                              </p>
                              <div className="flex justify-between items-center mt-3 text-sm">
                                <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-xs">
                                  {guide.difficulty}
                                </span>
                                <span className="text-neutral-400">
                                  {guide.totalPoints} pts
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {/* Completed Guides */}
                  {user.data.completedGuides &&
                    user.data.completedGuides.length > 0 && (
                      <div className="flex flex-col gap-3">
                        <h3 className="font-semibold text-lg">Completadas</h3>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {user.data.completedGuides.map((guide) => (
                            <div
                              key={guide.id}
                              className="bg-white shadow-sm p-4 border rounded-lg opacity-80"
                            >
                              <h4 className="font-medium text-teal-800">
                                {guide.name}
                              </h4>
                              <p className="mt-1 text-sm text-neutral-500 line-clamp-2">
                                {guide.description}
                              </p>
                              <div className="flex justify-between items-center mt-3 text-sm">
                                <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                                  Completada
                                </span>
                                <span className="text-neutral-400">
                                  {guide.totalPoints} pts
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  {!user.data.inProgressGuides?.length &&
                    !user.data.completedGuides?.length && (
                      <div className="py-8 text-center text-neutral-500">
                        No has iniciado ninguna guía aún.
                      </div>
                    )}
                </div>
              </TabsContent>
              <TabsContent value="achievements" className="mt-4">
                <div className="flex flex-col gap-6">
                  {/* Badges */}
                  {user.data.badges && user.data.badges.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-semibold text-lg">Insignias</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {user.data.badges.map((badge) => (
                          <div
                            key={badge.id}
                            className="flex flex-col items-center gap-2 bg-white shadow-sm p-4 border rounded-lg text-center"
                          >
                            <div className="size-16 bg-neutral-100 rounded-full flex items-center justify-center">
                              {badge.imageUrl ? (
                                <img
                                  src={badge.imageUrl}
                                  alt={badge.name}
                                  className="size-16 object-contain"
                                />
                              ) : (
                                <Medal className="size-8 text-yellow-500" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm">
                                {badge.name}
                              </h4>
                              <p className="text-xs text-neutral-500 mt-1">
                                {badge.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges */}
                  {user.data.challenges && user.data.challenges.length > 0 && (
                    <div className="flex flex-col gap-3">
                      <h3 className="font-semibold text-lg">Desafíos</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        {user.data.challenges.map((challenge) => (
                          <div
                            key={challenge.id}
                            className="bg-white shadow-sm p-4 border rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-medium text-teal-800">
                                {challenge.name}
                              </h4>
                              <span className="bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded text-xs font-medium">
                                {challenge.score} pts
                              </span>
                            </div>
                            <p className="mt-1 text-sm text-neutral-500">
                              {challenge.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!user.data.badges?.length &&
                    !user.data.challenges?.length && (
                      <div className="py-8 text-center text-neutral-500">
                        Aún no tienes logros. ¡Completa guías y desafíos para
                        ganarlos!
                      </div>
                    )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
}
