import { getTranslations } from "next-intl/server"
import { NavButton } from "@/components/nav-button"
import { SessionGate } from "@/features/auth/components/session-gate"
import { TvetCertificateView } from "@/features/tvet/components/tvet-certificate-view"

type Props = {
  params: Promise<{ id: string }>
}

export default async function TvetCertificatePage({ params }: Props) {
  const { id } = await params
  const t = await getTranslations("TvetCertificate")

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker/scan" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <SessionGate
        roles={["jobseeker", "admin", "super_admin"]}
        nextPath={`/seeker/tvet/${id}/certificate`}
      >
        <TvetCertificateView sessionId={id} />
      </SessionGate>
    </div>
  )
}
