import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { ProviderClaims } from "@/features/tvet-claims/components/provider-claims";
import { TvetGate } from "@/features/tvet/components/tvet-gate";

export default async function EmployerTvetClaimsPage() {
  const t = await getTranslations("TvetClaims");

  return (
    <div className="mx-auto flex min-h-svh max-w-3xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer/tvet" variant="ghost">
          {t("backTvet")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("providerTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("providerHint")}
        </p>
      </div>
      <TvetGate resource="tvet_claim" action="view">
        <ProviderClaims />
      </TvetGate>
    </div>
  );
}
