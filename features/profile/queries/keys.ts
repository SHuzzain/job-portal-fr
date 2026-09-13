export const profileKeys = {
  all: ["seeker-profile"] as const,
  mine: () => [...profileKeys.all, "me"] as const,
}

export const profileTags = {
  mine: "seeker-profile-me",
}
