// Components
export { AccountMenu } from "./components/account-menu";
export { Can } from "./components/can";
export { PermissionGate } from "./components/permission-gate";
export { RoleGate } from "./components/role-gate";
export { RoleSignUpForm } from "./components/role-signup-form";
export { SessionActions } from "./components/session-actions";
export { SignInForm } from "./components/sign-in-form";
export { WorkspaceSwitcher } from "./components/workspace-switcher";

// Hooks
export { usePermission, usePlatformPermissions } from "./hooks/use-permission";

// Client & Shared Helpers
export {
  type DeviceAccount,
  type DeviceKind,
  type UserSession,
  MAX_DEVICE_ACCOUNTS,
  deviceKindFromUserAgent,
  portalHomeForRole,
  roleLabel,
} from "./lib/sessions";

export {
  type Workspace,
  WORKSPACES,
  activeWorkspaceOf,
  canSwitchWorkspace,
  isWorkspace,
  portalHomeForWorkspace,
} from "./lib/workspace";

// Server Authorization Queries (RSC & Server Actions)
export {
  type ServerSession,
  type SessionUser,
  getServerSession,
  requireAuth,
  requirePermission,
  requireRole,
  requireWorkspace,
} from "./actions/auth.query.server";
