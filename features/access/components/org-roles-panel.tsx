"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { NavButton } from "@/components/nav-button";
import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import {
  type PermissionMap,
  sanitizePermissions,
} from "@/connector/access/catalog";
import {
  BUILTIN_ORG_PERMISSIONS,
  RESERVED_ORG_ROLES,
} from "@/connector/access/organization";

import { PermissionSummary } from "./permission-summary";

type OrgRole = {
  id?: string;
  role: string;
  permission?: PermissionMap;
};

function asRoles(payload: unknown): OrgRole[] {
  if (Array.isArray(payload)) {
    return payload.filter((role): role is OrgRole =>
      Boolean(role && typeof role === "object" && "role" in role)
    );
  }
  if (
    payload &&
    typeof payload === "object" &&
    "roles" in payload &&
    Array.isArray(payload.roles)
  ) {
    return asRoles(payload.roles);
  }
  return [];
}

export function OrgRolesPanel({ organizationId }: { organizationId: string }) {
  const t = useTranslations("Access");
  const [roles, setRoles] = useState<OrgRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    setLoading(true);
    const result = await authClient.organization.listRoles();
    setLoading(false);
    if (result.error) {
      setError(result.error.message ?? t("loadError"));
      return;
    }
    setRoles(asRoles(result.data));
  }

  useEffect(() => {
    void refresh();
  }, [organizationId]);

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="font-medium">{t("orgRoles")}</h2>
          <p className="text-sm text-muted-foreground">{t("orgRoleHint")}</p>
        </div>
        <NavButton href="/employer/access/roles/new" size="sm">
          {t("createRole")}
        </NavButton>
      </div>

      {loading ? <p className="text-sm text-muted-foreground">…</p> : null}

      <ul className="grid gap-3">
        {RESERVED_ORG_ROLES.map((role) => (
          <li
            key={role}
            className="grid gap-2 rounded-md border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{role}</p>
              <span className="text-xs text-muted-foreground">
                {t("builtinRole")}
              </span>
            </div>
            <PermissionSummary
              permissions={BUILTIN_ORG_PERMISSIONS[role] ?? {}}
            />
          </li>
        ))}
        {roles.map((role) => (
          <li
            key={role.id ?? role.role}
            className="grid gap-2 rounded-md border border-border p-3"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{role.role}</p>
              <Button
                size="xs"
                variant="destructive"
                onClick={async () => {
                  setError(null);
                  const result = role.id
                    ? await authClient.organization.deleteRole({
                        roleId: role.id,
                      })
                    : await authClient.organization.deleteRole({
                        roleName: role.role,
                      });
                  if (result.error) {
                    setError(result.error.message ?? t("deleteRoleError"));
                    return;
                  }
                  await refresh();
                }}
              >
                {t("deleteRole")}
              </Button>
            </div>
            <PermissionSummary
              permissions={sanitizePermissions(role.permission, "organization")}
            />
          </li>
        ))}
      </ul>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
