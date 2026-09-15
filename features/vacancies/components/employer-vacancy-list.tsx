"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";

import { mineVacanciesQueryOptions } from "../queries/options";
import { VacancyCard } from "./vacancy-card";

export function EmployerVacancyList() {
  const t = useTranslations("EmployerVacancies");
  const { data, isPending, isError } = useQuery(mineVacanciesQueryOptions());

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data?.length) {
    return <p className="text-sm text-muted-foreground">{t("empty")}</p>;
  }

  return (
    <div className="grid gap-3">
      {data.map((vacancy) => (
        <div key={vacancy.id} className="grid gap-1">
          <VacancyCard vacancy={vacancy} />
          {vacancy.status === "RETURNED_FOR_CORRECTION" ? (
            <div className="grid gap-2 rounded-lg border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-50">
              <p className="font-medium">{t("returnedBanner")}</p>
              {vacancy.reviewNotes ? (
                <p>{t("returnedFeedback", { notes: vacancy.reviewNotes })}</p>
              ) : null}
              <div>
                <NavButton
                  href={`/employer/vacancies/${vacancy.id}/edit`}
                  size="xs"
                >
                  {t("editResubmit")}
                </NavButton>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">{vacancy.status}</p>
            {vacancy.status === "APPROVED" ? (
              <NavButton
                href={`/employer/vacancies/${vacancy.id}/applicants`}
                size="xs"
                variant="outline"
              >
                {t("applicants")}
              </NavButton>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
