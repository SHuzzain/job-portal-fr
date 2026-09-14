"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { ApiError, apiClient } from "@/connector/client"
import type { PermissionMap } from "@/connector/access/catalog"
import { accessKeys } from "../queries/keys"
import {
  platformRoleSchema,
  platformUserSchema,
  type PlatformRole,
  type PlatformUser,
} from "../schema"

export function accessErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.message) {
    try {
      const parsed = JSON.parse(error.message) as { message?: unknown }
      if (typeof parsed.message === "string" && parsed.message) {
        return parsed.message
      }
    } catch {
      return error.message
    }
    return error.message
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

type CreateRoleBody = {
  name: string
  label: string
  permissions: PermissionMap
}

export function useCreatePlatformRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateRoleBody): Promise<PlatformRole> => {
      const data = await apiClient<unknown, CreateRoleBody>("/platform/roles", {
        method: "POST",
        body,
      })
      return platformRoleSchema.parse(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accessKeys.platformRoles() })
    },
  })
}

type UpdateRoleBody = {
  label?: string
  permissions?: PermissionMap
}

export function useUpdatePlatformRole(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: UpdateRoleBody): Promise<PlatformRole> => {
      const data = await apiClient<unknown, UpdateRoleBody>(`/platform/roles/${id}`, {
        method: "PATCH",
        body,
      })
      return platformRoleSchema.parse(data)
    },
    onSuccess: async (role) => {
      queryClient.setQueryData(accessKeys.platformRole(id), role)
      await queryClient.invalidateQueries({ queryKey: accessKeys.platformRoles() })
    },
  })
}

export function useDeletePlatformRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<undefined>(`/platform/roles/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accessKeys.platformRoles() })
    },
  })
}

type CreateUserBody = {
  name: string
  email: string
  password: string
  role: string
}

export function useCreatePlatformUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (body: CreateUserBody): Promise<PlatformUser> => {
      const data = await apiClient<unknown, CreateUserBody>("/platform/users", {
        method: "POST",
        body,
      })
      return platformUserSchema.parse(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accessKeys.platformUsers() })
    },
  })
}

export function useAssignPlatformRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      userId,
      role,
    }: {
      userId: string
      role: string
    }): Promise<PlatformUser> => {
      const data = await apiClient<unknown, { role: string }>(
        `/platform/users/${userId}/role`,
        { method: "POST", body: { role } },
      )
      return platformUserSchema.parse(data)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: accessKeys.platformUsers() })
    },
  })
}
