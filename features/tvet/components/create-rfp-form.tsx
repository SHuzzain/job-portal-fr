"use client"

import { useTranslations } from "next-intl"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { tvetErrorMessage, useCreateRfp } from "../actions/tvet.mutate"
import type { TvetRfpCreate } from "../schema"

const emptyDraft: TvetRfpCreate = {
  title: "",
  description: "",
}

export function CreateRfpForm() {
  const t = useTranslations("TvetPage")
  const createRfp = useCreateRfp()
  const [draft, setDraft] = useState(emptyDraft)

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={(event) => {
        event.preventDefault()
        createRfp.mutate(draft, {
          onSuccess: () => setDraft(emptyDraft),
        })
      }}
    >
      <label className="grid gap-1">
        <span>{t("rfpTitle")}</span>
        <input
          required
          className="border-input bg-background rounded-md border px-2 py-1.5"
          value={draft.title}
          onChange={(event) => setDraft({ ...draft, title: event.target.value })}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("rfpDescription")}</span>
        <textarea
          required
          className="border-input bg-background min-h-24 rounded-md border px-2 py-1.5"
          value={draft.description}
          onChange={(event) => setDraft({ ...draft, description: event.target.value })}
        />
      </label>
      <Button type="submit" disabled={createRfp.isPending}>
        {createRfp.isPending ? t("saving") : t("createRfp")}
      </Button>
      {createRfp.isError ? (
        <p className="text-destructive text-sm">{tvetErrorMessage(createRfp.error, t("error"))}</p>
      ) : null}
    </form>
  )
}
