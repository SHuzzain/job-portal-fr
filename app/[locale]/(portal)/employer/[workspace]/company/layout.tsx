import { Link } from "@/i18n/navigation";

type CompanyLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ workspace: string }>;
};

export default async function WorkspaceCompanyLayout({
  children,
  params,
}: CompanyLayoutProps) {
  const { workspace: slug } = await params;
  const base = `/employer/${slug}/company`;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Company Settings & Administration
        </h1>
        <p className="mt-1 text-xs text-muted-foreground">
          Manage legal information, team members, and role permissions.
        </p>
      </div>

      <div className="flex items-center gap-2 border-b border-border pb-2 text-xs font-medium">
        <Link
          href={`${base}/profile`}
          className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Company Profile
        </Link>
        <Link
          href={`${base}/staff`}
          className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Team & Members
        </Link>
        <Link
          href={`${base}/roles`}
          className="rounded-md px-3 py-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          Organization Roles
        </Link>
      </div>

      <div>{children}</div>
    </div>
  );
}
