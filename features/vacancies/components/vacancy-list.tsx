"use client";

import { useQuery } from "@tanstack/react-query";

import { approvedVacanciesQueryOptions } from "../queries/options";
import { VacancyCard } from "./vacancy-card";

export function VacancyList({ emptyLabel }: { emptyLabel: string }) {
  const { data, isPending, isError } = useQuery(
    approvedVacanciesQueryOptions()
  );

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  if (isError || !data?.length) {
    return <p className="text-sm text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="grid gap-3">
      {data.map((vacancy) => (
        <VacancyCard key={vacancy.id} vacancy={vacancy} />
      ))}
    </div>
  );
}
