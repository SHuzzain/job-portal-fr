"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { NavButton } from "@/components/nav-button"
import { rfpsQueryOptions } from "../queries/options"

export function RfpList() {
  const t = useTranslations("TvetPage")
  const { data, isPending, isError } = useQuery(rfpsQueryOptions())

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (isError || !data?.length) {
    return <p className="text-muted-foreground text-sm">{t("rfpsEmpty")}</p>
  }

  return (
    <ul className="grid gap-2 text-sm">
      {data.map((rfp) => (
        <li
          key={rfp.id}
          className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
        >
          <div>
            <p className="font-medium">{rfp.title}</p>
            <p className="text-muted-foreground">{rfp.status}</p>
          </div>
          <NavButton href={`/employer/tvet/rfps/${rfp.id}`} size="xs" variant="outline">
            {t("open")}
          </NavButton>
        </li>
      ))}
    </ul>
  )
}
