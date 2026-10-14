const API_URL =
  import.meta.env["VITE_API_URL"] ??
  (typeof window !== "undefined" &&
  window.location.hostname !== "localhost"
    ? "https://hotel-ssystem.onrender.com/api/v1"
    : "http://localhost:5000/api/v1");

if (!API_URL) {
  throw new Error("API URL is not configured");
}

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

export function getStoredUser<
  T = Record<string, unknown>,
>(): T | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(USER_KEY);

  return raw ? (JSON.parse(raw) as T) : null;
}

// Notify the authentication provider when the API returns 401.
const UNAUTHORIZED_EVENT = "auth:unauthorized";

export function onUnauthorized(
  handler: () => void,
): () => void {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener(
    UNAUTHORIZED_EVENT,
    handler,
  );

  return () =>
    window.removeEventListener(
      UNAUTHORIZED_EVENT,
      handler,
    );
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken();

  const headers = new Headers(options.headers);

  // Do not force JSON Content-Type for FormData.
  // The browser must set its multipart boundary automatically.
  if (
    !(options.body instanceof FormData) &&
    !headers.has("Content-Type")
  ) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    },
  );

  const contentType =
    response.headers.get("content-type") ?? "";

  let body: unknown = null;

  if (contentType.includes("application/json")) {
    body = await response.json();
  } else {
    const text = await response.text();

    if (text) {
      body = { message: text };
    }
  }

  if (!response.ok) {
    if (
      response.status === 401 &&
      typeof window !== "undefined"
    ) {
      clearSession();

      window.dispatchEvent(
        new Event(UNAUTHORIZED_EVENT),
      );
    }

    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : response.statusText ||
          "The request failed.";

    throw new ApiError(
      message,
      response.status,
    );
  }

  return body as T;
}

function withBody(
  method: string,
  data?: unknown,
): RequestInit {
  return data !== undefined
    ? {
        method,
        body: JSON.stringify(data),
      }
    : {
        method,
      };
}

export const api = {
  get: <T,>(path: string) =>
    request<T>(path),

  post: <T,>(
    path: string,
    data?: unknown,
  ) =>
    request<T>(
      path,
      withBody("POST", data),
    ),

  patch: <T,>(
    path: string,
    data?: unknown,
  ) =>
    request<T>(
      path,
      withBody("PATCH", data),
    ),

  delete: <T,>(path: string) =>
    request<T>(path, {
      method: "DELETE",
    }),

  /**
   * Send multipart/form-data, including images.
   *
   * Example:
   * const formData = new FormData();
   * formData.append("images", file);
   * await api.upload("/rooms/images", formData);
   */
  upload: <T,>(
    path: string,
    formData: FormData,
  ) =>
    request<T>(path, {
      method: "POST",
      body: formData,
    }),
};

// Response envelopes returned by the backend.
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
