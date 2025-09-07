import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateGuideDto, UpdateGuideDto, GuideFilterDto } from '@/types/guide';
import { toast } from 'sonner';
import { guideService } from '@/services/guide.service';

// Keys for query caching
export const guideKeys = {
  all: ['guides'] as const,
  lists: () => [...guideKeys.all, 'list'] as const,
  list: (filters: GuideFilterDto) => [...guideKeys.lists(), filters] as const,
  details: () => [...guideKeys.all, 'detail'] as const,
  detail: (id: number) => [...guideKeys.details(), id] as const,
  progress: (guideId: number, userId: number) => [...guideKeys.detail(guideId), 'progress', userId] as const,
  stats: (guideId: number) => [...guideKeys.detail(guideId), 'stats'] as const,
};

// Get all guides with optional filters
export const useGuides = (filters?: GuideFilterDto) => {
  return useQuery({
    queryKey: guideKeys.list(filters || {}),
    queryFn: () => guideService.getGuides(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Get a single guide by ID
export const useGuide = (id: number) => {
  return useQuery({
    queryKey: guideKeys.detail(id),
    queryFn: () => guideService.getGuide(id),
    enabled: !!id, // Only run if ID is provided
  });
};

// Create a new guide
export const useCreateGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (guideData: CreateGuideDto) => guideService.createGuide(guideData),
    onSuccess: () => {
      // Invalidate the guides list to refetch
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guide created successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create guide: ${error.message}`);
    },
  });
};

// Update a guide
export const useUpdateGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateGuideDto }) => 
      guideService.updateGuide(id, data),
    onSuccess: (_, variables) => {
      // Invalidate both the specific guide and the list
      queryClient.invalidateQueries({ queryKey: guideKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guide updated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update guide: ${error.message}`);
    },
  });
};

// Delete a guide
export const useDeleteGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => guideService.deleteGuide(id),
    onSuccess: (_, id) => {
      // Remove the guide from cache and invalidate list
      queryClient.removeQueries({ queryKey: guideKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guide deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete guide: ${error.message}`);
    },
  });
};

// Publish a guide
export const usePublishGuide = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => guideService.publishGuide(id),
    onSuccess: (data) => {
      // Update the guide in cache and invalidate list
      queryClient.setQueryData(guideKeys.detail(data.id), data);
      queryClient.invalidateQueries({ queryKey: guideKeys.lists() });
      toast.success('Guide published successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to publish guide: ${error.message}`);
    },
  });
};

// Get user progress for a guide
export const useGuideProgress = (guideId: number, userId: number) => {
  return useQuery({
    queryKey: guideKeys.progress(guideId, userId),
    queryFn: () => guideService.getGuideProgress(guideId, userId),
    enabled: !!guideId && !!userId,
  });
};

// Get guide statistics
export const useGuideStats = (guideId: number) => {
  return useQuery({
    queryKey: guideKeys.stats(guideId),
    queryFn: () => guideService.getGuideStats(guideId),
    enabled: !!guideId,
  });
};