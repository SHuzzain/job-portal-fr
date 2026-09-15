"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useReviewVacancy, useSetVacancyStatus } from "../actions/pasak.mutate"
import { pendingVacanciesQueryOptions } from "../queries/options"
import { ReviewCommentsModal } from "./review-comments-modal"

export function VacancyQueue() {
  const t = useTranslations("Pasak")
  const setStatus = useSetVacancyStatus()
  const review = useReviewVacancy()
  const [returnId, setReturnId] = useState<string | null>(null)
  const [comments, setComments] = useState("")
  const { data, isPending, isError } = useQuery(pendingVacanciesQueryOptions())

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>
  }

  if (isError || !data?.length) {
    return (
      <p className="text-sm text-muted-foreground">{t("vacanciesEmpty")}</p>
    )
  }

  const busy = setStatus.isPending || review.isPending

  return (
    <div className="grid gap-3">
      {data.map((vacancy) => (
        <article
          key={vacancy.id}
          className="grid gap-2 rounded-lg border border-border p-4 text-sm"
        >
          <h2 className="font-medium">{vacancy.title}</h2>
          <p>{vacancy.location}</p>
          <p className="text-muted-foreground">{vacancy.description}</p>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              disabled={busy}
              onClick={() =>
                setStatus.mutate({ id: vacancy.id, status: "APPROVED" })
              }
            >
              {t("approve")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={busy}
              onClick={() =>
                setStatus.mutate({ id: vacancy.id, status: "REJECTED" })
              }
            >
              {t("reject")}
            </Button>
            <Button
              size="sm"
              variant="secondary"
              disabled={busy}
              onClick={() => {
                setComments("")
                setReturnId(vacancy.id)
              }}
            >
              {t("returnForCorrection")}
            </Button>
          </div>
        </article>
      ))}
      <ReviewCommentsModal
        open={returnId !== null}
        title={t("returnForCorrection")}
        comments={comments}
        commentsLabel={t("comments")}
        commentsPlaceholder={t("commentsPlaceholder")}
        requiredHint={t("commentsRequired")}
        confirmLabel={t("submitReturn")}
        cancelLabel={t("cancel")}
        pending={review.isPending}
        onCommentsChange={setComments}
        onCancel={() => setReturnId(null)}
        onConfirm={() => {
          if (!returnId || !comments.trim()) {
            return
          }
          review.mutate(
            {
              id: returnId,
              action: "RETURN_FOR_CORRECTION",
              comments: comments.trim(),
            },
            { onSuccess: () => setReturnId(null) }
          )
        }}
      />
    </div>
  )
}
