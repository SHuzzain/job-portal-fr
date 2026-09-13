export const vacancyKeys = {
  all: ["vacancies"] as const,
  lists: () => [...vacancyKeys.all, "list"] as const,
  list: (filters: { status?: string; mine?: string } = {}) =>
    [...vacancyKeys.lists(), filters] as const,
  details: () => [...vacancyKeys.all, "detail"] as const,
  detail: (id: string) => [...vacancyKeys.details(), id] as const,
}

export const vacancyTags = {
  all: "vacancies",
  list: "vacancies-list",
  detail: (id: string) => `vacancy-${id}`,
}
