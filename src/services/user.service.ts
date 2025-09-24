import { PaginationResponse } from '@/types/common';
import { CreateUserDto, UpdateUserDto, User, UserFilterDto } from '@/types/user';
import { ApiService } from './api';

export class UserService extends ApiService {
  async getUsers(filters?: UserFilterDto): Promise<PaginationResponse<User>> {
    const queryParams = new URLSearchParams();

    // Handle array parameters correctly
    if (filters?.role) {
      if (Array.isArray(filters.role)) {
        filters.role.forEach(role => queryParams.append('role', role));
      } else {
        queryParams.append('role', filters.role);
      }
    }

    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        filters.status.forEach(status => queryParams.append('status', status));
      } else {
        queryParams.append('status', filters.status);
      }
    }

    // String search parameters
    if (filters?.name) queryParams.append('search', filters.name);

    // Single value parameters
    if (filters?.cityId) queryParams.append('cityId', filters.cityId.toString());
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

    // Sorting parameters (if needed in the future)
    if (filters?.sortBy) queryParams.append('sortBy', filters.sortBy);
    if (filters?.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

    return this.get(`/users?${queryParams.toString()}`);
  }

  async getUser(id: number): Promise<User> {
    return this.get(`/users/${id}`);
  }

  async createUser(userData: CreateUserDto): Promise<User> {
    return this.post('/users', userData);
  }

  async updateUser(id: number, userData: UpdateUserDto): Promise<User> {
    return this.patch(`/users/${id}`, userData);
  }

  async deleteUser(id: number): Promise<void> {
    return this.delete(`/users/${id}`);
  }
}

export const userService = new UserService();