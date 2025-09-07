import { ApiService } from './api';
import { City, CreateCityDto, UpdateCityDto } from '@/types/city';

export class CityService extends ApiService {
  async getCities(): Promise<City[]> {
    return this.get('/cities');
  }

  async getCity(id: number): Promise<City> {
    return this.get(`/cities/${id}`);
  }

  async createCity(cityData: CreateCityDto): Promise<City> {
    return this.post('/cities', cityData);
  }

  async updateCity(id: number, cityData: UpdateCityDto): Promise<City> {
    return this.patch(`/cities/${id}`, cityData);
  }

  async deleteCity(id: number): Promise<void> {
    return this.delete(`/cities/${id}`);
  }
}

export const cityService = new CityService();