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