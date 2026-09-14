import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
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
      <div>
        <NavButton href="/employer/tvet" variant="ghost">
          {t("backTvet")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("sessionDetail")}</h1>
      </div>
      <TvetGate resource="tvet_session" action="view">
        <SessionDetail sessionId={id} />
      </TvetGate>
    </div>
  )
}
