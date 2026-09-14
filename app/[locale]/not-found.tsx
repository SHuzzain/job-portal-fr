import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"

export default async function NotFoundPage() {
  const t = await getTranslations("NotFound")

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-4 p-6">
      <h1 className="font-medium">{t("title")}</h1>
      <p className="text-sm text-muted-foreground">{t("hint")}</p>
      <div>
        <NavButton href="/">{t("home")}</NavButton>
      </div>
    </div>
  )
}
