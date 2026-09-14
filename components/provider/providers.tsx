"use client"

import { NextIntlClientProvider, type Locale } from "next-intl"
import type { ComponentProps } from "react"
import { QueryProvider } from "@/components/provider/query-provider"
import { ThemeProvider } from "@/components/provider/theme-provider"

type ProvidersProps = {
  children: React.ReactNode
  locale: Locale
  messages: ComponentProps<typeof NextIntlClientProvider>["messages"]
  timeZone: string
}

export function Providers({ children, locale, messages, timeZone }: ProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages} timeZone={timeZone}>
        <QueryProvider>{children}</QueryProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
