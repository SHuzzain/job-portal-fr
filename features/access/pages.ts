export const PAGE_ACCESS = [
  "seeker_portal",
  "employer_portal",
  "tvet_portal",
  "pasak_portal",
] as const

export type PageAccess = (typeof PAGE_ACCESS)[number]

export const PLATFORM_ROLES = ["jobseeker", "employer", "admin", "super_admin"] as const

export type PlatformRole = (typeof PLATFORM_ROLES)[number]

export const RESERVED_ORG_ROLES = ["owner", "admin", "member"] as const

export const BUILTIN_ORG_PAGES: Record<(typeof RESERVED_ORG_ROLES)[number], PageAccess[]> = {
  owner: ["employer_portal", "tvet_portal", "pasak_portal"],
  admin: ["employer_portal", "tvet_portal"],
  member: ["employer_portal"],
}

export function slugRoleName(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40)
}

export function pagesFromPermission(permission: Record<string, string[]> | undefined) {
  const pages = permission?.page ?? []
  return PAGE_ACCESS.filter((page) => pages.includes(page))
}

export function orgRolePermission(pages: PageAccess[]) {
  const canPost = pages.includes("employer_portal")
  const permission: Record<string, string[]> = {
    page: pages,
    ac: ["read"],
  }
  if (canPost) {
    permission.vacancy = ["create", "read", "update"]
    permission.member = ["create", "update"]
    permission.invitation = ["create"]
  }
  return permission
}
