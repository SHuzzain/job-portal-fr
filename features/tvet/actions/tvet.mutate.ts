"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient, ApiError } from "@/connector/client"
import { tvetKeys } from "../queries/keys"
import type {
  TvetAttendance,
  TvetCertificate,
  TvetRfp,
  TvetRfpCreate,
  TvetScan,
  TvetSession,
  TvetSessionCreate,
  TvetSurveySubmit,
} from "../schema"

export function tvetErrorMessage(error: unknown, fallback: string) {
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
  return fallback
}

export function useCreateRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: TvetRfpCreate) =>
      apiClient<TvetRfp, TvetRfpCreate>("/tvet/rfps", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tvetKeys.rfps() })
    },
  })
}

export function useUpdateRfp() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "OPEN" | "CLOSED" }) =>
      apiClient<TvetRfp, { status: "OPEN" | "CLOSED" }>(`/tvet/rfps/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tvetKeys.all })
    },
  })
}

export function useCreateSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: TvetSessionCreate) =>
      apiClient<TvetSession, TvetSessionCreate>("/tvet/sessions", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tvetKeys.all })
    },
  })
}

export function useScanSession() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: TvetScan) =>
      apiClient<TvetAttendance, TvetScan>("/tvet/scan", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: tvetKeys.attendance() })
    },
  })
}

export function useSubmitSurvey(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: TvetSurveySubmit) =>
      apiClient<TvetCertificate, TvetSurveySubmit>(
        `/tvet/sessions/${id}/survey`,
        {
          method: "POST",
          body,
        }
      ),
    onSuccess: async (certificate) => {
      queryClient.setQueryData(tvetKeys.certificate(id), certificate)
      await queryClient.invalidateQueries({ queryKey: tvetKeys.attendance() })
    },
  })
}
