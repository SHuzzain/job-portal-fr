"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import { resumeKeys } from "../queries/keys"
import type { Resume, ResumeCreate } from "../schema"

export function useCreateResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: ResumeCreate) =>
      apiClient<Resume, ResumeCreate>("/resumes", { method: "POST", body }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resumeKeys.all })
    },
  })
}

export function useDeleteResume() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => apiClient<undefined>(`/resumes/${id}`, { method: "DELETE" }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: resumeKeys.all })
    },
  })
}
