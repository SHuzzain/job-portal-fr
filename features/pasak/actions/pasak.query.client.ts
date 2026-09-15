import { apiClient } from "@/connector/client"
import type { Vacancy } from "@/features/vacancies/schema"
import type { PasakCompany, PasakEmployer } from "../schema"

export function listPendingCompanies() {
  return apiClient<PasakCompany[]>("/pasak/companies?status=PENDING_APPROVAL")
}

export function listPendingVacancies() {
  return apiClient<Vacancy[]>("/pasak/vacancies?status=PENDING_APPROVAL")
}

export function listEmployers() {
  return apiClient<PasakEmployer[]>("/pasak/employers")
}
