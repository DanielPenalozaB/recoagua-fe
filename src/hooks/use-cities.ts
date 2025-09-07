import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cityService } from '@/services/city.service';
import { CreateCityDto, UpdateCityDto } from '@/types/city';
import { toast } from 'sonner';

export const cityKeys = {
  all: ['cities'] as const,
  lists: () => [...cityKeys.all, 'list'] as const,
  details: () => [...cityKeys.all, 'detail'] as const,
  detail: (id: number) => [...cityKeys.details(), id] as const,
};

export const useCities = () => {
  return useQuery({
    queryKey: cityKeys.lists(),
    queryFn: () => cityService.getCities(),
  });
};

export const useCity = (id: number) => {
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
      toast.success('City created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create city: ${error.message}`);
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
      toast.success('City updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update city: ${error.message}`);
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
      toast.success('City deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete city: ${error.message}`);
    },
  });
};