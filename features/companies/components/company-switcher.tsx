"use client"

import { useTranslations } from "next-intl"
import { authClient } from "@/connector"
import { ReturnedCompanyBanner } from "./returned-company-banner"

export function CompanySwitcher() {
  const t = useTranslations("Company")
  const { data: organizations, isPending } = authClient.useListOrganizations()
  const { data: active } = authClient.useActiveOrganization()

  if (isPending) {
    return <p className="text-muted-foreground text-sm">…</p>
  }

  if (!organizations?.length) {
    return <p className="text-muted-foreground text-sm">{t("empty")}</p>
  }

  return (
    <div className="grid max-w-md gap-3">
      <ReturnedCompanyBanner />
      <label className="grid gap-1 text-sm">
        <span>{t("active")}</span>
        <select
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={active?.id ?? ""}
          onChange={(event) => {
            const organizationId = event.target.value
            if (organizationId) {
              void authClient.organization.setActive({ organizationId })
            }
          }}
        >
          <option value="" disabled>
            {t("select")}
          </option>
          {organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name} — {organization.status ?? "PENDING_APPROVAL"}
            </option>
          ))}
        </select>
        {active?.status && active.status !== "APPROVED" && active.status !== "RETURNED_FOR_CORRECTION" ? (
          <p className="text-muted-foreground">{t("pendingHint")}</p>
        ) : null}
      </label>
    </div>
  )
}
