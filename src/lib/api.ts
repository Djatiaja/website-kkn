const isServer = typeof window === "undefined";
const BASE_URL = isServer
  ? (process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}/api` : "http://localhost:3000/api")
  : "/api";

class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// ─── API Throttle ──────────────────────────────────────────
// Prevents duplicate/repeated API calls within a short window.
// Key = url + method; value = timestamp of last call.
const THROTTLE_WINDOW_MS = 1000; // 1 second
const recentRequests = new Map<string, number>();

function isThrottled(key: string): boolean {
  const now = Date.now();
  const lastCall = recentRequests.get(key);
  if (lastCall && now - lastCall < THROTTLE_WINDOW_MS) {
    return true;
  }
  recentRequests.set(key, now);
  return false;
}

// Clean up stale entries periodically (every 30s) to prevent memory leaks
if (!isServer) {
  setInterval(() => {
    const now = Date.now();
    for (const [key, timestamp] of recentRequests.entries()) {
      if (now - timestamp > THROTTLE_WINDOW_MS * 10) {
        recentRequests.delete(key);
      }
    }
  }, 30_000);
}

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const method = options?.method || "GET";
  const throttleKey = `${method}:${url}`;

  // Throttle GET requests to prevent infinite loop re-fetching
  if (method === "GET" && !isServer && isThrottled(throttleKey)) {
    console.warn(`[API Throttle] Blocked duplicate request: ${method} ${url}`);
    throw new ApiError(429, "Request throttled — too many requests");
  }

  const defaultHeaders: Record<string, string> = {};
  if (!(options?.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options?.headers ? Object.fromEntries(new Headers(options.headers).entries()) : {}),
    },
  });

  if (!res.ok) {
    const error = await res
      .json()
      .catch(() => ({ message: "Request failed" }));
    throw new ApiError(res.status, error.message || error.error);
  }

  return res.json();
}

export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data: unknown, options?: RequestInit) => {
    const isFormData = typeof window !== "undefined" && data instanceof FormData;
    const requestOptions: RequestInit = {
      method: "POST",
      ...options,
    };
    
    if (isFormData) {
      requestOptions.body = data as FormData;
      // When using FormData, browser sets multipart/form-data and boundary automatically.
      // We must *not* set Content-Type manually, so we override it to undefined if it was set to application/json.
      if (!requestOptions.headers) requestOptions.headers = {};
      const headers = new Headers(requestOptions.headers);
      headers.delete("Content-Type");
      requestOptions.headers = headers;
    } else {
      requestOptions.body = JSON.stringify(data);
    }
    
    return request<T>(url, requestOptions);
  },
  put: <T>(url: string, data: unknown, options?: RequestInit) => {
    const isFormData = typeof window !== "undefined" && data instanceof FormData;
    const requestOptions: RequestInit = {
      method: "PUT",
      ...options,
    };
    
    if (isFormData) {
      requestOptions.body = data as FormData;
      if (!requestOptions.headers) requestOptions.headers = {};
      const headers = new Headers(requestOptions.headers);
      headers.delete("Content-Type");
      requestOptions.headers = headers;
    } else {
      requestOptions.body = JSON.stringify(data);
    }
    
    return request<T>(url, requestOptions);
  },
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
  upload: async <T = { url: string }>(file: File, folder = "images"): Promise<T> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    if (!res.ok) throw new ApiError(res.status, "Upload failed");
    return res.json();
  },
};

export { ApiError };
