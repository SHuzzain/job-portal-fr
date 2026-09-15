"use client";

import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { authClient } from "@/connector";

export function ReturnedCompanyBanner() {
  const t = useTranslations("Company");
  const { data: active } = authClient.useActiveOrganization();

  if (!active || active.status !== "RETURNED_FOR_CORRECTION") {
    return null;
  }

  return (
    <div className="grid gap-2 rounded-lg border border-yellow-400 bg-yellow-50 p-4 text-sm text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-50">
      <p className="font-medium">{t("returnedBanner")}</p>
      {active.reviewNotes ? (
        <p>{t("returnedFeedback", { notes: active.reviewNotes })}</p>
      ) : null}
      <div>
        <NavButton href={`/employer/companies/${active.id}/edit`} size="sm">
          {t("editResubmit")}
        </NavButton>
      </div>
    </div>
  );
}
