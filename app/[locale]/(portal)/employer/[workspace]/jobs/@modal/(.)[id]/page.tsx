import { notFound } from "next/navigation";

import { getVacancy } from "@/features/vacancies/actions/vacancy.query.server";
import { VacancyDetailModal } from "@/features/vacancies/components/vacancy-detail-modal";

type Props = {
  params: Promise<{ id: string; workspace: string }>;
};

export default async function InterceptedJobModalPage({ params }: Props) {
  const { id, workspace } = await params;
  const vacancy = await getVacancy(id).catch(() => null);

  if (!vacancy) {
    notFound();
  }

  return <VacancyDetailModal vacancy={vacancy} workspaceSlug={workspace} />;
}
