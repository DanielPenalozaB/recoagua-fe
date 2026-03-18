import type { Region } from "./region";

export interface City {
  id: number;
  name: string;
  description: string;
  rainfall: number;
  language: string;
  region: Region | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCityDto {
  name: string;
  description: string | undefined;
  rainfall: number | undefined;
  language: string;
  regionId: number | null;
}

export interface UpdateCityDto extends Partial<CreateCityDto> {}

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
  sortOrder?: "asc" | "desc";
}
