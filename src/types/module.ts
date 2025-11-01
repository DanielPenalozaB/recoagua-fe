import type { Block } from "./block";
import type { Guide } from "./guide";

export interface Module {
	id: number;
	name: string;
	description: string;
	order: number;
	points: number;
	status: string;
	guide: Guide;
	createdAt: Date;
	updatedAt: Date;
	deletedAt: null;
	blocks: Block[];
}

export interface CreateModuleDto {
	name: string;
	description: string;
	order: number;
	guideId: number;
}

export interface UpdateModuleDto extends Partial<CreateModuleDto> {
	id: number;
}
