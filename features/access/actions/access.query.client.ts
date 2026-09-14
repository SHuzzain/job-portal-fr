import { apiClient } from "@/connector/client"
import {
  platformRoleSchema,
  platformUserSchema,
  type PlatformRole,
  type PlatformUser,
} from "../schema"

export async function listPlatformRoles(): Promise<PlatformRole[]> {
  const data = await apiClient<unknown>("/platform/roles")
  return platformRoleSchema.array().parse(data)
}

export async function getPlatformRole(id: string): Promise<PlatformRole> {
  const data = await apiClient<unknown>(`/platform/roles/${id}`)
  return platformRoleSchema.parse(data)
}

export async function listPlatformUsers(): Promise<PlatformUser[]> {
  const data = await apiClient<unknown>("/platform/users")
  return platformUserSchema.array().parse(data)
}
