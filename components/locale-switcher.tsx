"use client"

import { useLocale } from "next-intl"
import { buttonVariants } from "@/components/ui/button"
import { Link, usePathname } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"
import { cn } from "@/lib/utils"

const labels: Record<(typeof routing.locales)[number], string> = {
  en: "EN",
  ms: "MS",
}

export function LocaleSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()

  return (
    <div className="flex gap-1">
      {routing.locales.map((nextLocale) => (
        <Link
          key={nextLocale}
          href={pathname}
          locale={nextLocale}
          className={cn(
            buttonVariants({
              size: "xs",
              variant: nextLocale === locale ? "default" : "outline",
            }),
          )}
        >
          {labels[nextLocale]}
        </Link>
      ))}
    </div>
  )
}
