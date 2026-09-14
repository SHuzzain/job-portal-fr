"use client"

import { NextIntlClientProvider, type Locale } from "next-intl"
import type { ComponentProps } from "react"
import { QueryProvider } from "@/components/provider/query-provider"
import { ThemeProvider } from "@/components/provider/theme-provider"

type ProvidersProps = {
  children: React.ReactNode
  locale: Locale
  messages: ComponentProps<typeof NextIntlClientProvider>["messages"]
}

export function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    <ThemeProvider>
      <NextIntlClientProvider locale={locale} messages={messages}>
        <QueryProvider>{children}</QueryProvider>
      </NextIntlClientProvider>
    </ThemeProvider>
  )
}
