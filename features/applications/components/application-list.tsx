"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { NavButton } from "@/components/nav-button"
import { ApplicationStatusBadge } from "./application-status-badge"
import { myApplicationsQueryOptions } from "../queries/options"

export function ApplicationList() {
  const t = useTranslations("SeekerApplications")
  const { data, isPending, isError } = useQuery(myApplicationsQueryOptions())

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (isError || !data?.length) {
    return <p className="text-muted-foreground text-sm">{t("empty")}</p>
  }

  return (
    <ul className="grid gap-2 text-sm">
      {data.map((application) => (
        <li key={application.id} className="flex items-center justify-between gap-3 rounded-md border border-border p-3">
          <ApplicationStatusBadge status={application.status} />
          <div className="flex gap-2">
            <NavButton href={`/seeker/applications/${application.id}`} size="xs">
              {t("view")}
            </NavButton>
            <NavButton href={`/jobs/${application.vacancyId}`} size="xs" variant="outline">
              {t("viewJob")}
            </NavButton>
          </div>
        </li>
      ))}
    </ul>
  )
}
