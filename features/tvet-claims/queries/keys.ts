export const tvetClaimKeys = {
  all: ["tvet-claims"] as const,
  provider: () => [...tvetClaimKeys.all, "provider"] as const,
  eligible: () => [...tvetClaimKeys.all, "eligible"] as const,
  pasak: () => [...tvetClaimKeys.all, "pasak"] as const,
};

export const tvetClaimTags = {
  all: "tvet-claims",
} as const;
