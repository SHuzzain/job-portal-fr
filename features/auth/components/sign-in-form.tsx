"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import { useRouter } from "@/i18n/navigation";

import { useDeviceAccounts } from "../hooks/use-device-accounts";

export function SignInForm({
  addAccount = false,
  nextPath = "/employer",
}: {
  addAccount?: boolean;
  nextPath?: string;
}) {
  const t = useTranslations("Auth");
  const settings = useTranslations("Settings");
  const router = useRouter();
  const { atLimit, isPending: accountsPending } = useDeviceAccounts();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  if (addAccount && !accountsPending && atLimit) {
    return (
      <p className="text-sm text-muted-foreground">
        {settings("accountLimit")}
      </p>
    );
  }

  return (
    <form
      className="grid max-w-md gap-3 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);
        const result = await authClient.signIn.email({ email, password });
        setPending(false);
        if (result.error) {
          setError(result.error.message ?? t("signInError"));
          return;
        }
        router.push(nextPath);
        router.refresh();
      }}
    >
      <label className="grid gap-1">
        <span>{t("email")}</span>
        <input
          required
          type="email"
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="grid gap-1">
        <span>{t("password")}</span>
        <input
          required
          type="password"
          minLength={8}
          className="rounded-md border border-input bg-background px-2 py-1.5"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <Button type="submit" disabled={pending}>
        {pending ? t("signingIn") : addAccount ? t("addAccount") : t("signIn")}
      </Button>
      {error ? <p className="text-destructive">{error}</p> : null}
    </form>
  );
}
