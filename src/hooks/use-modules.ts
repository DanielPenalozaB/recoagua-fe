import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { moduleService } from '@/services/module.service';
import { CreateModuleDto, UpdateModuleDto } from '@/types/module';
import { toast } from 'sonner';

export const moduleKeys = {
  all: ['modules'] as const,
  lists: () => [...moduleKeys.all, 'list'] as const,
  list: (guideId: number) => [...moduleKeys.lists(), guideId] as const,
  details: () => [...moduleKeys.all, 'detail'] as const,
  detail: (id: number) => [...moduleKeys.details(), id] as const,
};

export const useModules = (guideId: number) => {
  return useQuery({
    queryKey: moduleKeys.list(guideId),
    queryFn: () => moduleService.getModules(guideId),
    enabled: !!guideId,
  });
};

export const useModule = (id: number) => {
  return useQuery({
    queryKey: moduleKeys.detail(id),
    queryFn: () => moduleService.getModule(id),
    enabled: !!id,
  });
};

export const useCreateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (moduleData: CreateModuleDto) => moduleService.createModule(moduleData),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(data.guide.id) });
      toast.success('Module created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create module: ${error.message}`);
    },
  });
};

export const useUpdateModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateModuleDto }) =>
      moduleService.updateModule(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: moduleKeys.detail(data.id) });
      queryClient.invalidateQueries({ queryKey: moduleKeys.list(data.guide.id) });
      toast.success('Module updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update module: ${error.message}`);
    },
  });
};

export const useDeleteModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => moduleService.deleteModule(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: moduleKeys.detail(id) });
      // Note: We can't invalidate the list here because we don't know the guideId
      toast.success('Module deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete module: ${error.message}`);
    },
  });
};