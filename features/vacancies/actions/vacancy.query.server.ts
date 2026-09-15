import { apiServer } from "@/connector/server";

import { vacancyTags } from "../queries/keys";
import type { Vacancy } from "../schema";

function approvedVacanciesPath(
  filters: {
    q?: string;
    location?: string;
    employmentType?: string;
  } = {}
) {
  const params = new URLSearchParams({ status: "APPROVED" });
  if (filters.q) params.set("q", filters.q);
  if (filters.location) params.set("location", filters.location);
  if (filters.employmentType)
    params.set("employmentType", filters.employmentType);
  return `/vacancies?${params.toString()}`;
}

export function listApprovedVacancies(
  filters: {
    q?: string;
    location?: string;
    employmentType?: string;
  } = {}
) {
  return apiServer<Vacancy[]>(approvedVacanciesPath(filters), {
    tags: [vacancyTags.all, vacancyTags.list],
    timeoutMs: 3_000,
  });
}

export function getVacancy(id: string) {
  return apiServer<Vacancy>(`/vacancies/${id}`, {
    tags: [vacancyTags.all, vacancyTags.detail(id)],
  });
}
