export const applicationKeys = {
  all: ["applications"] as const,
  mine: () => [...applicationKeys.all, "mine"] as const,
  vacancy: (id: string) => [...applicationKeys.all, "vacancy", id] as const,
  detail: (id: string) => [...applicationKeys.all, "detail", id] as const,
}
