"use client";

import { useEffect, useState } from "react";

import { authClient } from "@/connector";
import {
  ORGANIZATION_RESOURCE_KEYS,
  type PermissionMap,
  hasPermission,
} from "@/connector/access/catalog";

import { activeWorkspaceOf } from "../lib/workspace";

const tvetWorkspaceResources = new Set([
  "tvet_rfp",
  "tvet_session",
  "tvet_claim",
]);
const employerWorkspaceResources = new Set([
  "vacancy",
  "applicant",
  "interview",
]);

const organizationResources = new Set<string>(ORGANIZATION_RESOURCE_KEYS);

/** Permissions attached to the session by the API's customSession plugin. */
export function usePlatformPermissions() {
  const { data, isPending } = authClient.useSession();
  const raw = (data?.user as { permissions?: unknown } | undefined)
    ?.permissions;
  const permissions: PermissionMap =
    raw && typeof raw === "object" ? (raw as PermissionMap) : {};

  return { permissions, session: data, isPending };
}

type PermissionState = {
  allowed: boolean;
  isPending: boolean;
  authenticated: boolean;
};

/**
 * Resolves a resource/action against the platform role first, then the active
 * company role for resources that exist at company scope.
 */
export function usePermission(
  resource: string,
  action = "view"
): PermissionState {
  const { permissions, session, isPending } = usePlatformPermissions();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [orgAllowed, setOrgAllowed] = useState<boolean | null>(null);

  const platformAllowed = hasPermission(permissions, resource, action);
  const checksOrganization =
    !platformAllowed &&
    Boolean(session) &&
    Boolean(activeOrganization?.id) &&
    organizationResources.has(resource);

  useEffect(() => {
    if (!checksOrganization) {
      setOrgAllowed(null);
      return;
    }

    let active = true;
    setOrgAllowed(null);
    void authClient.organization
      .hasPermission({ permissions: { [resource]: [action] } } as never)
      .then((result) => {
        if (active) {
          setOrgAllowed(Boolean(result.data?.success));
        }
      })
      .catch(() => {
        if (active) {
          setOrgAllowed(false);
        }
      });

    return () => {
      active = false;
    };
  }, [checksOrganization, resource, action, activeOrganization?.id]);

  if (isPending) {
    return { allowed: false, isPending: true, authenticated: false };
  }

  if (!session) {
    return { allowed: false, isPending: false, authenticated: false };
  }

  const role =
    "role" in session.user && typeof session.user.role === "string"
      ? session.user.role
      : "";
  if (role !== "admin" && role !== "super_admin") {
    const workspace = activeWorkspaceOf(session.user);
    if (
      tvetWorkspaceResources.has(resource) &&
      workspace !== "training_provider"
    ) {
      return { allowed: false, isPending: false, authenticated: true };
    }
    if (employerWorkspaceResources.has(resource) && workspace !== "employer") {
      return { allowed: false, isPending: false, authenticated: true };
    }
  }

  if (platformAllowed) {
    return { allowed: true, isPending: false, authenticated: true };
  }

  if (checksOrganization) {
    return {
      allowed: orgAllowed === true,
      isPending: orgAllowed === null,
      authenticated: true,
    };
  }

  return { allowed: false, isPending: false, authenticated: true };
}
