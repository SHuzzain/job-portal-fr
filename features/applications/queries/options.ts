import { queryOptions } from "@tanstack/react-query"
import {
  getApplication,
  listMyApplications,
  listVacancyApplications,
} from "../actions/application.query.client"
import { applicationKeys } from "./keys"

export function myApplicationsQueryOptions() {
  return queryOptions({
    queryKey: applicationKeys.mine(),
    queryFn: listMyApplications,
  })
}

export function vacancyApplicationsQueryOptions(vacancyId: string) {
  return queryOptions({
    queryKey: applicationKeys.vacancy(vacancyId),
    queryFn: () => listVacancyApplications(vacancyId),
  })
}

export function applicationQueryOptions(id: string) {
  return queryOptions({
    queryKey: applicationKeys.detail(id),
    queryFn: () => getApplication(id),
  })
}
