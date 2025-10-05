"use client"

import { challengeService } from '@/services/user.challenge';
import { ChallengeFilterDto, CreateChallengeDto, UpdateChallengeDto } from '@/types/challenge';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const challengeKeys = {
  all: ['users'] as const,
  lists: () => [...challengeKeys.all, 'list'] as const,
  list: (filters: ChallengeFilterDto) => [...challengeKeys.lists(), filters] as const,
  details: () => [...challengeKeys.all, 'detail'] as const,
  detail: (id: number) => [...challengeKeys.details(), id] as const,
};

const useChallenges = (filters?: ChallengeFilterDto) => {
  return useQuery({
    queryKey: challengeKeys.list(filters || {}),
    queryFn: () => challengeService.getChallenges(filters),
  });
};

const useChallenge = (id: number | undefined) => {
  if (!id) return;

  return useQuery({
    queryKey: challengeKeys.detail(id),
    queryFn: () => challengeService.getChallenge(id),
    enabled: !!id,
  });
};

const useCreateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: CreateChallengeDto) => challengeService.createChallenge(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
      toast.success('Reto creado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al crear el reto: ${error.message}`);
    },
  });
};

const useUpdateChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateChallengeDto }) =>
      challengeService.updateChallenge(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: challengeKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
      toast.success('Reto actualizado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al actualizar el reto: ${error.message}`);
    },
  });
};

const useDeleteChallenge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => challengeService.deleteChallenge(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: challengeKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: challengeKeys.lists() });
      toast.success('Reto eliminado exitosamente');
    },
    onError: (error: Error) => {
      toast.error(`Ocurrió un error al eliminar el reto: ${error.message}`);
    },
  });
};

export {
  useCreateChallenge, useDeleteChallenge, useUpdateChallenge, useChallenge, useChallenges
};
