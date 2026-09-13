"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { authClient } from "@/connector"
import { companyCreateSchema, slugFromName } from "../schema"

export function RegisterCompanyForm() {
  const t = useTranslations("Company")
  const [name, setName] = useState("")
  const [ssmNumber, setSsmNumber] = useState("")
  const [ssmDocumentUrl, setSsmDocumentUrl] = useState("")
  const [legalName, setLegalName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [pending, setPending] = useState(false)

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault()
        setError(null)
        const parsed = companyCreateSchema.safeParse({
          name,
          ssmNumber,
          ssmDocumentUrl,
          legalName: legalName || undefined,
        })
        if (!parsed.success) {
          setError(t("invalid"))
          return
        }
        setPending(true)
        const result = await authClient.organization.create({
          name: parsed.data.name,
          slug: slugFromName(parsed.data.name),
          ssmNumber: parsed.data.ssmNumber,
          ssmDocumentUrl: parsed.data.ssmDocumentUrl,
          legalName: parsed.data.legalName ?? "",
          industry: "",
          website: "",
          address: "",
          reviewNotes: "",
          status: "PENDING_APPROVAL",
        })
        setPending(false)
        if (result.error) {
          setError(result.error.message ?? t("createError"))
        }
      }}
    >
      <label className="grid gap-1">
        <span>{t("name")}</span>
        <input
          required
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("ssmNumber")}</span>
        <input
          required
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={ssmNumber}
          onChange={(event) => setSsmNumber(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("ssmDocumentUrl")}</span>
        <input
          required
          type="url"
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={ssmDocumentUrl}
          onChange={(event) => setSsmDocumentUrl(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("legalName")}</span>
        <input
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={legalName}
          onChange={(event) => setLegalName(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? t("saving") : t("submit")}
      </Button>
      {error ? <p className="text-destructive">{error}</p> : null}
    </form>
  )
}
