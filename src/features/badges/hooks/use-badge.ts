"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { badgeService } from "@/services/badge.service";
import type {
	BadgeFilterDto,
	CreateBadgeDto,
	UpdateBadgeDto,
} from "@/types/badge";

const badgeKeys = {
	all: ["badges"] as const,
	lists: () => [...badgeKeys.all, "list"] as const,
	list: (filters: BadgeFilterDto) => [...badgeKeys.lists(), filters] as const,
	details: () => [...badgeKeys.all, "detail"] as const,
	detail: (id: number) => [...badgeKeys.details(), id] as const,
};

const useBadges = (filters?: BadgeFilterDto) => {
	return useQuery({
		queryKey: badgeKeys.list(filters || {}),
		queryFn: () => badgeService.getBadges(filters),
	});
};

const useBadge = (id: number | undefined) => {
	return useQuery({
		queryKey: id ? badgeKeys.detail(id) : badgeKeys.details(),
		queryFn: () => badgeService.getBadge(id as number),
		enabled: !!id,
	});
};

const useCreateBadge = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (badgeData: CreateBadgeDto) =>
			badgeService.createBadge(badgeData),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
			toast.success("Reto creado exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al crear el reto: ${error.message}`);
		},
	});
};

const useUpdateBadge = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateBadgeDto }) =>
			badgeService.updateBadge(id, data),
		onSuccess: (_, variables) => {
			queryClient.invalidateQueries({
				queryKey: badgeKeys.detail(variables.id),
			});
			queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
			toast.success("Reto actualizado exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al actualizar el reto: ${error.message}`);
		},
	});
};

const useDeleteBadge = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => badgeService.deleteBadge(id),
		onSuccess: (_, id) => {
			queryClient.removeQueries({ queryKey: badgeKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: badgeKeys.lists() });
			toast.success("Reto eliminado exitosamente");
		},
		onError: (error: Error) => {
			toast.error(`Ocurrió un error al eliminar el reto: ${error.message}`);
		},
	});
};

export { useCreateBadge, useDeleteBadge, useUpdateBadge, useBadge, useBadges };
