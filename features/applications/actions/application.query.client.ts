import { apiClient } from "@/connector/client";

import type { Application } from "../schema";

export function listMyApplications() {
  return apiClient<Application[]>("/applications/mine");
}

export function listVacancyApplications(vacancyId: string) {
  return apiClient<Application[]>(`/applications/vacancy/${vacancyId}`);
}

export function getApplication(id: string) {
  return apiClient<Application>(`/applications/${id}`);
}
