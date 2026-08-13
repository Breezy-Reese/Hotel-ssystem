const API_URL = import.meta.env["VITE_API_URL"] ?? "http://localhost:5000/api/v1";
const TOKEN_KEY = "aurelia_token";
const USER_KEY = "aurelia_user";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token: string, user: unknown) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser<T = Record<string, unknown>>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  return raw ? (JSON.parse(raw) as T) : null;
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const contentType = res.headers.get("content-type") ?? "";
  const body = contentType.includes("application/json") ? await res.json() : null;

  if (!res.ok) {
    if (res.status === 401 && typeof window !== "undefined") {
      clearSession();
    }
    throw new ApiError(body?.message ?? res.statusText, res.status);
  }

  return body as T;
}

function withBody(method: string, data?: unknown): RequestInit {
  return data !== undefined ? { method, body: JSON.stringify(data) } : { method };
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, data?: unknown) => request<T>(path, withBody("POST", data)),
  patch: <T>(path: string, data?: unknown) => request<T>(path, withBody("PATCH", data)),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

// Envelope shapes returned by the backend (see handlerFactory.js)
export interface ListResponse<T> {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: T[];
}

export interface ItemResponse<T> {
  status: string;
  data: T;
}
