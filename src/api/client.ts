const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://tech-test-backend.dwsbrazil.io';

export class ApiError extends Error {
  readonly status: number;
  readonly url: string;

  constructor(status: number, url: string) {
    super(`Request to ${url} failed with status ${status}`);
    this.name = 'ApiError';
    this.status = status;
    this.url = url;
  }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${BASE_URL}${path}`;
  const response = await fetch(url, init);

  if (!response.ok) {
    throw new ApiError(response.status, url);
  }

  return (await response.json()) as T;
}
