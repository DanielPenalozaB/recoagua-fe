import { getSession, signOut } from "next-auth/react";

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

    let response = await fetch(url, {
      ...options,
      headers,
    });

    // If token is expired, try to refresh it
    if (response.status === 401) {
      try {
        console.log('Token expired, attempting refresh...');

        // Force session refresh - this will trigger NextAuth's token refresh
        const refreshedSession = await getSession();

        if (!refreshedSession?.accessToken) {
          console.error('Failed to refresh token');
          await signOut({ redirect: true, callbackUrl: '/auth/signin' });
          throw new Error('Failed to refresh token');
        }

        console.log('Token refreshed successfully');

        // Retry the request with the new token
        headers.Authorization = `Bearer ${refreshedSession.accessToken}`;
        response = await fetch(url, {
          ...options,
          headers,
        });

        // If it still fails after refresh, logout
        if (response.status === 401) {
          console.error('Request failed even after token refresh');
          await signOut({ redirect: true, callbackUrl: '/auth/signin' });
          throw new Error('Authentication failed after refresh');
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        await signOut({ redirect: true, callbackUrl: '/auth/signin' });
        throw refreshError;
      }
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

  protected async publicGet<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${this.baseUrl}${endpoint}`, {
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}
}