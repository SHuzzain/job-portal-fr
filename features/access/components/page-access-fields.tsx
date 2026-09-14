"use client"

import { useTranslations } from "next-intl"
import { PAGE_ACCESS, type PageAccess } from "../pages"

type Props = {
  value: PageAccess[]
  onChange: (pages: PageAccess[]) => void
  disabled?: boolean
}

export function PageAccessFields({ value, onChange, disabled }: Props) {
  const t = useTranslations("Access")

  return (
    <fieldset className="grid gap-2" disabled={disabled}>
      <legend className="text-sm">{t("pageAccess")}</legend>
      {PAGE_ACCESS.map((page) => (
        <label key={page} className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={value.includes(page)}
            onChange={(event) => {
              if (event.target.checked) {
                onChange([...value, page])
                return
              }
              onChange(value.filter((item) => item !== page))
            }}
          />
          <span>{t(page)}</span>
        </label>
      ))}
    </fieldset>
  )
}
