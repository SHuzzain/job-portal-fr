export const WORKSPACES = ["employer", "training_provider"] as const

export type Workspace = (typeof WORKSPACES)[number]

type WorkspaceUser = {
  role?: unknown
  hasTvetCapability?: unknown
  activeWorkspace?: unknown
}

export function isWorkspace(value: unknown): value is Workspace {
  return value === "employer" || value === "training_provider"
}

export function canSwitchWorkspace(user: WorkspaceUser | null | undefined) {
  return user?.hasTvetCapability === true
}

export function activeWorkspaceOf(user: WorkspaceUser | null | undefined): Workspace {
  if (canSwitchWorkspace(user) && user?.activeWorkspace === "training_provider") {
    return "training_provider"
  }

  return "employer"
}

export function portalHomeForWorkspace(workspace: Workspace) {
  return workspace === "training_provider" ? "/employer/tvet" : "/employer"
}
