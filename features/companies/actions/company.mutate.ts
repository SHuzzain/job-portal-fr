"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import type { PasakCompany } from "@/features/pasak/schema"

export function useResubmitCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<PasakCompany>(`/companies/${id}/resubmit`, {
        method: "POST",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "companies"] })
    },
  })
}
