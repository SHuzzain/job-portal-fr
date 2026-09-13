import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"

export default async function HomePage() {
  const t = await getTranslations("HomePage")

  return (
    <div className="flex min-h-svh p-6">
      <div className="flex max-w-md min-w-0 flex-col gap-4 text-sm leading-loose">
        <LocaleSwitcher />
        <div>
          <h1 className="font-medium">{t("title")}</h1>
          <p>{t("subtitle")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <NavButton href="/jobs">{t("jobs")}</NavButton>
            <NavButton href="/seeker" variant="outline">
              {t("seeker")}
            </NavButton>
            <NavButton href="/employer" variant="outline">
              {t("employer")}
            </NavButton>
            <NavButton href="/pasak" variant="outline">
              {t("pasak")}
            </NavButton>
            <NavButton href="/sign-in" variant="ghost">
              {t("signIn")}
            </NavButton>
          </div>
        </div>
        <div className="font-mono text-muted-foreground text-xs">
          {t("themeHint", { key: "d" })}
        </div>
      </div>
    </div>
  )
}
