"use client";

import { usePathname } from "next/navigation";
import React from "react";

import { authClient } from "@/connector";
import { Link } from "@/i18n/navigation";

import type { WorkspaceOrganization } from "../actions/workspace.query.server";
import { CompanySwitcher } from "./company-switcher";

type WorkspaceSidebarProps = {
  workspace: WorkspaceOrganization;
};

export function WorkspaceSidebar({ workspace }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const hasTvet = Boolean(
    session?.user &&
    "hasTvetCapability" in session.user &&
    session.user.hasTvetCapability
  );

  const base = `/employer/${workspace.slug}`;

  const navItems = [
    { label: "Dashboard", href: `${base}/dashboard`, icon: "📊" },
    { label: "Jobs", href: `${base}/jobs`, icon: "💼" },
    { label: "Candidates", href: `${base}/candidates`, icon: "👥" },
    { label: "Interviews", href: `${base}/interviews`, icon: "🗓️" },
    { label: "Company Profile", href: `${base}/company/profile`, icon: "🏢" },
    { label: "Team & Staff", href: `${base}/company/staff`, icon: "👤" },
    { label: "Roles & Access", href: `${base}/company/roles`, icon: "🔐" },
    { label: "Finance & Claims", href: `${base}/finance/reports`, icon: "💰" },
    ...(hasTvet
      ? [{ label: "TVET Provider", href: `${base}/tvet`, icon: "🎓" }]
      : []),
  ];

  return (
    <aside className="w-full shrink-0 border-b border-border bg-card/50 p-4 md:min-h-screen md:w-64 md:border-r md:border-b-0">
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Workspace
          </span>
          <CompanySwitcher currentSlug={workspace.slug} />
        </div>

        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== `${base}/dashboard` &&
                pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-border pt-4">
          <div className="rounded-lg bg-muted/50 p-3 text-xs">
            <div className="font-medium text-foreground">{workspace.name}</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Status:{" "}
              <span className="font-semibold text-primary">
                {workspace.status}
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
