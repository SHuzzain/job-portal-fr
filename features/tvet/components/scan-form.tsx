"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { tvetErrorMessage, useScanSession } from "../actions/tvet.mutate"
import { myAttendanceQueryOptions } from "../queries/options"

export function ScanForm() {
  const t = useTranslations("TvetScan")
  const scan = useScanSession()
  const attendance = useQuery(myAttendanceQueryOptions())
  const [barcode, setBarcode] = useState("")

  return (
    <div className="grid gap-6 text-sm">
      <form
        className="grid max-w-md gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          scan.mutate(
            { barcode: barcode.trim() },
            {
              onSuccess: () => setBarcode(""),
            },
          )
        }}
      >
        <label className="grid gap-1">
          <span>{t("barcode")}</span>
          <input
            required
            className="border-input bg-background rounded-md border px-2 py-1.5 font-mono"
            value={barcode}
            onChange={(event) => setBarcode(event.target.value)}
          />
        </label>
        <Button type="submit" disabled={scan.isPending}>
          {scan.isPending ? t("saving") : t("submit")}
        </Button>
        {scan.isError ? (
          <p className="text-destructive">{tvetErrorMessage(scan.error, t("error"))}</p>
        ) : null}
        {scan.isSuccess ? <p className="text-muted-foreground">{t("success")}</p> : null}
      </form>
      <div className="grid gap-2">
        <h2 className="font-medium">{t("mine")}</h2>
        {attendance.isPending ? (
          <p className="text-muted-foreground">…</p>
        ) : !attendance.data?.length ? (
          <p className="text-muted-foreground">{t("empty")}</p>
        ) : (
          <ul className="grid gap-2">
            {attendance.data.map((row) => (
              <li key={row.id} className="rounded-md border border-border p-3">
                <p>{row.sessionId}</p>
                <p className="text-muted-foreground">{row.createdAt}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
