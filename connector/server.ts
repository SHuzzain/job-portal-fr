import { cookies } from "next/headers"
import { ApiError } from "./client"

type ServerOptions<TBody> = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE"
  body?: TBody
  headers?: HeadersInit
  tags?: string[]
  revalidate?: number | false
  timeoutMs?: number
}

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set")
  }
  return base.replace(/\/$/, "")
}

export async function apiServer<TResponse, TBody = undefined>(
  path: string,
  options: ServerOptions<TBody> = {},
): Promise<TResponse> {
  const cookieStore = await cookies()
  const cookieHeader = cookieStore
    .getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join("; ")
  const response = await fetch(`${apiBase()}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...options.headers,
    },
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
    signal: AbortSignal.timeout(options.timeoutMs ?? 8_000),
    next: {
      tags: options.tags,
      revalidate: options.revalidate,
    },
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
