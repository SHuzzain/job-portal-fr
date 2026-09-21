import { notFound } from "next/navigation";

import { apiServer } from "@/connector/server";
import { requireAuth } from "@/features/auth/actions/auth.query.server";

export type WorkspaceMember = {
  id: string;
  userId: string;
  role: string;
  createdAt: string | Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  };
};

export type WorkspaceOrganization = {
  id: string;
  name: string;
  slug: string;
  logo?: string | null;
  status: "PENDING_APPROVAL" | "APPROVED" | "RETURNED_FOR_CORRECTION" | string;
  ssmNumber?: string | null;
  ssmDocumentUrl?: string | null;
  legalName?: string | null;
  industry?: string | null;
  website?: string | null;
  address?: string | null;
  reviewNotes?: string | null;
  createdAt: string | Date;
  members?: WorkspaceMember[];
};

export type FullOrganizationResponse = WorkspaceOrganization & {
  members: WorkspaceMember[];
};

/**
 * Fetches the full organization by slug with members via Better-Auth server endpoint.
 */
export async function getWorkspaceBySlug(
  slug: string
): Promise<FullOrganizationResponse | null> {
  try {
    const data = await apiServer<FullOrganizationResponse>(
      `/api/auth/organization/get-full-organization?organizationSlug=${encodeURIComponent(slug)}`,
      {
        revalidate: 60,
        tags: [`workspace-${slug}`, "workspaces"],
      }
    );
    return data ?? null;
  } catch {
    return null;
  }
}

/**
 * Lists all organizations the authenticated user belongs to.
 */
export async function listUserWorkspaces(): Promise<WorkspaceOrganization[]> {
  try {
    const data = await apiServer<WorkspaceOrganization[]>(
      "/api/auth/organization/list",
      {
        revalidate: 60,
        tags: ["user-workspaces"],
      }
    );
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/**
 * Resolves workspace context by slug and asserts the authenticated user is a verified member.
 * Throws notFound() if workspace doesn't exist, or returns session & workspace details.
 */
export async function requireWorkspaceAccess(slug: string) {
  const session = await requireAuth();
  const workspace = await getWorkspaceBySlug(slug);

  if (!workspace) {
    notFound();
  }

  const userId = session.user.id;
  const isMember =
    workspace.members?.some((member) => member.userId === userId) ?? false;

  // Platform admin can also inspect workspaces
  const isAdmin =
    session.user.role === "admin" || session.user.role === "super_admin";

  if (!isMember && !isAdmin) {
    return {
      session,
      workspace,
      membership: null,
      isMember: false,
    };
  }

  const membership =
    workspace.members?.find((member) => member.userId === userId) ?? null;

  return {
    session,
    workspace,
    membership,
    isMember: true,
  };
}
