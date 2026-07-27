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

async function request<T>(url: string, options?: RequestInit): Promise<T> {
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
};

export { ApiError };
