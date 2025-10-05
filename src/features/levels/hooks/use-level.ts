"use client"

import { levelService } from '@/services/level.service';
import { CreateLevelDto, LevelFilterDto, UpdateLevelDto } from '@/types/level';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const levelKeys = {
  all: ['users'] as const,
  lists: () => [...levelKeys.all, 'list'] as const,
  list: (filters: LevelFilterDto) => [...levelKeys.lists(), filters] as const,
  details: () => [...levelKeys.all, 'detail'] as const,
  detail: (id: number) => [...levelKeys.details(), id] as const,
};

const useLevels = (filters?: LevelFilterDto) => {
  return useQuery({
    queryKey: levelKeys.list(filters || {}),
    queryFn: () => levelService.getLevels(filters),
  });
};

const useLevel = (id: number | undefined) => {
  if (!id) return;

  return useQuery({
    queryKey: levelKeys.detail(id),
    queryFn: () => levelService.getLevel(id),
    enabled: !!id,
  });
};

const useCreateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateLevelDto) => levelService.createLevel(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
      toast.success('Nivel creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al crear el nivel: ${error.message}`);
    },
  });
};

const useUpdateLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateLevelDto }) =>
      levelService.updateLevel(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: levelKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
      toast.success('Nivel actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al actualizar el nivel: ${error.message}`);
    },
  });
};

const useDeleteLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => levelService.deleteLevel(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: levelKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: levelKeys.lists() });
      toast.success('Nivel eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al eliminar el nivel: ${error.message}`);
    },
  });
};

export {
  useCreateLevel, useDeleteLevel, useUpdateLevel, useLevel, useLevels
};
