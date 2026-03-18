import type { Status } from "./common";

export interface Badge {
  id: number;
  name: string;
  description: string;
  imageUrl: string;
  requirements: string;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}

export interface CreateBadgeDto {
  name: string;
  description: string;
  imageUrl?: string;
  requirements: string;
  status: Status;
}

export interface UpdateBadgeDto extends Partial<CreateBadgeDto> {}

export interface BadgeFilterDto {
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
}
