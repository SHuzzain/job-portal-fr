import { queryOptions } from "@tanstack/react-query";

import {
  listEmployers,
  listPendingCompanies,
  listPendingVacancies,
} from "../actions/pasak.query.client";
import { pasakKeys } from "./keys";

export function pendingCompaniesQueryOptions() {
  return queryOptions({
    queryKey: pasakKeys.companyList("PENDING_APPROVAL"),
    queryFn: listPendingCompanies,
  });
}

export function pendingVacanciesQueryOptions() {
  return queryOptions({
    queryKey: pasakKeys.vacancyList("PENDING_APPROVAL"),
    queryFn: listPendingVacancies,
  });
}

export function employersQueryOptions() {
  return queryOptions({
    queryKey: pasakKeys.employers(),
    queryFn: listEmployers,
  });
}
