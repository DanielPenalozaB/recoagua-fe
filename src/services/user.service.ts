import { PaginationResponse } from '@/types/common';
import { ApiService } from './api';
import { User, CreateUserDto, UpdateUserDto, UserFilterDto } from '@/types/user';

export class UserService extends ApiService {
  async getUsers(filters?: UserFilterDto): Promise<PaginationResponse<User>> {
    const queryParams = new URLSearchParams();

    if (filters?.role) queryParams.append('role', filters.role);
    if (filters?.cityId) queryParams.append('cityId', filters.cityId.toString());
    if (filters?.page) queryParams.append('page', filters.page.toString());
    if (filters?.limit) queryParams.append('limit', filters.limit.toString());

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