export interface Level {
  id: number;
  name: string;
  description: string;
  requiredPoints: number;
  rewards: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateLevelDto {
  name: string;
  description: string;
  requiredPoints: number;
  rewards: string;
}

export interface UpdateLevelDto extends Partial<CreateLevelDto> {}

export interface LevelFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
