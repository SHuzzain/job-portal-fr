"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { useDeviceAccounts } from "@/features/auth/hooks/use-device-accounts";
import { roleLabel } from "@/features/auth/lib/sessions";
import { useRouter } from "@/i18n/navigation";

export function MultiSessionPanel() {
  const t = useTranslations("Settings");
  const router = useRouter();
  const { accounts, atLimit, error, isPending, removeAccount, switchAccount } =
    useDeviceAccounts();
  const [pendingToken, setPendingToken] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function run(
    sessionToken: string,
    action: () => Promise<string | null>,
    failed: string
  ) {
    setPendingToken(sessionToken);
    setActionError(null);
    const message = await action();
    setPendingToken(null);
    if (message) {
      setActionError(failed);
    }
  }

  if (isPending) {
    return <p className="text-sm text-muted-foreground">…</p>;
  }

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-medium">{t("accountsTitle")}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("accountsHint")}
          </p>
        </div>
        <Button
          size="sm"
          disabled={atLimit}
          onClick={() => router.push("/sign-in?addAccount=1&next=/settings")}
        >
          {t("addAccount")}
        </Button>
      </div>
      {atLimit ? (
        <p className="text-sm text-muted-foreground">{t("accountLimit")}</p>
      ) : null}
      {error ? (
        <p className="text-sm text-destructive">{t("loadError")}</p>
      ) : null}
      {actionError ? (
        <p className="text-sm text-destructive">{actionError}</p>
      ) : null}

      <section className="grid gap-3">
        <h3 className="text-sm font-medium">{t("sameBrowser")}</h3>
        {accounts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("emptyAccounts")}</p>
        ) : (
          <ul className="grid gap-3">
            {accounts.map((account) => (
              <li
                key={account.sessionToken}
                className="grid gap-2 rounded-md border border-border p-3 text-sm"
              >
                <div>
                  <p>{account.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {account.email}
                    {roleLabel(account.role)
                      ? ` · ${roleLabel(account.role)}`
                      : ""}
                    {account.isActive ? ` · ${t("current")}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {account.isActive ? null : (
                    <Button
                      size="xs"
                      variant="outline"
                      disabled={pendingToken === account.sessionToken}
                      onClick={() =>
                        void run(
                          account.sessionToken,
                          () =>
                            switchAccount(account.sessionToken, {
                              redirect: false,
                            }),
                          t("switchError")
                        )
                      }
                    >
                      {t("switchAccount")}
                    </Button>
                  )}
                  <Button
                    size="xs"
                    variant="outline"
                    disabled={pendingToken === account.sessionToken}
                    onClick={() => {
                      if (!window.confirm(t("confirmRemove"))) {
                        return;
                      }
                      void run(
                        account.sessionToken,
                        () => removeAccount(account.sessionToken),
                        t("removeError")
                      );
                    }}
                  >
                    {t("removeAccount")}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
