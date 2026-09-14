import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { RfpDetail } from "@/features/tvet/components/rfp-detail"
import { TvetGate } from "@/features/tvet/components/tvet-gate"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TvetRfpPage({ params }: Props) {
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
        <h1 className="font-medium">{t("rfpDetail")}</h1>
      </div>
      <TvetGate nextPath={`/employer/tvet/rfps/${id}`}>
        <RfpDetail rfpId={id} />
      </TvetGate>
    </div>
  )
}
