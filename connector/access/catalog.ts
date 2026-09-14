/**
 * Mirror of src/auth/access/catalog.ts in the API. Every resource lists only
 * the actions its routes genuinely support, so the permission matrix never
 * offers an action that has no endpoint behind it.
 */
export const RESOURCES = {
  seeker_profile: ["view", "update"],
  resume: ["view", "create", "delete"],
  seeker_application: ["view", "create"],
  tvet_attendance: ["view", "scan"],
  tvet_certificate: ["view", "submit_survey", "download"],
  company: ["view", "create", "update", "resubmit"],
  vacancy: ["view", "create", "update", "delete", "resubmit"],
  applicant: ["view", "shortlist", "reject", "hire", "follow_up"],
  interview: ["view", "schedule"],
  tvet_rfp: ["view", "create", "update", "close"],
  tvet_session: ["view", "create"],
  tvet_claim: ["view", "create", "upload_signed", "download"],
  company_review: ["view", "approve", "reject", "return"],
  vacancy_review: ["view", "approve", "reject", "return"],
  tvet_capability: ["view", "grant", "revoke"],
  claim_review: ["view", "approve", "reject", "finalize"],
  platform_user: ["view", "create", "update", "set_role"],
  platform_role: ["view", "create", "update", "delete"],
  org_member: ["view", "invite", "update_role", "remove"],
  org_role: ["view", "create", "update", "delete"],
  notification: ["view", "mark_read"],
} as const

export type ResourceKey = keyof typeof RESOURCES
export type PermissionMap = Record<string, string[]>
export type AccessScope = "platform" | "organization"

/** Canonical column order for the permission matrix. */
export const ALL_ACTIONS = [
  "view",
  "create",
  "update",
  "delete",
  "resubmit",
  "shortlist",
  "reject",
  "hire",
  "follow_up",
  "schedule",
  "close",
  "upload_signed",
  "download",
  "scan",
  "submit_survey",
  "approve",
  "return",
  "grant",
  "revoke",
  "finalize",
  "set_role",
  "invite",
  "update_role",
  "remove",
  "mark_read",
] as const

export type CatalogAction = (typeof ALL_ACTIONS)[number]

export const MODULES = [
  {
    module: "seeker",
    scope: "platform",
    resources: [
      "seeker_profile",
      "resume",
      "seeker_application",
      "tvet_attendance",
      "tvet_certificate",
    ],
  },
  {
    module: "employer",
    scope: "both",
    resources: ["company", "vacancy", "applicant", "interview"],
  },
  {
    module: "tvet",
    scope: "both",
    resources: ["tvet_rfp", "tvet_session", "tvet_claim"],
  },
  {
    module: "pasak",
    scope: "platform",
    resources: ["company_review", "vacancy_review", "tvet_capability", "claim_review"],
  },
  {
    module: "administration",
    scope: "platform",
    resources: ["platform_user", "platform_role"],
  },
  {
    module: "company_access",
    scope: "both",
    resources: ["org_member", "org_role"],
  },
  {
    module: "shared",
    scope: "both",
    resources: ["notification"],
  },
] as const satisfies readonly {
  module: string
  scope: "platform" | "organization" | "both"
  resources: readonly ResourceKey[]
}[]

function pick<K extends ResourceKey>(keys: readonly K[]) {
  return Object.fromEntries(keys.map((key) => [key, RESOURCES[key]])) as Pick<
    typeof RESOURCES,
    K
  >
}

export const PLATFORM_RESOURCE_KEYS = [
  "seeker_profile",
  "resume",
  "seeker_application",
  "tvet_attendance",
  "tvet_certificate",
  "company",
  "vacancy",
  "applicant",
  "interview",
  "tvet_rfp",
  "tvet_session",
  "tvet_claim",
  "company_review",
  "vacancy_review",
  "tvet_capability",
  "claim_review",
  "platform_user",
  "platform_role",
  "org_member",
  "org_role",
  "notification",
] as const

export const ORGANIZATION_RESOURCE_KEYS = [
  "company",
  "vacancy",
  "applicant",
  "interview",
  "tvet_rfp",
  "tvet_session",
  "tvet_claim",
  "org_member",
  "org_role",
  "notification",
] as const

export const platformResourceStatements = pick(PLATFORM_RESOURCE_KEYS)
export const organizationResourceStatements = pick(ORGANIZATION_RESOURCE_KEYS)

export function actionsFor(resource: string): readonly string[] {
  return RESOURCES[resource as ResourceKey] ?? []
}

export function resourceKeysForScope(scope: AccessScope): readonly ResourceKey[] {
  return scope === "platform" ? PLATFORM_RESOURCE_KEYS : ORGANIZATION_RESOURCE_KEYS
}

/** Modules that contain at least one resource available in the scope. */
export function modulesForScope(scope: AccessScope) {
  const available = new Set<string>(resourceKeysForScope(scope))
  return MODULES.map((group) => ({
    module: group.module,
    resources: group.resources.filter((resource) => available.has(resource)),
  })).filter((group) => group.resources.length > 0)
}

/** Action columns to render for a group of resources, in canonical order. */
export function actionColumns(resources: readonly string[]) {
  const used = new Set(resources.flatMap((resource) => actionsFor(resource)))
  return ALL_ACTIONS.filter((action) => used.has(action))
}

export function fullPermissions(
  statements: Record<string, readonly string[]>,
): PermissionMap {
  return Object.fromEntries(
    Object.entries(statements).map(([resource, actions]) => [resource, [...actions]]),
  )
}

export function hasPermission(
  permissions: PermissionMap | null | undefined,
  resource: string,
  action: string,
) {
  return Boolean(permissions?.[resource]?.includes(action))
}

export function togglePermission(
  permissions: PermissionMap,
  resource: string,
  action: string,
  enabled: boolean,
): PermissionMap {
  const current = permissions[resource] ?? []
  const next = enabled
    ? actionsFor(resource).filter(
        (item) => current.includes(item) || item === action,
      )
    : current.filter((item) => item !== action)

  const result = { ...permissions }
  if (next.length > 0) {
    result[resource] = [...next]
  } else {
    delete result[resource]
  }
  return result
}

/** Turns every action of a resource on or off at once. */
export function toggleResource(
  permissions: PermissionMap,
  resource: string,
  enabled: boolean,
): PermissionMap {
  const result = { ...permissions }
  if (enabled) {
    result[resource] = [...actionsFor(resource)]
  } else {
    delete result[resource]
  }
  return result
}

export function countPermissions(permissions: PermissionMap) {
  return Object.values(permissions).reduce((total, actions) => total + actions.length, 0)
}

export function sanitizePermissions(
  permissions: PermissionMap | null | undefined,
  scope: AccessScope,
): PermissionMap {
  const allowed = new Set<string>(resourceKeysForScope(scope))
  const result: PermissionMap = {}
  if (!permissions) {
    return result
  }
  for (const [resource, actions] of Object.entries(permissions)) {
    if (!allowed.has(resource) || !Array.isArray(actions)) {
      continue
    }
    const kept = actionsFor(resource).filter((action) => actions.includes(action))
    if (kept.length > 0) {
      result[resource] = [...kept]
    }
  }
  return result
}
