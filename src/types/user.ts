import { City } from "./city";

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  CITIZEN = 'citizen'
}

export interface User {
  id: number;
  email: string;
  name: string;
  language: string;
  role: UserRole;
  city: City | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  name: string;
  password: string;
  language: string;
  role: UserRole;
  cityId?: number;
}

export interface UpdateUserDto extends Partial<CreateUserDto> {
  id: number;
}

export interface UserFilterDto {
  role?: UserRole;
  cityId?: number;
  page?: number;
  limit?: number;
}