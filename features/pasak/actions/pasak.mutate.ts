"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/connector/client"
import type { Vacancy } from "@/features/vacancies/schema"
import type { PasakCompany, PasakEmployer, PasakReviewAction } from "../schema"

export function useSetCompanyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      apiClient<PasakCompany, { status: "APPROVED" | "REJECTED" }>(`/pasak/companies/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "companies"] })
    },
  })
}

export function useReviewCompany() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      action,
      comments,
    }: {
      id: string
      action: PasakReviewAction
      comments?: string
    }) =>
      apiClient<PasakCompany, { action: PasakReviewAction; comments?: string }>(
        `/pasak/companies/${id}/review`,
        {
          method: "POST",
          body: { action, comments },
        },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "companies"] })
    },
  })
}

export function useReviewVacancy() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      action,
      comments,
    }: {
      id: string
      action: PasakReviewAction
      comments?: string
    }) =>
      apiClient<Vacancy, { action: PasakReviewAction; comments?: string }>(
        `/pasak/vacancies/${id}/review`,
        {
          method: "POST",
          body: { action, comments },
        },
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "vacancies"] })
    },
  })
}

export function useSetTvetCapability() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      hasTvetCapability,
    }: {
      id: string
      hasTvetCapability: boolean
    }) =>
      apiClient<PasakEmployer, { hasTvetCapability: boolean }>(`/pasak/employers/${id}`, {
        method: "PATCH",
        body: { hasTvetCapability },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "employers"] })
    },
  })
}

export function useSetVacancyStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: "APPROVED" | "REJECTED" }) =>
      apiClient<Vacancy, { status: "APPROVED" | "REJECTED" }>(`/pasak/vacancies/${id}`, {
        method: "PATCH",
        body: { status },
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pasak", "vacancies"] })
    },
  })
}
