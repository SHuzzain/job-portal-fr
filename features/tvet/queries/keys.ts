export const tvetKeys = {
  all: ["tvet"] as const,
  rfps: () => [...tvetKeys.all, "rfps"] as const,
  sessions: (rfpId?: string) =>
    [...tvetKeys.all, "sessions", rfpId ?? "all"] as const,
  session: (id: string) => [...tvetKeys.all, "session", id] as const,
  attendance: () => [...tvetKeys.all, "attendance"] as const,
  certificate: (id: string) => [...tvetKeys.all, "certificate", id] as const,
};
