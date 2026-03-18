import type { Status } from "./common";

export interface Zone {
  id: number;
  name: string;
  description?: string;
  rainfall?: number;
  latitude: number;
  longitude: number;
  recommendations?: string;
  status: Status;
  altitude?: number;
  soilType?: string;
  avgTemperature?: number;
  city?: {
    id: number;
    name: string;
    description: string;
    rainfall: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateZoneDto {
  name: string;
  description?: string;
  rainfall?: number;
  latitude: number;
  longitude: number;
  recommendations?: string;
  status: Status;
  altitude?: number;
  soilType?: string;
  avgTemperature?: number;
  cityId: number;
}

export interface UpdateZoneDto extends Partial<CreateZoneDto> {}

export interface ZoneFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Multi-select filters
  status?: string;

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
