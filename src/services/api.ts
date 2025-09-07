import { getSession } from "next-auth/react";

export class ApiService {
  protected baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  }

  protected async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const session = await getSession();

    if (!session?.accessToken) {
      throw new Error('No access token available');
    }

    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.accessToken}`,
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 401) {
      throw new Error('Authentication failed');
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    return response;
  }

  protected async get<T>(endpoint: string): Promise<T> {
    const response = await this.authenticatedFetch(`${this.baseUrl}${endpoint}`);
    return response.json();
  }

  protected async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  protected async patch<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return response.json();
  }

  protected async delete(endpoint: string): Promise<void> {
    await this.authenticatedFetch(`${this.baseUrl}${endpoint}`, {
      method: 'DELETE',
    });
  }
}