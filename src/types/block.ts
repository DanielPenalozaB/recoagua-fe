export enum BlockType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  QUIZ = 'quiz',
  SURVEY = 'survey'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'multiple_choice',
  TRUE_FALSE = 'true_false',
  OPEN_ENDED = 'open_ended',
  MATCHING = 'matching',
  ORDERING = 'ordering',
}

export enum DynamicType {
  DRAG_DROP = 'drag_drop',
  MATCHING = 'matching',
  SORTING = 'sorting',
  FILL_BLANKS = 'fill_blanks',
  SIMULATION = 'simulation',
}

export interface Block {
  id: number;
  type: string;
  order: number;
  statement: string;
  description: string;
  resourceUrl: null;
  points: number;
  feedback: null;
  dynamicType: DynamicType;
  questionType: QuestionType;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: null;
  answers: Answer[];
  relationalPairs: any[];
}

export interface Answer {
  id: number;
  text: string;
  isCorrect: boolean;
  feedback: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
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