export const accessKeys = {
  all: ["access"] as const,
  platformRoles: () => [...accessKeys.all, "platform-roles"] as const,
  platformRole: (id: string) => [...accessKeys.all, "platform-role", id] as const,
  platformUsers: () => [...accessKeys.all, "platform-users"] as const,
  orgRoles: (organizationId: string) =>
    [...accessKeys.all, "org-roles", organizationId] as const,
  orgMembers: (organizationId: string) =>
    [...accessKeys.all, "org-members", organizationId] as const,
}

export const accessTags = {
  platformRoles: "platform-roles",
  platformUsers: "platform-users",
} as const
