"use client"

import { guideService } from '@/services/guide.service';
import { GuideFilterDto, CreateGuideDto, UpdateGuideDto } from '@/types/guide';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const guideKeys = {
  all: ['users'] as const,
  lists: () => [...guideKeys.all, 'list'] as const,
  list: (filters: GuideFilterDto) => [...guideKeys.lists(), filters] as const,
  details: () => [...guideKeys.all, 'detail'] as const,
  detail: (id: number) => [...guideKeys.details(), id] as const,
};

const useGuides = (filters?: GuideFilterDto) => {
  return useQuery({
    queryKey: guideKeys.list(filters || {}),
    queryFn: () => guideService.getGuides(filters),
  });
};

const useGuide = (id: number | undefined) => {
  if (!id) return;

  return useQuery({
    queryKey: guideKeys.detail(id),
    queryFn: () => guideService.getGuide(id),
    enabled: !!id,
  });
};

const useCreateGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateGuideDto) => guideService.createGuide(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guía creada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al crear la guía: ${error.message}`);
    },
  });
};

const useUpdateGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGuideDto }) =>
      guideService.updateGuide(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: guideKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guía actualizada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al actualizar la guía: ${error.message}`);
    },
  });
};

const useDeleteGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => guideService.deleteGuide(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: guideKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guía eliminada exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al eliminar la guía: ${error.message}`);
    },
  });
};

export {
  useCreateGuide, useDeleteGuide, useUpdateGuide, useGuide, useGuides
};
