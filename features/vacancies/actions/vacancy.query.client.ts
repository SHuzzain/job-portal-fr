import { apiClient } from "@/connector/client";

import type { Vacancy } from "../schema";

export function listApprovedVacancies() {
  return apiClient<Vacancy[]>("/vacancies?status=APPROVED");
}

export function listMineVacancies() {
  return apiClient<Vacancy[]>("/vacancies/mine");
}

export function getVacancy(id: string) {
  return apiClient<Vacancy>(`/vacancies/${id}`);
}

export function getMineVacancy(id: string) {
  return apiClient<Vacancy>(`/vacancies/mine/${id}`);
}
