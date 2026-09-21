import { headers } from "next/headers";
import { forbidden, redirect, unauthorized } from "next/navigation";

import {
  type CatalogAction,
  type PermissionMap,
  type ResourceKey,
  hasPermission,
} from "@/connector/access/catalog";
import {
  type Workspace,
  activeWorkspaceOf,
} from "@/features/auth/lib/workspace";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role?: string;
  accountStatus?: string;
  hasTvetCapability?: boolean;
  activeWorkspace?: Workspace;
  permissions?: PermissionMap;
  image?: string | null;
  emailVerified?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type ServerSession = {
  user: SessionUser;
  session: {
    id: string;
    userId: string;
    expiresAt: string | Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    activeOrganizationId?: string | null;
  };
};

function apiBase() {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) {
    throw new Error("NEXT_PUBLIC_API_URL is not set");
  }
  return base.replace(/\/$/, "");
}

/**
 * Fetches the active Better-Auth session on the server inside RSC, Route Handlers,
 * or Server Actions with full customSession metadata (role, permissions, activeWorkspace).
 */
export async function getServerSession(): Promise<ServerSession | null> {
  try {
    const requestHeaders = await headers();
    const cookie = requestHeaders.get("cookie");

    if (!cookie) {
      return null;
    }

    const response = await fetch(`${apiBase()}/api/auth/get-session`, {
      method: "GET",
      headers: {
        cookie,
        "content-type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as ServerSession | null;
    return data;
  } catch {
    return null;
  }
}

/**
 * Ensures the user is authenticated on the server.
 * If not authenticated, triggers Next.js unauthorized() (or redirects if redirectTo is provided).
 */
export async function requireAuth(options?: {
  redirectTo?: string;
}): Promise<ServerSession> {
  const session = await getServerSession();

  if (!session?.user) {
    if (options?.redirectTo) {
      redirect(options.redirectTo);
    }
    unauthorized();
  }

  return session;
}

/**
 * Server-side gate that asserts the user has a specific resource permission.
 * Throws unauthorized() if not logged in, or forbidden() if permission is missing.
 */
export async function requirePermission(
  resource: ResourceKey | string,
  action: CatalogAction | string = "view"
): Promise<ServerSession> {
  const session = await requireAuth();
  const permissions = session.user.permissions ?? {};

  const allowed = hasPermission(permissions, resource, action);
  if (!allowed) {
    forbidden();
  }

  return session;
}

/**
 * Server-side gate that asserts the user has one of the specified platform roles.
 */
export async function requireRole(
  allowedRoles: string | string[]
): Promise<ServerSession> {
  const session = await requireAuth();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const userRole = session.user.role ?? "";

  if (!roles.includes(userRole)) {
    forbidden();
  }

  return session;
}

/**
 * Server-side gate that asserts the active workspace matches the required workspace.
 */
export async function requireWorkspace(
  expectedWorkspace: Workspace
): Promise<ServerSession> {
  const session = await requireAuth();
  const current = activeWorkspaceOf(session.user);

  if (current !== expectedWorkspace) {
    forbidden();
  }

  return session;
}
