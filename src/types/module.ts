import { Block } from "./block";

export interface Module {
  id: number;
  name: string;
  description: string;
  order: number;
  guideId: number;
  blocks: Block[];
  createdAt: string;
  updatedAt: string;
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