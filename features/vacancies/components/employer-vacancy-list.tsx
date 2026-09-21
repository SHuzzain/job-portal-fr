"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { Link } from "@/i18n/navigation";

import { mineVacanciesQueryOptions } from "../queries/options";
import { VacancyCard } from "./vacancy-card";

type EmployerVacancyListProps = {
  workspaceSlug?: string;
};

export function EmployerVacancyList({
  workspaceSlug,
}: EmployerVacancyListProps) {
  const t = useTranslations("EmployerVacancies");
  const { data, isPending, isError } = useQuery(mineVacanciesQueryOptions());

  if (isPending) {
    return <p className="text-sm text-muted-foreground">Loading vacancies…</p>;
  }

  if (isError || !data?.length) {
    return (
      <div className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
        {t("empty")}
      </div>
    );
  }

  const base = workspaceSlug
    ? `/employer/${workspaceSlug}/jobs`
    : "/employer/vacancies";

  return (
    <div className="grid gap-3">
      {data.map((vacancy) => (
        <div key={vacancy.id} className="grid gap-1">
          <VacancyCard vacancy={vacancy} href={`${base}/${vacancy.id}`} />
          {vacancy.status === "RETURNED_FOR_CORRECTION" ? (
            <div className="grid gap-2 rounded-lg border border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-950 dark:border-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-50">
              <p className="font-medium">{t("returnedBanner")}</p>
              {vacancy.reviewNotes ? (
                <p>{t("returnedFeedback", { notes: vacancy.reviewNotes })}</p>
              ) : null}
              <div>
                <NavButton href={`${base}/${vacancy.id}/edit`} size="xs">
                  {t("editResubmit")}
                </NavButton>
              </div>
            </div>
          ) : null}
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {vacancy.status}
            </span>
            {vacancy.status === "APPROVED" ? (
              <Link
                href={
                  workspaceSlug
                    ? `/employer/${workspaceSlug}/candidates`
                    : `/employer/vacancies/${vacancy.id}/applicants`
                }
                className="text-xs font-medium text-primary hover:underline"
              >
                {t("applicants")} →
              </Link>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
