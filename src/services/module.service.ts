import type { ApiResponse } from "@/types/common";
import type { CreateModuleDto, Module, UpdateModuleDto } from "@/types/module";
import { ApiService } from "./api";

export class ModuleService extends ApiService {
	async getModules(guideId: number): Promise<Module[]> {
		return this.get(`/guides/${guideId}/modules`);
	}

	async getModule(id: number): Promise<ApiResponse<Module>> {
		return this.get(`/modules/${id}`);
	}

	async createModule(moduleData: CreateModuleDto): Promise<Module> {
		return this.post("/modules", moduleData);
	}

	async updateModule(id: number, moduleData: UpdateModuleDto): Promise<Module> {
		return this.patch(`/modules/${id}`, moduleData);
	}

	async deleteModule(id: number): Promise<void> {
		return this.delete(`/modules/${id}`);
	}
}

export const moduleService = new ModuleService();
