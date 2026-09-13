"use client"

import { useTranslations } from "next-intl"

type Props = {
  status: string
}

export function ApplicationStatusBadge({ status }: Props) {
  const t = useTranslations("ApplicationStatus")
  const labels = {
    submitted: t("submitted"),
    reviewing: t("reviewing"),
    shortlisted: t("shortlisted"),
    waiting_for_interview: t("waitingForInterview"),
    interview_completed: t("interviewCompleted"),
    rejected: t("rejected"),
    hired: t("hired"),
    failed: t("failed"),
  } as const
  const key = status === "STALE" || status === "FAILED" ? "failed" : status.toLowerCase()
  const label = key in labels ? labels[key as keyof typeof labels] : status

  return (
    <span className="inline-flex rounded-md border border-border px-2 py-0.5 text-xs">
      {label}
    </span>
  )
}
