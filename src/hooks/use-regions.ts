
import { regionService } from '@/services/region.service';
import { RegionFilterDto, CreateRegionDto, UpdateRegionDto } from '@/types/region';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const regionKeys = {
  all: ['regions'] as const,
  lists: () => [...regionKeys.all, 'list'] as const,
  list: (filters: RegionFilterDto) => [...regionKeys.lists(), filters] as const,
  details: () => [...regionKeys.all, 'detail'] as const,
  detail: (id: number) => [...regionKeys.details(), id] as const,
};

export const useRegions = (filters?: RegionFilterDto) => {
  return useQuery({
    queryKey: regionKeys.list(filters || {}),
    queryFn: () => regionService.getRegions(),
  });
};

export const useCity = (id: number | undefined) => {
  if (!id) return;

  return useQuery({
    queryKey: regionKeys.detail(id),
    queryFn: () => regionService.getRegion(id),
    enabled: !!id,
  });
};

export const useCreateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (regionData: CreateRegionDto) => regionService.createRegion(regionData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      toast.success('Ciudad creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al crear la ciudad: ${error.message}`);
    },
  });
};

export const useUpdateRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateRegionDto }) =>
      regionService.updateRegion(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: regionKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      toast.success('Ciudad actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al actualizar la ciudad: ${error.message}`);
    },
  });
};

export const useDeleteRegion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => regionService.deleteRegion(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: regionKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: regionKeys.lists() });
      toast.success('Ciudad eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al eliminar la ciudad: ${error.message}`);
    },
  });
};