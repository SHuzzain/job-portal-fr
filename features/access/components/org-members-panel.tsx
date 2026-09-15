"use client";

import { useEffect, useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import { RESERVED_ORG_ROLES } from "@/connector/access/organization";

type OrgMember = {
  id: string;
  role: string;
  user?: { email?: string; name?: string };
};

function asMembers(payload: unknown): OrgMember[] {
  if (!payload || typeof payload !== "object") {
    return [];
  }
  const members = "members" in payload ? payload.members : payload;
  if (!Array.isArray(members)) {
    return [];
  }
  return members.filter((member): member is OrgMember =>
    Boolean(member && typeof member === "object" && "id" in member)
  );
}

function asRoleNames(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload
      .map((role) =>
        role &&
        typeof role === "object" &&
        "role" in role &&
        typeof role.role === "string"
          ? role.role
          : null
      )
      .filter((role): role is string => Boolean(role));
  }
  if (
    payload &&
    typeof payload === "object" &&
    "roles" in payload &&
    Array.isArray(payload.roles)
  ) {
    return asRoleNames(payload.roles);
  }
  return [];
}

export function OrgMembersPanel({
  organizationId,
}: {
  organizationId: string;
}) {
  const t = useTranslations("Access");
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [roleNames, setRoleNames] = useState<string[]>([]);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("admin");
  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const roleOptions = [
    ...RESERVED_ORG_ROLES.filter((role) => role !== "owner"),
    ...roleNames,
  ];

  async function refresh() {
    setLoading(true);
    const [memberResult, roleResult] = await Promise.all([
      authClient.organization.listMembers(),
      authClient.organization.listRoles(),
    ]);
    setLoading(false);
    if (memberResult.error) {
      setError(memberResult.error.message ?? t("loadError"));
    } else {
      setMembers(asMembers(memberResult.data));
    }
    if (!roleResult.error) {
      setRoleNames(asRoleNames(roleResult.data));
    }
  }

  useEffect(() => {
    void refresh();
  }, [organizationId]);

  return (
    <div className="grid gap-8">
      <section className="grid gap-3">
        <div>
          <h2 className="font-medium">{t("inviteMember")}</h2>
          <p className="text-sm text-muted-foreground">{t("inviteHint")}</p>
        </div>
        <form
          className="grid max-w-md gap-3 text-sm"
          onSubmit={async (event) => {
            event.preventDefault();
            setError(null);
            setPending(true);
            const result = await authClient.organization.inviteMember({
              email: inviteEmail,
              role: inviteRole,
            });
            setPending(false);
            if (result.error) {
              setError(result.error.message ?? t("inviteError"));
              return;
            }
            setInviteEmail("");
            await refresh();
          }}
        >
          <label className="grid gap-1">
            <span>{t("email")}</span>
            <input
              required
              type="email"
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={inviteEmail}
              onChange={(event) => setInviteEmail(event.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span>{t("orgRole")}</span>
            <select
              className="rounded-md border border-input bg-background px-2 py-1.5"
              value={inviteRole}
              onChange={(event) => setInviteRole(event.target.value)}
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? t("saving") : t("inviteMember")}
          </Button>
        </form>
      </section>

      <section className="grid gap-3">
        <h2 className="font-medium">{t("members")}</h2>
        {loading ? <p className="text-sm text-muted-foreground">…</p> : null}
        {!loading && members.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("membersEmpty")}</p>
        ) : (
          <ul className="grid gap-2 text-sm">
            {members.map((member) => (
              <li
                key={member.id}
                className="grid gap-2 rounded-md border border-border p-3"
              >
                <p>{member.user?.name ?? member.user?.email ?? member.id}</p>
                <p className="text-muted-foreground">{member.user?.email}</p>
                <label className="grid gap-1">
                  <span>{t("orgRole")}</span>
                  <select
                    className="rounded-md border border-input bg-background px-2 py-1.5"
                    value={member.role}
                    onChange={async (event) => {
                      setError(null);
                      const result =
                        await authClient.organization.updateMemberRole({
                          memberId: member.id,
                          role: event.target.value,
                        });
                      if (result.error) {
                        setError(result.error.message ?? t("setRoleError"));
                        return;
                      }
                      await refresh();
                    }}
                  >
                    {[member.role, ...roleOptions]
                      .filter((role, index, all) => all.indexOf(role) === index)
                      .map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                  </select>
                </label>
              </li>
            ))}
          </ul>
        )}
      </section>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
