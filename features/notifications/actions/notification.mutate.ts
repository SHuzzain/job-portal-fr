"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import { notificationKeys } from "../queries/keys"
import type { Notification } from "../schema"

export function useMarkRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Notification>(`/notifications/${id}/read`, {
        method: "PATCH",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}

export function useMarkAllRead() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () =>
      apiClient<Notification[]>("/notifications/read-all", {
        method: "POST",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: notificationKeys.all })
    },
  })
}
