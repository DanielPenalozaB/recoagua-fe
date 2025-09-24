import { City } from "./city";

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CITIZEN = 'citizen'
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

export interface User {
  id: number;
  email: string;
  name: string;
  language: string;
  role: UserRole;
  city: City | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  cityId?: number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}

export interface UserFilterDto {
  // Pagination
  page?: number;
  limit?: number;

  // Search filters
  name?: string;

  // Multi-select filters
  role?: string | string[];
  status?: string | string[];

  // Single value filters
  cityId?: number;

  // Sorting (optional - for future use)
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}