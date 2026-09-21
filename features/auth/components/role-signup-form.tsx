"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { authClient } from "@/connector";
import { useRouter } from "@/i18n/navigation";

type RoleSignUpFormProps = {
  defaultRole: "employer" | "jobseeker";
  redirectPath?: string;
};

export function RoleSignUpForm({
  defaultRole,
  redirectPath,
}: RoleSignUpFormProps) {
  const t = useTranslations("Auth");
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="grid max-w-md gap-4 text-sm"
      onSubmit={async (event) => {
        event.preventDefault();
        setError(null);
        setPending(true);
        const result = await authClient.signUp.email(
          { name, email, password },
          { body: { accountType: defaultRole, phoneNumber } }
        );
        setPending(false);
        if (result.error) {
          setError(result.error.message ?? t("signUpError"));
          return;
        }
        const target =
          redirectPath ??
          (defaultRole === "employer" ? "/employer" : "/seeker");
        router.push(target);
      }}
    >
      <label className="grid gap-1">
        <span className="font-medium">{t("name")}</span>
        <input
          required
          placeholder="e.g. John Doe"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
      </label>

      <label className="grid gap-1">
        <span className="font-medium">{t("email")}</span>
        <input
          required
          type="email"
          placeholder="name@company.com"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>

      <label className="grid gap-1">
        <span className="font-medium">{t("password")}</span>
        <input
          required
          type="password"
          minLength={8}
          placeholder="At least 8 characters"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>

      <label className="grid gap-1">
        <span className="font-medium">Phone Number</span>
        <input
          type="tel"
          placeholder="+60123456789"
          className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-ring focus:outline-none"
          value={phoneNumber}
          onChange={(event) => setPhoneNumber(event.target.value)}
        />
      </label>

      <Button type="submit" disabled={pending} className="mt-2 w-full">
        {pending ? t("signingUp") : t("signUp")}
      </Button>

      {error ? (
        <p className="rounded-md bg-destructive/10 p-2 text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </form>
  );
}
