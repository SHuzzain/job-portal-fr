"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { apiClient } from "@/connector/client";

import { tvetClaimKeys, tvetClaimTags } from "../queries/keys";
import type { TvetClaim } from "../schema";

async function refreshClaims(queryClient: ReturnType<typeof useQueryClient>) {
  await fetch("/api/revalidate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tag: tvetClaimTags.all }),
  });
  await queryClient.invalidateQueries({ queryKey: tvetClaimKeys.all });
}

export function useSubmitClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: {
      courseId: string;
      claimAmount: string;
      borangTuntutanUrl: string;
    }) =>
      apiClient<TvetClaim, typeof body>("/tvet/claims", {
        method: "POST",
        body,
      }),
    onSuccess: () => refreshClaims(queryClient),
  });
}

export function useUploadSignedClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      signedBorangAkuanUrl,
    }: {
      id: string;
      signedBorangAkuanUrl: string;
    }) =>
      apiClient<TvetClaim, { signedBorangAkuanUrl: string }>(
        `/tvet/claims/${id}/upload-signed`,
        { method: "POST", body: { signedBorangAkuanUrl } }
      ),
    onSuccess: () => refreshClaims(queryClient),
  });
}

export function useReviewClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      action,
      comments,
    }: {
      id: string;
      action: "APPROVE" | "REJECT";
      comments?: string;
    }) =>
      apiClient<TvetClaim, { action: "APPROVE" | "REJECT"; comments?: string }>(
        `/pasak/claims/${id}/review`,
        { method: "POST", body: { action, comments } }
      ),
    onSuccess: () => refreshClaims(queryClient),
  });
}

export function useFinalizeClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) =>
      apiClient<TvetClaim>(`/pasak/claims/${id}/finalize-payment`, {
        method: "POST",
      }),
    onSuccess: () => refreshClaims(queryClient),
  });
}
