"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCities } from "@/features/cities";
import { Status } from "@/types/common";
import type { CreateZoneDto } from "@/types/zone";
import { useCreateZone, useUpdateZone, useZone } from "../hooks/use-zone";

// Zone form schema based on the DTO
const zoneFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    })
    .max(45, {
      message: "El nombre debe tener menos de 45 caracteres.",
    }),
  description: z.string().optional(),
  rainfall: z
    .number()
    .min(0, {
      message: "La precipitación no puede ser negativa.",
    })
    .optional(),
  latitude: z
    .number()
    .min(-90, {
      message: "La latitud debe ser entre -90 y 90 grados.",
    })
    .max(90, {
      message: "La latitud debe ser entre -90 y 90 grados.",
    }),
  longitude: z
    .number()
    .min(-180, {
      message: "La longitud debe ser entre -180 y 180 grados.",
    })
    .max(180, {
      message: "La longitud debe ser entre -180 y 180 grados.",
    }),
  recommendations: z.string().optional(),
  status: z.enum([Status.ACTIVE, Status.INACTIVE]),
  altitude: z
    .number()
    .min(0, {
      message: "La altitud no puede ser negativa.",
    })
    .optional(),
  soilType: z.string().optional(),
  avgTemperature: z
    .number()
    .min(-50, {
      message: "La temperatura debe ser entre -50°C y 60°C.",
    })
    .max(60, {
      message: "La temperatura debe ser entre -50°C y 60°C.",
    })
    .optional(),
  cityId: z.string({
    error: "Por favor, selecciona una ciudad.",
  }),
});

type ZoneFormValues = z.infer<typeof zoneFormSchema>;

const defaultValues: Partial<ZoneFormValues> = {
  name: "",
  description: "",
  rainfall: undefined,
  latitude: 0,
  longitude: 0,
  recommendations: "",
  status: Status.INACTIVE, // Fixed to DRAFT instead of INACTIVE
  altitude: undefined,
  soilType: "",
  avgTemperature: undefined,
  cityId: "",
};

interface ZonesCreateEditFormProps {
  readonly zoneId?: number;
}

export function ZonesCreateEditForm({ zoneId }: ZonesCreateEditFormProps) {
  const { push } = useRouter();
  const createZoneMutation = useCreateZone();
  const updateZoneMutation = useUpdateZone();
  const getZoneMutation = useZone(zoneId);

  const {
    data: cities,
    isLoading: citiesLoading,
    error: citiesError,
  } = useCities({
    limit: 100,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ZoneFormValues>({
    resolver: zodResolver(zoneFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const renderStatusLabel = (status: Status) => {
    if (status === Status.ACTIVE) {
      return "Activo";
    } else {
      return "Inactivo";
    }
  };

  const onSubmit = async (formData: ZoneFormValues) => {
    setIsSubmitting(true);
    try {
      // Prepare data for API call
      const zoneData: CreateZoneDto = {
        name: formData.name,
        description: formData.description || undefined,
        rainfall: formData.rainfall || undefined,
        latitude: formData.latitude,
        longitude: formData.longitude,
        recommendations: formData.recommendations || undefined,
        status: formData.status,
        altitude: formData.altitude || undefined,
        soilType: formData.soilType || undefined,
        avgTemperature: formData.avgTemperature || undefined,
        cityId: Number.parseInt(formData.cityId, 10),
      };

      if (zoneId) {
        await updateZoneMutation.mutateAsync({ id: zoneId, data: zoneData });
      } else {
        await createZoneMutation.mutateAsync(zoneData);
      }

      // Redirect to zones list after successful creation
      push("/admin/zones");
    } catch (error) {
      console.error("Ocurrió un error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (getZoneMutation?.isSuccess) {
      const zone = getZoneMutation.data.data;

      form.setValue("name", zone.name);
      form.setValue("description", zone.description || "");
      form.setValue("rainfall", zone.rainfall || undefined);
      form.setValue("latitude", zone.latitude);
      form.setValue("longitude", zone.longitude);
      form.setValue("recommendations", zone.recommendations || "");
      form.setValue("status", zone.status);
      form.setValue("altitude", zone.altitude || undefined);
      form.setValue("soilType", zone.soilType || "");
      form.setValue("avgTemperature", zone.avgTemperature || undefined);

      if (zone.city) {
        form.setValue("cityId", zone.city.id.toString());
      }
    }
  }, [getZoneMutation?.isSuccess, form.setValue, getZoneMutation?.data?.data]);

  const getButtonText = () => {
    if (zoneId) {
      return isSubmitting ? "Actualizando..." : "Actualizar zona";
    }
    return isSubmitting ? "Creando..." : "Crear zona";
  };

  // Common soil types for selection
  const soilTypes = [
    "arcilloso",
    "limoso",
    "arenoso",
    "franco",
    "turba",
    "marga",
    "calcáreo",
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Información Básica</h3>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ingresa el nombre de la zona"
                      type="text"
                      className="bg-white"
                      {...field}
                    />
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
                  <FormLabel>Ciudad * {form.getValues("cityId")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={citiesLoading}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue
                          placeholder={
                            citiesLoading
                              ? "Cargando ciudades..."
                              : "Selecciona una ciudad"
                          }
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {citiesError && (
                        <SelectItem value="error" disabled>
                          Error cargando ciudades
                        </SelectItem>
                      )}
                      {cities?.data.map((city) => (
                        <SelectItem key={city.id} value={city.id.toString()}>
                          {city.name}
                        </SelectItem>
                      ))}
                      {cities?.data.length === 0 && !citiesLoading && (
                        <SelectItem value="empty" disabled>
                          No hay ciudades disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Rest of your form fields remain the same */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe las características de la zona"
                      {...field}
                      value={field.value || ""}
                      className="min-h-[80px] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="recommendations"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Recomendaciones</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Ingresa recomendaciones para esta zona"
                      {...field}
                      value={field.value || ""}
                      className="min-h-[80px] bg-white"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Rest of your form sections remain the same */}
          {/* Location & Coordinates */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Ubicación y Coordenadas</h3>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitud *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4.6097"
                        type="number"
                        step="any"
                        className="bg-white"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitud *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="-74.0817"
                        type="number"
                        step="any"
                        className="bg-white"
                        {...field}
                        onChange={(e) =>
                          field.onChange(Number.parseFloat(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="altitude"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Altitud (metros)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="2600"
                      type="number"
                      className="bg-white"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Climate & Soil Data */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">
              Datos Climáticos y de Suelo
            </h3>
            <FormField
              control={form.control}
              name="rainfall"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precipitación (mm)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1200"
                      type="number"
                      className="bg-white"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="avgTemperature"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Temperatura Promedio (°C)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="14.5"
                      type="number"
                      step="any"
                      className="bg-white"
                      {...field}
                      value={field.value || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value
                            ? Number.parseFloat(e.target.value)
                            : undefined,
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="soilType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Suelo</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Selecciona el tipo de suelo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {soilTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Estado</h3>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value ?? ""}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-white">
                        <SelectValue placeholder="Selecciona un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.values(Status).map((status) => (
                        <SelectItem key={status} value={status}>
                          {renderStatusLabel(status)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => push("/admin/zones")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || !form.formState.isValid || citiesLoading}
            isLoading={isSubmitting}
          >
            {getButtonText()}
          </Button>
        </div>
      </form>
    </Form>
  );
}
