import { getTranslations } from "next-intl/server";

import { NavButton } from "@/components/nav-button";
import { Link } from "@/i18n/navigation";

export default async function RegisterHubPage() {
  const t = await getTranslations("Auth");

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold">{t("signUpTitle")}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose your account type to get started with the portal.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/register/seeker"
          className="group flex flex-col justify-between rounded-xl border border-border p-5 transition hover:border-primary hover:bg-muted/40"
        >
          <div>
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              🔍
            </div>
            <h2 className="font-semibold text-foreground">Job Seeker</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Search vacancies, apply to verified employers, and track
              interviews.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
            Register as Seeker →
          </span>
        </Link>

        <Link
          href="/register/employer"
          className="group flex flex-col justify-between rounded-xl border border-border p-5 transition hover:border-primary hover:bg-muted/40"
        >
          <div>
            <div className="mb-2 inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground">
              🏢
            </div>
            <h2 className="font-semibold text-foreground">Employer</h2>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Post jobs, manage company workspaces, evaluate candidates, and run
              hiring pipelines.
            </p>
          </div>
          <span className="mt-4 inline-flex items-center text-xs font-medium text-primary">
            Register as Employer →
          </span>
        </Link>
      </div>

      <div className="border-t border-border pt-4">
        <NavButton href="/sign-in" variant="outline" className="w-full">
          {t("haveAccount")}
        </NavButton>
      </div>
    </div>
  );
}
