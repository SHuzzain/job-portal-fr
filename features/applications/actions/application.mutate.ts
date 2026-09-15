"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ApiError, apiClient } from "@/connector/client";

import { applicationKeys } from "../queries/keys";
import type {
  Application,
  ApplicationCreate,
  ApplicationStatus,
  EmployerSetStatus,
} from "../schema";

export function useApply() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: ApplicationCreate) =>
      apiClient<Application, ApplicationCreate>("/applications", {
        method: "POST",
        body,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useSetApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: ApplicationStatus | EmployerSetStatus;
    }) =>
      apiClient<Application, { status: ApplicationStatus | EmployerSetStatus }>(
        `/applications/${id}`,
        {
          method: "PATCH",
          body: { status },
        }
      ),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useFollowUp() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      apiClient<Application>(`/applications/${id}/follow-up`, {
        method: "POST",
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: applicationKeys.all });
    },
  });
}

export function useMarkStaleApplications() {
  return useMutation({
    mutationFn: () =>
      apiClient<{ marked: number }>("/workflows/stale-applications", {
        method: "POST",
      }),
  });
}

export function applyErrorMessage(error: unknown, fallback: string) {
  if (error instanceof ApiError && error.message) {
    return error.message;
  }
  return fallback;
}
