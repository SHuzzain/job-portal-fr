"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import { profileKeys, profileTags } from "../queries/keys"
import type { SeekerProfile, SeekerProfileUpdate } from "../schema"

export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: SeekerProfileUpdate) =>
      apiClient<SeekerProfile, SeekerProfileUpdate>("/seeker-profiles/me", {
        method: "PATCH",
        body,
      }),
    onSuccess: async () => {
      await fetch("/api/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: profileTags.mine }),
      })
      await queryClient.invalidateQueries({ queryKey: profileKeys.all })
    },
  })
}
