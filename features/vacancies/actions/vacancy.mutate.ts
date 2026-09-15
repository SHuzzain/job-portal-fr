"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/connector/client";

import { vacancyKeys, vacancyTags } from "../queries/keys";
import type { Vacancy, VacancyCreate } from "../schema";

async function revalidateVacancyTag() {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: vacancyTags.all }),
  });
}

export function useUpdateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<VacancyCreate> }) =>
      apiClient<Vacancy, Partial<VacancyCreate>>(`/vacancies/${id}`, {
        method: "PATCH",
        body,
      }),
    onSuccess: async (_data, variables) => {
      await revalidateVacancyTag();
      await queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
      await queryClient.invalidateQueries({
        queryKey: vacancyKeys.detail(variables.id),
      });
    },
  });
}

export function useResubmitVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Vacancy>(`/vacancies/${id}/resubmit`, {
        method: "POST",
      }),
    onSuccess: async (_data, id) => {
      await revalidateVacancyTag();
      await queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
      await queryClient.invalidateQueries({ queryKey: vacancyKeys.detail(id) });
    },
  });
}

export function useCreateVacancy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: VacancyCreate) =>
      apiClient<Vacancy, VacancyCreate>("/vacancies", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await revalidateVacancyTag();
      await queryClient.invalidateQueries({ queryKey: vacancyKeys.all });
    },
  });
}
