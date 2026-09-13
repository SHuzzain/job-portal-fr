"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { NavButton } from "@/components/nav-button"
import { tvetErrorMessage, useUpdateRfp } from "../actions/tvet.mutate"
import { rfpsQueryOptions, sessionsQueryOptions } from "../queries/options"
import { CreateSessionForm } from "./create-session-form"

type Props = {
  rfpId: string
}

export function RfpDetail({ rfpId }: Props) {
  const t = useTranslations("TvetPage")
  const updateRfp = useUpdateRfp()
  const rfps = useQuery(rfpsQueryOptions())
  const sessions = useQuery(sessionsQueryOptions(rfpId))
  const rfp = rfps.data?.find((item) => item.id === rfpId)

  if (rfps.isPending || sessions.isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!rfp) {
    return <p className="text-sm">{t("rfpMissing")}</p>
  }

  return (
    <div className="grid gap-6 text-sm">
      <div className="grid gap-2">
        <p className="text-muted-foreground">{rfp.status}</p>
        <p>{rfp.description}</p>
        {rfp.status === "OPEN" ? (
          <Button
            size="sm"
            variant="outline"
            disabled={updateRfp.isPending}
            onClick={() => updateRfp.mutate({ id: rfp.id, status: "CLOSED" })}
          >
            {t("closeRfp")}
          </Button>
        ) : null}
        {updateRfp.isError ? (
          <p className="text-destructive">{tvetErrorMessage(updateRfp.error, t("error"))}</p>
        ) : null}
      </div>
      {rfp.status === "OPEN" ? <CreateSessionForm rfpId={rfp.id} /> : null}
      <div className="grid gap-2">
        <h2 className="font-medium">{t("sessions")}</h2>
        {!sessions.data?.length ? (
          <p className="text-muted-foreground">{t("sessionsEmpty")}</p>
        ) : (
          <ul className="grid gap-2">
            {sessions.data.map((session) => (
              <li
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div>
                  <p className="font-medium">{session.title}</p>
                  <p className="text-muted-foreground">{session.venue}</p>
                </div>
                <NavButton
                  href={`/employer/tvet/sessions/${session.id}`}
                  size="xs"
                  variant="outline"
                >
                  {t("open")}
                </NavButton>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
