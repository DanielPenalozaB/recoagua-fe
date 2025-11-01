import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { blockService } from "@/services/block.service";
import type { CreateBlockDto, UpdateBlockDto } from "@/types/block";

export const blockKeys = {
	all: ["blocks"] as const,
	lists: () => [...blockKeys.all, "list"] as const,
	list: (moduleId: number) => [...blockKeys.lists(), moduleId] as const,
	details: () => [...blockKeys.all, "detail"] as const,
	detail: (id: number) => [...blockKeys.details(), id] as const,
};

export const useBlocks = (moduleId: number) => {
	return useQuery({
		queryKey: blockKeys.list(moduleId),
		queryFn: () => blockService.getBlocks(moduleId),
		enabled: !!moduleId,
	});
};

export const useBlock = (id: number) => {
	return useQuery({
		queryKey: blockKeys.detail(id),
		queryFn: () => blockService.getBlock(id),
		enabled: !!id,
	});
};

export const useCreateBlock = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (blockData: CreateBlockDto) =>
			blockService.createBlock(blockData),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: blockKeys.list(data.id) });
			toast.success("Block created successfully");
		},
		onError: (error: Error) => {
			toast.error(`Failed to create block: ${error.message}`);
		},
	});
};

export const useUpdateBlock = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: ({ id, data }: { id: number; data: UpdateBlockDto }) =>
			blockService.updateBlock(id, data),
		onSuccess: (data) => {
			queryClient.invalidateQueries({ queryKey: blockKeys.detail(data.id) });
			queryClient.invalidateQueries({ queryKey: blockKeys.list(data.id) });
			toast.success("Block updated successfully");
		},
		onError: (error: Error) => {
			toast.error(`Failed to update block: ${error.message}`);
		},
	});
};

export const useDeleteBlock = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (id: number) => blockService.deleteBlock(id),
		onSuccess: (_, id) => {
			queryClient.removeQueries({ queryKey: blockKeys.detail(id) });
			toast.success("Block deleted successfully");
		},
		onError: (error: Error) => {
			toast.error(`Failed to delete block: ${error.message}`);
		},
	});
};
