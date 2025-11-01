import type { Block, CreateBlockDto, UpdateBlockDto } from "@/types/block";
import { ApiService } from "./api";

export class BlockService extends ApiService {
	async getBlocks(moduleId: number): Promise<Block[]> {
		return this.get(`/modules/${moduleId}/blocks`);
	}

	async getBlock(id: number): Promise<Block> {
		return this.get(`/blocks/${id}`);
	}

	async createBlock(blockData: CreateBlockDto): Promise<Block> {
		return this.post("/blocks", blockData);
	}

	async updateBlock(id: number, blockData: UpdateBlockDto): Promise<Block> {
		return this.patch(`/blocks/${id}`, blockData);
	}

	async deleteBlock(id: number): Promise<void> {
		return this.delete(`/blocks/${id}`);
	}
}

export const blockService = new BlockService();
