import { env } from '@/config/env';

/**
 * Client HTTP tipis di atas fetch untuk REST API loginrek.
 * Semua respons sukses dari server dibungkus `{ data: ... }`.
 * Error validasi/auth berbentuk `{ errors: [{ message, field? }] }`.
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    public errors: { message: string; field?: string }[],
  ) {
    super(errors[0]?.message ?? `HTTP ${status}`);
  }
}

let accessToken: string | null = null;

/** Set/clear token Bearer di memori. Persistensi: lihat src/lib/token-storage.ts. */
export function setAccessToken(token: string | null) {
  accessToken = token;
}

export async function api<T>(
  path: string,
  init: { method?: string; body?: unknown } = {},
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.requestTimeoutMs);

  try {
    const res = await fetch(`${env.apiUrl}${path}`, {
      method: init.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
      signal: controller.signal,
    });

    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new ApiError(res.status, json.errors ?? [{ message: res.statusText }]);
    }
    return json as T;
  } finally {
    clearTimeout(timer);
  }
}

/* ---- Endpoint auth ------------------------------------------------------ */

export type User = {
  id: number;
  fullName: string | null;
  email: string;
  initials: string;
};

export const authApi = {
  login: (email: string, password: string, deviceName = 'mobile') =>
    api<{ data: { user: User; token: string; expiresAt: string | null } }>('/auth/login', {
      method: 'POST',
      body: { email, password, deviceName },
    }),
  me: () => api<{ data: User }>('/auth/me'),
  logout: () => api<{ message: string }>('/auth/logout', { method: 'POST' }),
};
