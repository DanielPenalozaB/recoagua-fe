import { cityService } from '@/services/city.service';
import { CityFilterDto, CreateCityDto, UpdateCityDto } from '@/types/city';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const cityKeys = {
  all: ['cities'] as const,
  lists: () => [...cityKeys.all, 'list'] as const,
  list: (filters: CityFilterDto) => [...cityKeys.lists(), filters] as const,
  details: () => [...cityKeys.all, 'detail'] as const,
  detail: (id: number) => [...cityKeys.details(), id] as const,
};

export const useCities = (filters?: CityFilterDto) => {
  return useQuery({
    queryKey: cityKeys.list(filters || {}),
    queryFn: () => cityService.getCities(),
  });
};

export const useCity = (id: number | undefined) => {
  if (!id) return;

  return useQuery({
    queryKey: cityKeys.detail(id),
    queryFn: () => cityService.getCity(id),
    enabled: !!id,
  });
};

export const useCreateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (cityData: CreateCityDto) => cityService.createCity(cityData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cityKeys.lists() });
      toast.success('Ciudad creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al crear la ciudad: ${error.message}`);
    },
  });
};

export const useUpdateCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCityDto }) =>
      cityService.updateCity(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: cityKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: cityKeys.lists() });
      toast.success('Ciudad actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al actualizar la ciudad: ${error.message}`);
    },
  });
};

export const useDeleteCity = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => cityService.deleteCity(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: cityKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: cityKeys.lists() });
      toast.success('Ciudad eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al eliminar la ciudad: ${error.message}`);
    },
  });
};