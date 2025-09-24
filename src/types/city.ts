export interface City {
  id: number;
  name: string;
  country: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityDto {
  name: string;
  country: string;
}

export interface UpdateCityDto extends Partial<CreateCityDto> {
  id: number;
}

export interface CityFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Single value filters
  regionId?: number;

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}