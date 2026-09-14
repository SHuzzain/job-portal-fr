"use client"

import { useQuery } from "@tanstack/react-query"
import { Download } from "lucide-react"
import { useLocale, useTranslations } from "next-intl"
import { useState } from "react"
import { NavButton } from "@/components/nav-button"
import { Button } from "@/components/ui/button"
import { downloadCertificate } from "../actions/tvet.query.client"
import { certificateQueryOptions } from "../queries/options"

type Props = {
  sessionId: string
}

export function TvetCertificateView({ sessionId }: Props) {
  const t = useTranslations("TvetCertificate")
  const locale = useLocale()
  const certificate = useQuery(certificateQueryOptions(sessionId))
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(false)

  if (certificate.isPending) {
    return <p className="text-sm text-muted-foreground">…</p>
  }

  if (certificate.isError) {
    return (
      <div className="grid gap-3 text-sm">
        <p className="text-destructive">{t("locked")}</p>
        <div>
          <NavButton href={`/seeker/tvet/${sessionId}/survey`}>
            {t("takeSurvey")}
          </NavButton>
        </div>
      </div>
    )
  }

  const data = certificate.data
  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(locale, {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value))

  return (
    <div className="grid gap-6">
      <section className="relative overflow-hidden rounded-lg border-4 border-primary/30 bg-card p-3 shadow-sm">
        <div className="grid min-h-96 place-items-center border border-primary/50 p-8 text-center">
          <div className="grid max-w-2xl gap-5">
            <p className="text-sm font-semibold tracking-[0.25em] text-primary uppercase">
              {t("official")}
            </p>
            <h1 className="text-2xl font-semibold sm:text-3xl">{t("title")}</h1>
            <p className="text-muted-foreground">{t("presentedTo")}</p>
            <p className="text-3xl font-semibold">{data.recipientName}</p>
            <p>{t("completed")}</p>
            <p className="text-xl font-semibold text-primary">
              {data.courseTitle}
            </p>
            <p className="text-muted-foreground">
              {t("providedBy", { provider: data.providerName })}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatDate(data.startsAt)} – {formatDate(data.endsAt)} ·{" "}
              {data.venue}
            </p>
            <div className="mt-4 grid gap-1 text-xs">
              <span>
                {t("issued", { date: formatDate(data.surveyCompletedAt) })}
              </span>
              <span className="font-mono">
                {t("verification", { code: data.certificateCode })}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-2">
        <div>
          <Button
            disabled={downloading || !data.downloadAuthorized}
            onClick={async () => {
              setDownloading(true)
              setDownloadError(false)
              try {
                const blob = await downloadCertificate(data.downloadUrl)
                const url = URL.createObjectURL(blob)
                const anchor = document.createElement("a")
                anchor.href = url
                anchor.download = `tvet-certificate-${data.certificateCode}.pdf`
                document.body.appendChild(anchor)
                anchor.click()
                anchor.remove()
                URL.revokeObjectURL(url)
              } catch {
                setDownloadError(true)
              } finally {
                setDownloading(false)
              }
            }}
          >
            <Download />
            {downloading ? t("downloading") : t("download")}
          </Button>
        </div>
        {downloadError ? (
          <p className="text-sm text-destructive">{t("downloadError")}</p>
        ) : null}
      </div>
    </div>
  )
}
