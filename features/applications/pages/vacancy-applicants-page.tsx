import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { VacancyApplicantList } from "@/features/applications/components/vacancy-applicant-list";
import { PermissionGate } from "@/features/auth/components/permission-gate";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function VacancyApplicantsPage({ params }: Props) {
  const t = await getTranslations("EmployerApplicants");
  const { id } = await params;

  return (
    <div className="mx-auto flex min-h-svh max-w-2xl flex-col gap-6 p-6">
      <div>
        <NavButton href="/employer/vacancies" variant="ghost">
          {t("back")}
        </NavButton>
      </div>
      <div>
        <h1 className="font-medium">{t("title")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{t("hint")}</p>
      </div>
      <PermissionGate resource="applicant" action="view">
        <VacancyApplicantList vacancyId={id} />
      </PermissionGate>
    </div>
  );
}
