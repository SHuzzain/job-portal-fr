"use client"

import { useQuery } from "@tanstack/react-query"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import { useSetTvetCapability } from "../actions/pasak.mutate"
import { employersQueryOptions } from "../queries/options"

export function TvetCapabilityQueue() {
  const t = useTranslations("Pasak")
  const setCapability = useSetTvetCapability()
  const { data, isPending, isError } = useQuery(employersQueryOptions())

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>
  }

  if (isError || !data?.length) {
    return <p className="text-sm text-muted-foreground">{t("tvetEmpty")}</p>
  }

  return (
    <div className="grid gap-3">
      {data.map((employer) => (
        <article
          key={employer.id}
          className="grid gap-2 rounded-lg border border-border p-4 text-sm"
        >
          <h2 className="font-medium">{employer.name}</h2>
          <p>{employer.email}</p>
          <p className="text-muted-foreground">
            {employer.hasTvetCapability ? t("tvetOn") : t("tvetOff")}
          </p>
          <Button
            size="sm"
            variant={employer.hasTvetCapability ? "outline" : "default"}
            disabled={setCapability.isPending}
            onClick={() =>
              setCapability.mutate({
                id: employer.id,
                hasTvetCapability: !employer.hasTvetCapability,
              })
            }
          >
            {employer.hasTvetCapability ? t("revokeTvet") : t("grantTvet")}
          </Button>
        </article>
      ))}
    </div>
  )
}
