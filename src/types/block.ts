export enum BlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  QUIZ = 'quiz',
  SURVEY = 'survey'
}

export interface Block {
  id: number;
  type: BlockType;
  content: string;
  order: number;
  moduleId: number;
  options?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlockDto {
  type: BlockType;
  content: string;
  order: number;
  moduleId: number;
  options?: any;
}

export interface UpdateBlockDto extends Partial<CreateBlockDto> {
  id: number;
}