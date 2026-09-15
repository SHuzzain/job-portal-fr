import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { PermissionGate } from "@/features/auth/components/permission-gate";
import { TvetCertificateView } from "@/features/tvet/components/tvet-certificate-view";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function TvetCertificatePage({ params }: Props) {
  const { id } = await params;
  const t = await getTranslations("TvetCertificate");

  return (
    <div className="mx-auto flex min-h-svh max-w-4xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/seeker/scan" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <PermissionGate resource="tvet_certificate" action="view">
        <TvetCertificateView sessionId={id} />
      </PermissionGate>
    </div>
  );
}
