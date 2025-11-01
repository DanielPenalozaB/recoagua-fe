export enum ModuleStatus {
	DRAFT = "draft",
	PUBLISHED = "published",
	ARCHIVED = "archived",
}

export enum BlockType {
	TEXT = "text",
	VIDEO = "video",
	IMAGE = "image",
	QUESTION = "question",
	INTERACTIVE = "interactive",
	QUIZ = "quiz",
}

export enum DynamicType {
	DRAG_DROP = "drag_drop",
	MATCHING = "matching",
	SORTING = "sorting",
	FILL_BLANKS = "fill_blanks",
	SIMULATION = "simulation",
}

export enum QuestionType {
	MULTIPLE_CHOICE = "multiple_choice",
	TRUE_FALSE = "true_false",
	OPEN_ENDED = "open_ended",
	MATCHING = "matching",
	ORDERING = "ordering",
}

export interface Answer {
	id: string;
	text: string;
	isCorrect: boolean;
	feedback: string;
	order: number;
}

export interface RelationalPair {
	id: string;
	leftItem: string;
	rightItem: string;
	correctPair: boolean;
}

export interface Block {
	id: string;
	type: BlockType;
	order: number;
	statement: string;
	description: string;
	resourceUrl: string;
	points: number;
	feedback: string;
	dynamicType: string;
	questionType: string;
	answers: Answer[];
	relationalPairs: RelationalPair[];
}

export interface CreateBlockDto {
	type: BlockType;
	content: string;
	order: number;
	moduleId: number;
	options?: [];
}

export interface UpdateBlockDto extends Partial<CreateBlockDto> {
	id: number;
}
