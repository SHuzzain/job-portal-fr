"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { sessionQueryOptions } from "../queries/options"

type Props = {
  sessionId: string
}

export function SessionDetail({ sessionId }: Props) {
  const t = useTranslations("TvetPage")
  const { data, isPending, isError } = useQuery(sessionQueryOptions(sessionId))

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (isError || !data) {
    return <p className="text-sm">{t("sessionMissing")}</p>
  }

  return (
    <div className="grid gap-6 text-sm">
      <div className="grid gap-1">
        <p>{data.venue}</p>
        <p className="text-muted-foreground">
          {data.startsAt} — {data.endsAt}
        </p>
      </div>
      <div className="grid gap-1 rounded-md border border-border p-4">
        <p className="text-muted-foreground">{t("barcodeHint")}</p>
        <p className="font-mono text-lg tracking-wide">{data.barcode}</p>
      </div>
      <div className="grid gap-2">
        <h2 className="font-medium">{t("attendance")}</h2>
        {!data.attendance.length ? (
          <p className="text-muted-foreground">{t("attendanceEmpty")}</p>
        ) : (
          <ul className="grid gap-2">
            {data.attendance.map((row) => (
              <li key={row.id} className="rounded-md border border-border p-3">
                <p>{row.userId}</p>
                <p className="text-muted-foreground">{row.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
