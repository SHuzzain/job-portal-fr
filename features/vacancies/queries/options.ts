import { queryOptions } from "@tanstack/react-query";

import {
  getMineVacancy,
  listApprovedVacancies,
  listMineVacancies,
} from "../actions/vacancy.query.client";
import { vacancyKeys } from "./keys";

export function approvedVacanciesQueryOptions() {
  return queryOptions({
    queryKey: vacancyKeys.list({ status: "APPROVED" }),
    queryFn: listApprovedVacancies,
  });
}

export function mineVacanciesQueryOptions() {
  return queryOptions({
    queryKey: vacancyKeys.list({ mine: "true" }),
    queryFn: listMineVacancies,
  });
}

export function mineVacancyQueryOptions(id: string) {
  return queryOptions({
    queryKey: vacancyKeys.detail(id),
    queryFn: () => getMineVacancy(id),
  });
}
