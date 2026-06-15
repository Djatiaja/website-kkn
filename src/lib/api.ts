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
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
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
  post: <T>(url: string, data: unknown) =>
    request<T>(url, { method: "POST", body: JSON.stringify(data) }),
  put: <T>(url: string, data: unknown) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(data) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};

export { ApiError };
