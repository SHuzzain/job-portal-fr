export const resumeKeys = {
  all: ["resumes"] as const,
  mine: () => [...resumeKeys.all, "mine"] as const,
}
