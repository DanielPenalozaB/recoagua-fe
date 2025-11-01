"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zoneService } from "@/services/zone.service";
import type { CreateZoneDto, UpdateZoneDto, ZoneFilterDto } from "@/types/zone";

const zoneKeys = {
	all: ["zones"] as const,
	lists: () => [...zoneKeys.all, "list"] as const,
	list: (filters: ZoneFilterDto) => [...zoneKeys.lists(), filters] as const,
	details: () => [...zoneKeys.all, "detail"] as const,
	detail: (id: number) => [...zoneKeys.details(), id] as const,
};

const useZones = (filters?: ZoneFilterDto) => {
	return useQuery({
		queryKey: zoneKeys.list(filters || {}),
		queryFn: () => zoneService.getZones(filters),
	});
};

const useZone = (id: number | undefined) => {
	return useQuery({
		queryKey: id ? zoneKeys.detail(id) : zoneKeys.details(),
		queryFn: () => zoneService.getZone(id as number),
		enabled: !!id,
	});
};

const useCreateZone = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (zoneData: CreateZoneDto) => zoneService.createZone(zoneData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
			toast.success("Zona creada exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al crear la zona: ${error.message}`);
		},
	});
};

const useUpdateZone = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateZoneDto }) =>
			zoneService.updateZone(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: zoneKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
			toast.success("Zona actualizada exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al actualizar la zona: ${error.message}`);
		},
	});
};

const useDeleteZone = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => zoneService.deleteZone(id),
		onSuccess: (_, id) => {
			queryClient.removeQueries({ queryKey: zoneKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
			toast.success("Zona eliminada exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al eliminar la zona: ${error.message}`);
		},
	});
};

export { useCreateZone, useDeleteZone, useUpdateZone, useZone, useZones };
