import type { Module } from "./module";

export enum GuideStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  ARCHIVED = "archived",
}

export enum GuideDifficulty {
  BEGINNER = "beginner",
  INTERMEDIATE = "intermediate",
  ADVANCED = "advanced",
}

export interface Guide {
  id: number;
  name: string;
  description: string;
  difficulty: GuideDifficulty;
  estimatedDuration: number;
  status: GuideStatus;
  language: string;
  totalPoints: number;
  modules: Module[];
  createdAt: Date;
  updatedAt: Date;
  isCompleted: boolean;
}

export interface CreateGuideDto {
  name: string;
  description: string;
  estimatedDuration: number;
  language: string;
  status?: GuideStatus;
}

export interface UpdateGuideDto extends Partial<CreateGuideDto> {}

export interface GuideFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Multi-select filters
  status?: string | string[];

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: "asc" | "desc";

  hideCompleted?: boolean;
}

export interface ModuleProgress {
  id: number;
  completionStatus: "in_progress" | "completed";
  earnedPoints: number;
  completedAt: string | null;
  module: {
    id: number;
    name: string;
    order: number;
  };
}

export interface GuideProgress {
  guideId: number;
  userId: number;
  completed: boolean;
  progressPercentage: number;
  lastAccessedAt: string;
}

export interface GuideStats {
  guideId: number;
  totalViews: number;
  totalCompletions: number;
  averageCompletionTime: number;
  userEngagement: number;
}
