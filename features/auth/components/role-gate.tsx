"use client";

import React from "react";

import { authClient } from "@/connector";

type RoleGateProps = {
  roles: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
};

/**
 * Renders children only if the current user possesses one of the specified platform roles.
 */
export function RoleGate({ roles, fallback = null, children }: RoleGateProps) {
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return null;
  }

  const role =
    session?.user &&
    "role" in session.user &&
    typeof session.user.role === "string"
      ? session.user.role
      : "";

  const allowedRoles = Array.isArray(roles) ? roles : [roles];
  const isAllowed = allowedRoles.includes(role);

  if (!isAllowed) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
