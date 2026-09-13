import { getTranslations } from "next-intl/server"
import { LocaleSwitcher } from "@/components/locale-switcher"
import { NavButton } from "@/components/nav-button"
import { SessionActions } from "@/features/auth/components/session-actions"
import { SessionDetail } from "@/features/tvet/components/session-detail"
import { TvetGate } from "@/features/tvet/components/tvet-gate"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TvetSessionPage({ params }: Props) {
  const t = await getTranslations("TvetPage")
  const { id } = await params

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-3">
        <NavButton href="/employer/tvet" variant="ghost">
          {t("backTvet")}
        </NavButton>
        <div className="flex items-center gap-3">
          <SessionActions />
          <LocaleSwitcher />
        </div>
      </div>
      <div>
        <h1 className="font-medium">{t("sessionDetail")}</h1>
      </div>
      <TvetGate nextPath={`/employer/tvet/sessions/${id}`}>
        <SessionDetail sessionId={id} />
      </TvetGate>
    </div>
  )
}
