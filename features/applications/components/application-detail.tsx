"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { NavButton } from "@/components/nav-button"
import { InterviewDetails } from "@/features/interviews/components/interview-details"
import { applicationQueryOptions } from "../queries/options"
import { ApplicationStatusBadge } from "./application-status-badge"

export function ApplicationDetail({ applicationId }: { applicationId: string }) {
  const t = useTranslations("SeekerApplications")
  const { data, isPending, isError } = useQuery(applicationQueryOptions(applicationId))

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (isError || !data) {
    return <p className="text-muted-foreground text-sm">{t("missing")}</p>
  }

  return (
    <div className="grid gap-3 text-sm">
      <ApplicationStatusBadge status={data.status} />
      {data.interview && data.interview.status !== "CANCELLED" ? (
        <InterviewDetails interview={data.interview} />
      ) : (
        <p className="text-muted-foreground">{t("noInterview")}</p>
      )}
      <NavButton href={`/jobs/${data.vacancyId}`} size="sm" variant="outline">
        {t("viewJob")}
      </NavButton>
    </div>
  )
}
