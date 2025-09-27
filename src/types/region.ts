export interface Region {
  id: number;
  name: string;
  description: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface CreateRegionDto {
  name: string;
  description: string | undefined;
  language: string;
}

export interface UpdateRegionDto extends Partial<CreateRegionDto> {}

export interface RegionFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}