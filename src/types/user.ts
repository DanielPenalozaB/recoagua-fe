import type { Badge } from "./badge";
import type { Challenge } from "./challenge";
import type { City } from "./city";
import type { Guide } from "./guide";
import type { Level } from "./level";

export enum UserRole {
  ADMIN = "admin",
  MODERATOR = "moderator",
  CITIZEN = "citizen",
}

export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  PENDING = "pending",
}

export interface User {
  id: number;
  email: string;
  name: string;
  language: string;
  role: UserRole;
  city: City | null;
  status: UserStatus;
  experience: number;
  level: Level | null;
  completedGuides: Guide[];
  inProgressGuides: Guide[];
  levelsObtained: Level[];
  badges: Badge[];
  challenges: Challenge[];
  completedGuidesCount: number;
  badgesCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  role: UserRole;
  cityId?: number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {}

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
  sortOrder?: "asc" | "desc";
}
