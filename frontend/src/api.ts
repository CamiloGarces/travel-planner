import { config } from './config';
import type { Destination, Favorite } from './types';

async function req<T>(
  path: string,
  init: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${config.apiUrl}${path}`, {
    ...init,
    headers,
  });
  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message ?? `HTTP ${response.status}`);
  }

  return body as T;
}

export const search = (query: string) =>
  req<{ items: Destination[] }>(`/destinations?query=${encodeURIComponent(query)}`);

export const listFavorites = (token: string) =>
  req<{ items: Favorite[] }>('/favorites', {}, token);

export const saveFavorite = (destination: Destination, token: string) =>
  req('/favorites', { method: 'POST', body: JSON.stringify(destination) }, token);

export const removeFavorite = (id: number, token: string) =>
  req(`/favorites/${id}`, { method: 'DELETE' }, token);

export const uploadUrl = (fileName: string, contentType: string, token: string) =>
  req<{ uploadUrl: string; key: string }>(
    '/uploads',
    {
      method: 'POST',
      body: JSON.stringify({ fileName, contentType }),
    },
    token,
  );
