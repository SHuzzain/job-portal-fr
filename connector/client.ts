export class ApiError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message)
    this.name = "ApiError"
  }
}

type ClientOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: TBody
  headers?: HeadersInit
  timeoutMs?: number
}

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set")
  }
  return base.replace(/\/$/, "")
}

export async function apiClient<TResponse, TBody = undefined>(
  path: string,
  options: ClientOptions<TBody> = {}
): Promise<TResponse> {
  const response = await fetch(`${apiBase()}${path}`, {
    method: options.method ?? "GET",
    credentials: "include",
    signal: AbortSignal.timeout(options.timeoutMs ?? 8_000),
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  })

  if (response.status === 401) {
    throw new ApiError(401, "Unauthorized")
  }

  if (!response.ok) {
    const message = await response.text()
    throw new ApiError(response.status, message || response.statusText)
  }

  if (response.status === 204) {
    return undefined as TResponse
  }

  return (await response.json()) as TResponse
}

export async function apiClientBlob(
  path: string,
  timeoutMs = 15_000
): Promise<Blob> {
  const response = await fetch(`${apiBase()}${path}`, {
    credentials: "include",
    signal: AbortSignal.timeout(timeoutMs),
  })

  if (response.status === 401) {
    throw new ApiError(401, "Unauthorized")
  }

  if (!response.ok) {
    const message = await response.text()
    throw new ApiError(response.status, message || response.statusText)
  }

  return response.blob()
}
