"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import { applicationKeys } from "@/features/applications/queries/keys"
import type { Interview, InterviewSchedule } from "../schema"

export function useScheduleInterview() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: InterviewSchedule) =>
      apiClient<Interview, InterviewSchedule>("/interviews/schedule", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: applicationKeys.all })
    },
  })
}
